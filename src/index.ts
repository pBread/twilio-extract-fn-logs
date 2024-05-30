import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();

const {
  ACCOUNT_SID: accountSid,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  FUNCTION_SERVICE_SID,
  FUNCTION_SID,
} = process.env;
const client = twilio(TWILIO_API_KEY, TWILIO_API_SECRET, { accountSid });

console.log("==script started==");
(async () => {
  const envSid = await getEnvironmentSid(FUNCTION_SERVICE_SID);
  console.log(`Environment SID: ${envSid}`);
})();

async function getEnvironmentSid(fnSvcSid: string) {
  const environments = await client.serverless.v1
    .services(fnSvcSid)
    .environments.list();

  if (environments.length !== 1) {
    console.error(
      `Expected one environment, receieved ${environments.length}`,
      environments
    );

    throw Error(`Expected one environment, receieved ${environments.length}`);
  }
  const environmentSid = environments[0].sid;

  if (!environmentSid)
    throw Error(`Invalid Environment SID. Received: ${environmentSid}`);

  return environmentSid;
}
