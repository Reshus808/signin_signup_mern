import mongoose from "mongoose";
const DB = process.env.DATABASE

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err){
    console.log(err)
  }else {
    console.log('DB connected successful')

  }
})
