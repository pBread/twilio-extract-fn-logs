import dotenv from "dotenv";
import twilio from "twilio";
import fs from "fs";
import path from "path";
import type { LogInstance } from "twilio/lib/rest/serverless/v1/service/environment/log";

dotenv.config();

// controls how frequently the logs are saved to disk
// in miliseconds
const SAVE_TIME = 3 * 1000;

// month index starts at 0; 4 = May
const START_DATE = new Date(2024, 4, 22, 0, 0, 0);
const END_DATE = new Date();
// 2024, 4, 23, 0, 0, 0
const {
  ACCOUNT_SID: accountSid,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  FUNCTION_SERVICE_SID,
  FUNCTION_ENVIRONMENT_SID,
  FUNCTION_SID,
} = process.env;
const client = twilio(TWILIO_API_KEY, TWILIO_API_SECRET, { accountSid });

const dataDir = path.join(__dirname, "../data");

let logs: LogInstance[] = [];
let logCount = 0;

console.log("==script started==");

client.serverless.v1
  .services(FUNCTION_SERVICE_SID)
  .environments(FUNCTION_ENVIRONMENT_SID)
  .logs.each(
    {
      startDate: START_DATE,
      endDate: END_DATE,
      functionSid: FUNCTION_SID,
    },
    (log) => {
      logs.push(log);
      logCount++;
    }
  );

async function countChunks() {
  const files = await fs.promises.readdir(dataDir);
  return files.length;
}

setInterval(saveLogChunk, SAVE_TIME);
async function saveLogChunk() {
  const logsToSave = [...logs];
  logs = [];

  let lastDateCreated: Date | string = logsToSave[0]?.dateCreated;
  if (!lastDateCreated) return console.log("No logs to save");

  let localDateTimeStr =
    lastDateCreated.toLocaleDateString().replaceAll("/", "-") +
    " " +
    lastDateCreated.toTimeString();

  const fileCount = await countChunks();
  const chunkName = `chunk-${fileCount} ${localDateTimeStr}.json`;

  const chunkFile = path.join(dataDir, chunkName);
  fs.writeFileSync(chunkFile, JSON.stringify(logsToSave, null, 2), "utf-8");
  console.log(
    `Saved Chunk: ./data/${chunkName} \n\tTotal Logs: ${logCount}\n\tThis Chunk: ${logsToSave.length}`
  );
}
