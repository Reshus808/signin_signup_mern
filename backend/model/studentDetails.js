import mongoose from "mongoose";


const StudentSchema = new mongoose.Schema({
  name: {type: String, require: true},
  branch: {type: String, require: true},
  address: {type: String, require: true},
  phone: {type: Number, require: true}
})

const Student = mongoose.model('StudentSchema', StudentSchema);

export default Student;