import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import user from './routes/index.js'
import('./db/connectDB.js')
mongoose.set('strictQuery', true);

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
dotenv.config()

//route
app.use("/api/v1", user)


//server running
app.listen(8000, () => {
  console.log(`server is running on port 8000`);
})
