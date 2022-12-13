import express from "express";
import {addUser, deleteUser, showOneUser,getAllUser, updateUser} from "../controller/studentController.js";
import {login, otpVerification, register, resendOtpVerification} from "../controller/userController.js";
const router = express.Router();


// router.get('/', (req, res) => {
//   res.send('hello')
// })

// student routes
// router.route('/user').get(getAllUser);
router.get('/showUser', getAllUser)
router.put('/updateUser/:id', updateUser)
router.get('/showOne/:id', showOneUser)
router.post('/addUser', addUser)
router.delete('/deleteUser/:id', deleteUser)

// signin signup routes
router.post('/login', login)
router.post('/register', register);
router.post('/otpVerify', otpVerification);
router.post('/resendOtp', resendOtpVerification);

export default router;