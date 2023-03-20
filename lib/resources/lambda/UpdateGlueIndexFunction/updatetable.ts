import { GlueClient, GetTableCommandInput, GetTableCommand, UpdateTableCommand } from "@aws-sdk/client-glue";

const client = new GlueClient({});

export async function updateTable(tablename: string, databasename: string, accountid: string, glueParameterName: string) {
  console.log(`♻️ Update ${tablename} in Glue Database ${databasename}`);
  const inputcommand: GetTableCommandInput = {DatabaseName: databasename, Name: tablename };
  const inputCommand = new GetTableCommand(inputcommand);
  const outputGetTableCommand = await client.send(inputCommand);
  if(outputGetTableCommand.Table?.Parameters?.[glueParameterName]){
    if(outputGetTableCommand.Table?.Parameters?.[glueParameterName].split(",").find(existingAccountid => (existingAccountid === accountid))){
      outputGetTableCommand.Table?.Parameters?.[glueParameterName].concat(","+accountid);
      console.log(`➕ Add ${accountid} in to ${glueParameterName} Parameter`);
      const updateCommand = new UpdateTableCommand({DatabaseName: databasename, TableInput: outputGetTableCommand.Table });
      const outputUpdateTableCommand = await client.send(updateCommand);
      console.log(`ℹ️ Status: ${outputUpdateTableCommand.$metadata.httpStatusCode || "UNDEFINED"}`);
    }
  }
}