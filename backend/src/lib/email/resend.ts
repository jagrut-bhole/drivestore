import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import type { SendEmailParams } from "@/types/email.type";
import {
  getEmailChangeEmail,
  getOTPEmail,
  getPasswordChangeEmail,
  getWelcomeEmailHtml,
  projectDeleteUpdate,
  projectSettingChangeEmail,
} from "./template";
import { appConfig, resendMailConfig } from "@/config/app.config";

let resendInstance: Resend | null;

function getResendClient(): Resend | null {
  const resendAPIKey = appConfig.resendApiKey;

  if (!resendAPIKey) {
    console.warn("RESEND_API_KEY is not configured in environment!!");
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(resendAPIKey);
  }
  return resendInstance;
}

const fromEmailName = "noreply@jagrutbhole.in";

export async function sendEmail(params: SendEmailParams) {
  const fromEmail = resendMailConfig.fromEmail || fromEmailName;
  const { to, subject, from } = params;

  const resend = getResendClient();

  if (!resend) {
    console.log(`[Email Mock (No API Key)] To: ${to} | Subject: ${subject}`);
    return { id: `mock-${Date.now()}` };
  }

  const payload: CreateEmailOptions = {
    from: from ?? fromEmail,
    to: Array.isArray(to) ? to : [to],
    subject,
    ...(params.html ? { html: params.html } : {}),
    ...(params.text ? { text: params.text } : {}),
  } as CreateEmailOptions;

  try {
    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("Resend Email Error!!: ", error);
      throw error;
    }

    console.log(`[Email Send] ID: ${data.id} | To: ${to}`);
    return data;
  } catch (err) {
    console.error("Failed to dispatch email via Resend:", err);
    throw err;
  }
}

export function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Drivestore",
    html: getWelcomeEmailHtml(name),
    text: `Hi ${name || "there"}, welcome to Drivestore!!`,
  });
}
