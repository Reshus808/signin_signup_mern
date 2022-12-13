import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import {sendOTPVerification} from "../mailSend/EmailSend.js";
import UserOtpVerification from "../model/UserOtpVerification.js";

//register
export const register = async (req, res) => {
    const {name, email, password, verified} = req.body;
    try {
      const userExist = await User.findOne({email: email})
      if (userExist) {
        return res.json({message: "User already exist"});
      } else {
        const user = await new User({name, email, password, verified});
        await user.save();
        await sendOTPVerification({_id:user._id, email}, res)
        // res.status(201).json({message: "User register successfuly"})
      }
    } catch (err) {
      console.log(err);
    }
  }


// get all data
//   app.get('/showData',async (req, res) => {
//     try{
//       await User.find((err, user) => {
//         if (user) {
//           return res.status(200).json({
//             success: true,
//             data: user
//           })
//         } else {
//           res.send(err)
//         }
//       })
//     }catch (e) {
//       console.log(e)
//     }
//   }


//login
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const userLogin = await User.findOne({email: email})
    if (userLogin) {
      if (userLogin.verified === true) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          res.json({message: "Invalid credentialn pass"})
        } else {
          return res.json({message: " User Login Successfully", user: userLogin});
        }
      } else {
        return res.json({message: " user is not verified"});
      }
    } else {
      return res.json({message: "Invalid credential"})
    }
  } catch (err) {
    console.error(err);
  }
}


//otp verify
export const otpVerification = async (req, res) => {
  try {
    let {userId, otp} = req.body;
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
            throw new Error(" Invalid code passed. Check your inbox");
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
    } catch (e) {
    res.json({
      status: "failed",
      message: e.message
    })
  }
}

//resend otp
export const resendOtpVerification = async (req, res) => {
  try{
    let{userId, email} = req.body;
    if(!userId || !email){
      throw Error(" Empty Otp details are not allowed");
    }else {
      await UserOtpVerification.deleteMany({userId});
      // await User.updateOne({_id: userId}, {verified: false});
      await sendOTPVerification({_id: userId, email}, res);
    }
  }catch (e){
    res.json({
      status: "failed",
      message: e.message
    })
  }
}



