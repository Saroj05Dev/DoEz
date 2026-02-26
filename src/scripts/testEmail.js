/**
 * Quick Brevo SMTP OTP test — simulates the exact OTP flow
 * Usage: node src/scripts/testEmail.js your@email.com
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const nodemailer = require("nodemailer");

const testEmail = process.argv[2];
if (!testEmail) {
    console.error("Usage: node src/scripts/testEmail.js <recipient@email.com>");
    process.exit(1);
}

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

console.log("🔧 Config:", { SMTP_HOST, SMTP_PORT, SMTP_USER, hasPass: !!SMTP_PASS });
console.log("📧 From:", SMTP_USER);
console.log("📨 To:", testEmail);

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

const otp = Math.floor(100000 + Math.random() * 900000).toString();

(async () => {
    try {
        console.log("🔌 Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection OK");

        console.log(`📨 Sending OTP ${otp} to: ${testEmail}`);
        const info = await transporter.sendMail({
            from: `"DoEz / Fixerly" <${SMTP_USER}>`,
            to: testEmail,
            subject: `Your DoEz Verification Code: ${otp}`,
            text: `Your DoEz OTP is ${otp}. Valid for 5 minutes.`,
            html: `
        <div style="font-family:sans-serif;padding:30px;text-align:center;">
          <h2 style="color:#0d9488;">DoEz / Fixerly</h2>
          <p>Your OTP Verification Code</p>
          <div style="background:#f0fdfa;border:2px dashed #0d9488;border-radius:16px;padding:20px;margin:20px 0;">
            <span style="font-size:42px;font-weight:900;color:#0d9488;letter-spacing:10px;">${otp}</span>
          </div>
          <p style="color:#999;font-size:12px;">This code is valid for 5 minutes.</p>
        </div>
      `,
        });
        console.log("✅ Email sent! Message ID:", info.messageId);
        console.log("📬 Check your inbox AND spam/junk folder.");
    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("Full error:", JSON.stringify(err, null, 2));
    }
})();
