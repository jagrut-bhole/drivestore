import { env } from "./env";

export const appConfig = {
  name: "DriveStore API",
  environment: env.NODE_ENV,
  port: env.PORT,
  clientUrl: env.CLIENT_URL,
  resendApiKey: env.RESEND_API_KEY,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development"
};

export const resendMailConfig = {
  fromEmail: env.RESEND_FROM_EMAIL
}

export const googleConfig = {
  googleClientId: env.G_DRIVE_CLIENT_ID,
  googleClientSecret: env.G_DRIVE_CLIENT_SECRET,
  googleDriveCallbackUrl: env.G_DRIVE_REDIRECT_URI
}