import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {GlueTableEntry } from "../types/types";
const client = new SSMClient({ region: process.env.AWS_REGION });

const SSMPARAMETER = process.env.GlueConfigSsmParameter;

export async function getGlueTableConfig() {
  const gpCommand = new GetParameterCommand({
    Name: SSMPARAMETER
  });
  const response = await client.send(gpCommand);
  if (response.Parameter && response.Parameter.Value) {
    const glueTableConfig: GlueTableEntry[] = JSON.parse(response.Parameter.Value) as GlueTableEntry[];
    return glueTableConfig;
  }
  return undefined;
}