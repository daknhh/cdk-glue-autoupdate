import { IndexAutoupdateStackParameters } from "../lib/types/config";

export const config : IndexAutoupdateStackParameters = {
  General: {
    Prefix: "YOURPREFIX",
    ManagementAccountId: "01234567890",
  },
  Glue: [{
    TableName: "cloudtrail_logs_pp",
    DatabaseName: "loggingdb",
    ParameterName: "projection.acc.values"
  },
  {
    TableName: "vpc_flow_logs_pp",
    DatabaseName: "loggingdb",
    ParameterName: "projection.acc.values"
  },
  {
    TableName: "alb_logs_pp_sse",
    DatabaseName: "loggingdb",
    ParameterName: "projection.acc.values"
  }]
};