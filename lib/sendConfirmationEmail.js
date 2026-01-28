// import { resend } from "../helpers.js/helpers";

const { resend } = require('../helpers.js/helpers')
const sendConfirmationEmail = async ({ email, name, subject }) => {
    const { data, error } = await resend.emails.send({
        // from: "Chrissy Medical Academy <website@resend.dev>",
        from: "Chrissy Medical Academy <info@chrissymedicalacademy.com>",
        to: [email],
        subject: subject,
        html: `
      <h2>Welcome ${name} 👋</h2>
      <p>Your account has been successfully created. <br/> 
      You now have full access to your dashboard and courses.
      </p>
      
      <p>Regards,<br/>Team Chrissy Medical Academy</p>
    `,
    });

    if (error) {
        console.error("Email error:", error);
        throw new Error("Failed to send confirmation email");
    }

    return data;
};


const sendRemindersEmail = async ({ email, name, subject, remainingAmount }) => {
    const { data, error } = await resend.emails.send({
        // from: "Chrissy Medical Academy <website@resend.dev>",
        from: "Chrissy Medical Academy <info@chrissymedicalacademy.com>",
        to: [email],
        subject: subject,
        html: `
        <div style="font-family: sans-serif; font-size:14px; line-height: 1.6; color: #333;">
      <h2>Hello ${name},</h2>

    <p>We noticed that your payment for <strong>Sterile/processing </strong> course is still <strong>pending</strong>.<br />
    Your payment is <strong>${remainingAmount}</strong>, Please complete your remaining payment to stop blocking your enrollment and gain full access to the course. <br />
      <p> If you have any questions about your payment, feel free to contact our support. <br /> Thank you for choosing our platform!
    - <strong> Chrissy Medical Academy </strong></p>

    </div>
    `,
    });

    if (error) {
        console.error("Email error:", error);
        throw new Error("Failed to send confirmation email");
    }

    return data;
};

const sendCertificate = async ({ email, name, subject,certificateImageUrl }) => {
    const { data, error } = await resend.emails.send({
        // from: "Chrissy Medical Academy <website@resend.dev>",
        from: "Chrissy Medical Academy <info@chrissymedicalacademy.com>",
        to: [email],
        subject: subject,
        html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:24px;">

    <h2 style="color:#222; margin-bottom:10px;">
      🎉 Congratulations ${name}!
    </h2>

    <p style="font-size:15px; color:#555; line-height:1.6;">
      We’re excited to celebrate your achievement!  
      You have successfully completed your course at
      <strong>Chrissy Medical Academy</strong>.
    </p>

    <p style="font-size:15px; color:#555; line-height:1.6;">
      Your dedication, consistency, and hard work have paid off — and we’re proud to be part of your learning journey.
    </p>

    <!-- Certificate Image -->
    <div style="text-align:center; margin:25px 0;">
      <img
        src="${certificateImageUrl}"
        alt="Certificate"
        style="max-width:100%; border-radius:8px; border:1px solid #ddd;"
      />
    </div>

    <p style="font-size:15px; color:#555; line-height:1.6;">
      📜 <strong>Your Certificate is attached above.</strong>  
      You can download and share it with confidence!
    </p>

    <p style="font-size:15px; color:#555; line-height:1.6;">
      Keep learning, keep growing — we look forward to seeing you achieve even more.
    </p>

    <p style="margin-top:30px; font-size:14px; color:#555;">
      Warm regards,<br/>
      <strong>Team Chrissy Medical Academy</strong>
    </p>

  </div>
</div> `,
    });

    if (error) {
        console.error("Email error:", error);
        throw new Error("Failed to send confirmation email");
    }

    return data;
};
module.exports = { sendConfirmationEmail, sendRemindersEmail, sendCertificate }