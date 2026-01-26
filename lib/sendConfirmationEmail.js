// import { resend } from "../helpers.js/helpers";

const { resend } = require('../helpers.js/helpers')
const sendConfirmationEmail = async ({ email, name }) => {
    const { data, error } = await resend.emails.send({
        // from: "Chrissy Medical Academy <website@resend.dev>",
        from: "Chrissy Medical Academy <info@chrissymedicalacademy.com>",
           to: [email],
        subject: "Welcome! Your Account Is Ready",
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

module.exports = { sendConfirmationEmail }