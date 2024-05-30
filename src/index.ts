import dotenv from "dotenv";
import twilio from "twilio";
import fs from "fs";
import path from "path";
import type { LogInstance } from "twilio/lib/rest/serverless/v1/service/environment/log";

dotenv.config();

const SAVE_TIME = 10 * 1000; // controls how frequently the logs are saved to disk
setInterval(saveLogChunk, SAVE_TIME);

const {
  ACCOUNT_SID: accountSid,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  FUNCTION_SERVICE_SID,
  FUNCTION_ENVIRONMENT_SID,
  FUNCTION_SID,
} = process.env;
const client = twilio(TWILIO_API_KEY, TWILIO_API_SECRET, { accountSid });

let logs: LogInstance[] = [];
let logCount = 0;

console.log("==script started==");
client.serverless.v1
  .services(FUNCTION_SERVICE_SID)
  .environments(FUNCTION_ENVIRONMENT_SID)
  .logs.each(
    {
      startDate: new Date("2024-05-28T19:43:47.000Z"),
      endDate: new Date("2024-05-30T20:22:47.000Z"),
      functionSid: FUNCTION_SID,
    },
    (log) => {
      logs.push(log);
      logCount++;
    }
  );

const dataDir = path.join(__dirname, "../data");
async function countChunks() {
  const files = await fs.promises.readdir(dataDir);
  console.log(files);

  return files.length;
}

async function saveLogChunk() {
  const logsToSave = [...logs];
  logs = [];

  let lastDateCreated: Date | string = logsToSave[0]?.dateCreated;
  if (!lastDateCreated) return console.log("No logs to save");
  lastDateCreated = new Date(lastDateCreated).toISOString();

  const fileCount = await countChunks();
  const chunkName = `log-${fileCount} ${lastDateCreated}.json`;

  const chunkFile = path.join(dataDir, chunkName);
  fs.writeFileSync(chunkFile, JSON.stringify(logsToSave, null, 2), "utf-8");
  console.log(
    `Saved Logs ${chunkName} \n\tTotal Logs: ${logCount}\n\tThis Chunk: ${logsToSave.length}`
  );
}
