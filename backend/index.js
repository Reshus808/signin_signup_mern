import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import User from './model/userSchema.js'
import bcrypt from "bcryptjs";
import UserOtpVerification from "./model/UserOtpVerification.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
dotenv.config()

// connection part
const DB = process.env.DATABASE
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, () => {
  console.log('DB connected')
});


// login route
app.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const userLogin = await User.findOne({email: email})
    if (userLogin) {
      if (userLogin.verified === true){
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          res.status(400).json({message: "Invalid credentialn pass"})
        } else {
          return res.json({message: " User Login Successfully", user: userLogin});
        }
      }else {
        return res.json({message: " user is not verified"});
      }
    } else {
      return res.status(400).json({message: "Invalid credential"})
    }
  } catch (err) {
    console.error(err);
  }
})

//signup route
app.post('/register', async (req, res) => {

  const {name, email, password, verified} = req.body;
  try {
    const userExist = await User.findOne({email: email})
    if (userExist) {
      return res.status(422).json({message: "User already exist"});
    } else {
      const user = await new User({name, email, password, verified});
      await user.save();
      await sendOTPVerification(user, res)
      // res.status(201).json({message: "User register successfuly"})
    }
  } catch (err) {
    console.log(err);
  }
});


// get all data
app.get('/register',async (req, res) => {
  try{
    await User.find((err, user) => {
       if (user) {
         return res.status(200).json({
          success: true,
          data: user
        })
      } else {
        res.send(err)
      }
    })
  }catch (e) {
    console.log(e)
  }
})


//mail part
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });


//testing success
transport.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Ready for message")
    console.log(success)
  }
})

//otp send function
const sendOTPVerification = async ({_id, email}, res) => {
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
      expiresAt: Date.now() + 3600000,
    });
    await newOTPVerification.save();
    await transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('Error Occurs');
      } else {
        res.json({
          status: "PENDING",
          message: "verification otp email sent",
          datae: {
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

//otp verify
app.post('/verifyOTp', async (req, res) => {
  try {
    let {userId, otp} = req.body;
    if (!userId || !otp) {
      throw Error("Empty Otp details are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOtpVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error("account doennot exit or has been verified already. please sign up or log in");
      } else {
        const {expiresAt} = UserOTPVerificationRecords[0];
        const hashedOtp = UserOTPVerificationRecords[0].otp
        if (expiresAt < Date.now()) {
          UserOtpVerification.deleteMany({userId});
          throw new Error("code has expired. please request again");
        } else {
          const validOtp = await bcrypt.compare(otp, hashedOtp)
          if (!validOtp) {
            throw new Error(" INvalid code passed. Check your inbox");
          } else {
            await User.updateOne({_id: userId}, {verified: true});
            await UserOtpVerification.deleteMany({userId})
            res.json({
              status: "verified",
              message: " user email verified successfully"
            })
          }
        }
      }
    }
  } catch (e) {
    res.json({
      status: "failed",
      message: e.message
    })
  }
})

//resend otp
app.post('/resendOtpVerificationCode', async (req, res) => {
  try{
    let{userId, email} = req.body;
    if(!userId || !email){
      throw Error(" Empty Otp details are not allowed");
    }else {
      await UserOtpVerification.deleteMany({userId});
     await sendOTPVerification({_id: userId, email}, res);
    }
  }catch (e){
    res.json({
      status: "failed",
      message: e.message
    })
  }
})

//server running
app.listen(8000, () => {
  console.log(`server is running on port 8000`);
})
