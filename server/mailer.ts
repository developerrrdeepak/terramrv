import sg from "@sendgrid/mail";

export function initMailer() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) throw new Error("SENDGRID_API_KEY not set");
  sg.setApiKey(key);
}

export async function sendOtp(email: string, code: string) {
  initMailer();
  const from = process.env.SENDGRID_FROM_EMAIL || "no-reply@terramrv.org";
  const msg = {
    to: email,
    from,
    subject: "Your TerraMRV verification code",
    text: `Your code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your code is <b>${code}</b>. It expires in 10 minutes.</p>`,
  } as any;
  await sg.send(msg);
}
