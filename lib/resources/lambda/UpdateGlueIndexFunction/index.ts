import { EventBridgeEvent } from "aws-lambda";
import { AcceptHandshake, CreateAccountResult } from "./types/types";
import {updateTable} from "./updatetable";
import {getGlueTableConfig } from "./services/ssm";
export async function updateGlueIndexe(event: EventBridgeEvent<string, AcceptHandshake | CreateAccountResult> ) {

  console.log("👉 Event was triggered by:", event.source);
  console.debug("📢 Event message:", JSON.stringify(event));

  const glueTables = await getGlueTableConfig();
  let accountid: string | undefined;
  console.log(`🎭 Got ${event.detail.eventName} event`);
  if(event.detail.eventName === "AcceptHandshake"){
    const handshakeevent: AcceptHandshake = event.detail;
    accountid = handshakeevent.responseElements.handshake.parties.find(party => party.type === "ACCOUNT")?.id;
  }
  else if(event.detail.eventName === "CreateAccountResult") {
    const createaccountevent: CreateAccountResult = event.detail;
    accountid = createaccountevent.serviceEventDetails.createAccountStatus.accountId;
  }
  if(accountid != undefined && process.env.GlueParameterName != undefined && process.env.GlueDatabaseName != undefined && glueTables != undefined)
    for(const table of glueTables){
      await updateTable(table.TableName,table.ParameterName,accountid,table.DatabaseName);
    }
  return null;
}
