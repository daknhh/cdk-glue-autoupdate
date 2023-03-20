import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { OrgStackProps } from "./types/config";
import * as iam from "aws-cdk-lib/aws-iam";
import { orgEventPattern } from "./resources/eventpattern";


export class OrgEventsRuleBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrgStackProps) {
    super(scope, id, props);


    const publishingRole = new iam.Role(this, "PublishingRole", {
      assumedBy: new iam.ServicePrincipal("events.amazonaws.com")
    });
    publishingRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [props.eventBus.eventBusArn],
        actions: [
          "events:PutEvents"
        ]
      })
    );

    /**
     * Parameter Store Parameter Changed Event Triggering Autoupdate Glue Index Function
     */
    new events.Rule(this, "OrgEventsRule", {
      eventPattern: orgEventPattern,
      targets: [new targets.EventBus(props.eventBus)]
    });

  }
}