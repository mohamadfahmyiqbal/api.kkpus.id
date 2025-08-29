// controllers/emailController.js
import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { ret, to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pusdev001@gmail.com",
      pass: "dojakjdfofkwdzwo",
    },
  });

  const mailOptions = {
    from: "pusdev001@gmail.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // res.status(200).json({ message: "Email berhasil dikirim!" });
    return "terkirim";
  } catch (error) {
    return "takterkirim";
    // res.status(500).json({ message: "Gagal mengirim email", error });
  }
};
