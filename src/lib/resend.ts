import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, body, from }: { to: string; subject: string; body: string; from: string }) {
  return resend.emails.send({
    from,
    to,
    subject,
    html: body,
  });
}