import sgMail from "@sendgrid/mail";
import { env } from "../env.mjs";
sgMail.setApiKey(env.EMAIL_SERVER_PASSWORD);
const emailFrom = env.EMAIL_FROM;

export async function sendEmail(
  recipient: string,
  text: string,
  invoiceId: string,
  userName: string
) {
  const msg = {
    to: recipient,
    from: emailFrom,
    subject: `${userName} ${invoiceId} invoice`,
    text: text,
    html: text,
  };

  const response = await sgMail.send(msg);
  return response[0].statusCode;
}
