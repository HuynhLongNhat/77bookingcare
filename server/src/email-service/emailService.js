import nodemailer from "nodemailer";
require("dotenv").config();
// Cấu hình chi tiết cho Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    // Log thông tin để debug
    console.log("Email Configuration:", {
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
    });

    const mailOptions = {
      from: process.env.SMTP_USER, // Sử dụng SMTP_USER thay vì SMTP_FROM
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    // Log chi tiết lỗi
    console.error("Detailed email error:", {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    return await sendEmail(email, "Password Reset Request", html);
  } catch (error) {
    console.error("Password reset email error:", error);
    throw error; // Ném lỗi để xử lý ở tầng controller
  }
};

// Kiểm tra kết nối SMTP khi khởi động
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verification Error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

export default {
  sendEmail,
  sendPasswordResetEmail,
};
