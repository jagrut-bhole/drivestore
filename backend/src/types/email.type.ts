export type SendEmailParams =
  | {
      to: string | string[];
      subject: string;
      html: string;
      text?: string;
      from?: string;
    }
  | {
      to: string | string[];
      subject: string;
      html?: string;
      text: string;
      from?: string;
    };
