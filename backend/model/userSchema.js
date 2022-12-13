import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean
})

const saltRounds = process.env.KEY;

userSchema.pre('save', async  function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User =  mongoose.model("User", userSchema);

export default User;