import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, industry, inquiryType, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !inquiryType || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create email content
    const emailSubject = `New Contact Form Submission - ${inquiryType}`;
    const emailContent = `
      <h2>New Contact Form Submission</h2>

      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
        ${industry ? `<li><strong>Industry:</strong> ${industry}</li>` : ''}
        <li><strong>Inquiry Type:</strong> ${inquiryType}</li>
      </ul>

      <h3>Message:</h3>
      <p style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </p>

      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        This email was sent from the Yahska Polymers contact form at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.
      </p>
    `;

    // Send email using Nodemailer
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Yahska Polymers Contact Form'}" <${process.env.SMTP_USER}>`,
      to: "admin@yahskapolymers.com",
      subject: emailSubject,
      html: emailContent,
      replyTo: email, // Allow direct reply to the customer
    };

    const emailResult = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", emailResult.messageId);

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        messageId: emailResult.messageId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing contact form:", error);

    // Return a user-friendly error message
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again or contact us directly.",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}