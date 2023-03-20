#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { IndexAutoupdateStack } from "../lib/index-autoupdate-stack";
import {OrgEventsRuleBridgeStack } from "../lib/org-events-rule-bridge-stack";
import { config } from "../values/logging";

const app = new cdk.App();
const indexautostack =  new IndexAutoupdateStack(app, config.General.Prefix +"-CF-STACK-GlueIndexAutoupdate", {
  env: { account: "LOGGINGACCOUNTID" ,region: "eu-central-1" },
  config: config
});

new OrgEventsRuleBridgeStack(app, config.General.Prefix + "-CF-STACK-SSO-EVENTRULE", {
  env:{ account: "MANAGEMENTACCOUNTID", region: "us-east-1" },
  eventBus: indexautostack.eventBus
});