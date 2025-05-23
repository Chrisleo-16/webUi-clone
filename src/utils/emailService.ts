import emailjs from "@emailjs/browser";

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  message: string;
}

export const sendEmail = async (data: EmailData) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        location: data.location,
        message: data.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, message: "Failed to send email" };
  }
};
