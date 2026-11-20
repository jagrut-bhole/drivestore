import { string } from "zod/v3";

function safeName(name: string): string {
  return name ? name : "there";
}

export function getOTPEmail(name: string, otp: string): string {
  return `${safeName(name)}`;
}

export function getWelcomeEmailHtml(name: string): string {
  return `${safeName(name)}`;
}

export function getEmailChangeEmail(
  name: string,
  oldEmail: string,
  newEmail: string,
): string {
  return ``;
}

export function getPasswordChangeEmail(name: string): string {
  return ``;
}

export function projectSettingChangeEmail(
  name: string,
  projectName: string,
): string {
  return ``;
}

export function projectDeleteUpdate(name: string, projectName: string): string {
  return ``;
}
