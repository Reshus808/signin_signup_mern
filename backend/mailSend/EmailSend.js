import nodemailer from "nodemailer";
import UserOtpVerification from "../model/UserOtpVerification.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config()

// mail part
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });


// testing success
transport.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Ready for message")
    console.log(success)
  }
})

//otp send function
export const sendOTPVerification = async ({_id, email}, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail function
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "verify your email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete</p>
             <p>This code <b>Expires in 1 hour</b>.</p>`
    }
    const saltRounds = 12;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOtpVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30000,
    });
    await newOTPVerification.save();
    await transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('Error Occurs');
      } else {
        res.json({
          status: "PENDING",
          message: "verification otp email sent",
          data: {
            userId: _id,
            email,
          },
        })
      }
    });
  } catch (e) {
    res.json({
      status: "failed",
      message: e.message,
    })
  }
}

