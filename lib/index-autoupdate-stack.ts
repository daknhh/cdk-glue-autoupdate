import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as config from "./types/config";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as statement from "cdk-iam-floyd";

export class IndexAutoupdateStack extends cdk.Stack {
  public readonly eventBus: events.EventBus;
  constructor(scope: Construct, id: string, props: config.IndexAutoupdateStackProps) {
    super(scope, id, props);


    /**
   * Event Bus for cross-region events from Organizations
   */
    this.eventBus = new events.EventBus(this, "Central-EventBus", {
      eventBusName: props.config.General.Prefix.toLocaleLowerCase() +  "-glue-index-autoupdate"
    });

    this.eventBus.addToResourcePolicy(new iam.PolicyStatement({
      sid: "allow_management_account_to_put_events",
      principals: [new iam.AnyPrincipal()],
      actions: ["events:PutEvents"],
      conditions: {
        StringEquals: {
          "aws:PrincipalAccount": props.config.General.ManagementAccountId }
      },
      resources: [this.eventBus.eventBusArn]
    }));

    /**
     * Config Parameter for Glue Table Index Autoupdate
     */
    const stringValue =JSON.stringify(props.config.Glue);
    const glueTableIndexAutoupdateConfigurationParameter = new ssm.StringParameter(this, "GlueTableIndexAutoupdateConfigurationParameter", {
      parameterName: "/"+ props.config.General.Prefix + "/Glue/Tables/IndexAutoUpdateConfiguration",
      description: "Parameter to automatically update configuriation parameters of Glue Tables",
      stringValue,
      tier: stringValue.length >= 4096 ? ssm.ParameterTier.ADVANCED : undefined
    });


    /**
     * Node JS Lambda Function send update Glue Index
     */
    const updateGlueIndexFunction = new NodejsFunction(this, "UpdateGlueIndexFunction", {
      memorySize: 256,
      timeout: cdk.Duration.seconds(360),
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "updateGlueIndexe",
      entry: path.join(__dirname, "../lib/resources/lambda/UpdateGlueIndexFunction/index.ts"),
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"]
      },
      environment: {
        GlueConfigSsmParameter: glueTableIndexAutoupdateConfigurationParameter.parameterName
      }
    });
    glueTableIndexAutoupdateConfigurationParameter.grantRead(updateGlueIndexFunction);

    for(const table of props.config.Glue){
      updateGlueIndexFunction.addToRolePolicy(new statement.Glue()
        .allow()
        .toUpdateTable()
        .toGetTable()
        .onTable(table.DatabaseName, table.TableName));
    }

    /**
     * Notification Triggering Assignment Function
     */
    new events.Rule(this, "NotificationRule", {
      eventPattern: {
        source: ["*"],
        detailType: ["*"],
      },
      eventBus: this.eventBus,
      targets: [new targets.LambdaFunction(updateGlueIndexFunction)]
    });
  }}
