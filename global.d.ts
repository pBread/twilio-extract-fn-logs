declare namespace NodeJS {
  export interface ProcessEnv {
    ACCOUNT_SID: string;

    TWILIO_API_KEY: string;
    TWILIO_API_SECRET: string;

    FUNCTION_SERVICE_SID: string;
    FUNCTION_SID: string;
  }
}
