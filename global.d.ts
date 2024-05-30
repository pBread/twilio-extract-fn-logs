declare namespace NodeJS {
  export interface ProcessEnv {
    ACCOUNT_SID: string;

    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;

    FUNCTION_SERVICE_SID: string;
    FUNCTION_SID: string;
  }
}
