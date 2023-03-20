import { StackProps } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";

export interface IndexAutoupdateStackParameters {
    General: {
        Prefix: string,
        /**
         * @TJS-pattern "^[0-9]{12}$"
         */
        ManagementAccountId: string,
    },
    Glue: {
        TableName: string,
        DatabaseName: string,
        ParameterName: string
    }[]
}

export interface IndexAutoupdateStackProps extends StackProps {
    config: IndexAutoupdateStackParameters
}

export interface OrgStackProps extends StackProps {
eventBus: events.EventBus
}