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
function generatePaymentReminderEmail(userName, courseName, paymentStatus, nextPaymentDate, remainingAmount) {
    // Determine message based on payment status
    let statusMessage = '';
    switch (paymentStatus) {
        case 'Full':
        case '100% Complete':
            statusMessage = `Your payment for <strong>${courseName}</strong> is fully complete. Thank you! 🎉`;
            break;
        case 'Partial':
            statusMessage = `Your payment for <strong>${courseName}</strong> is partially complete. Remaining amount: <strong>$${remainingAmount}</strong>.`;
            if (nextPaymentDate) {
                statusMessage += ` Your next installment is due on <strong>${nextPaymentDate}</strong>.`;
            }
            break;
        case 'Pending':
        default:
            statusMessage = `Your payment for <strong>${courseName}</strong> is pending. Please complete your payment to enroll.`;
            break;
    }

    // HTML email
    const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2>Hello ${userName},</h2>
      <p>${statusMessage}</p>
      <p>If you have any questions about your payment, feel free to contact our support.</p>
      <p>Thank you for choosing our platform!</p>
      <hr />
      <p style="font-size: 12px; color: #888;">This is an automated reminder from YourPlatform.</p>
    </div>
  `;

    // Plain text fallback
    const text = `Hello ${userName}, ${statusMessage.replace(/<[^>]+>/g, '')}

    If you have any questions about your payment, feel free to contact our support. Thank you for choosing our platform!
    - Chrissy Medical Academy`;

    return { html, text };
}

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
module.exports = { sendConfirmationEmail, sendRemindersEmail }