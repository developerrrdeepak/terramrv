import sg from "@sendgrid/mail";

function initMailer() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  sg.setApiKey(key);
  return true;
}

export async function sendOtp(email: string, code: string) {
  const ok = initMailer();
  if (!ok) {
    console.log(`[DEV][mailer] OTP for ${email}: ${code}`);
    return;
  }
  const from = process.env.SENDGRID_FROM_EMAIL || "no-reply@terramrv.org";
  const msg = {
    to: email,
    from,
    subject: "Your TerraMRV verification code",
    text: `Your code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your code is <b>${code}</b>. It expires in 10 minutes.</p>`,
  } as any;
  try {
    await sg.send(msg);
  } catch (e: any) {
    console.warn("[mailer] SendGrid error, printing OTP:", e?.message || e);
    console.log(`[DEV][mailer] OTP for ${email}: ${code}`);
  }
}
