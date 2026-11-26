import { google } from "googleapis";
import { googleConfig } from "@/config/app.config";

export const DRIVE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/drive.file",
];

export const makeOAuthCLient = () =>
  new google.auth.OAuth2(
    googleConfig.googleClientId,
    googleConfig.googleClientSecret,
    googleConfig.googleDriveCallbackUrl,
  );
