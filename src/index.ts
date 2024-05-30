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
(async () => {})();
