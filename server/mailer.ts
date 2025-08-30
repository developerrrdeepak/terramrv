import sg from "@sendgrid/mail";

function initMailer() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  sg.setApiKey(key);
  return true;
}

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const ok = initMailer();
  const from = process.env.SENDGRID_FROM_EMAIL || "no-reply@terramrv.org";
  const msg = { to, from, subject, text, html: html || `<pre>${text}</pre>` } as any;
  if (!ok) {
    console.log(`[DEV][mailer] Email to ${to}: ${subject} -> ${text}`);
    return;
  }
  await sg.send(msg);
}

export async function sendOtp(email: string, code: string) {
  try {
    await sendMail(
      email,
      "Your TerraMRV verification code",
      `Your code is ${code}. It expires in 10 minutes.`,
      `<p>Your code is <b>${code}</b>. It expires in 10 minutes.</p>`,
    );
  } catch (e: any) {
    console.warn("[mailer] error sending OTP:", e?.message || e);
    console.log(`[DEV][mailer] OTP for ${email}: ${code}`);
  }
}
