import Student from '../model/studentDetails.js'

//sho all Student
export const getAllUser = async (req, res) => {
  try{
    const Show = await Student.find();
    return res.json({
      success: true,
      message: "Show ALl Data",
      data: Show
    })
  }catch (e) {
    console.log(e)
  }
}

//add Student
export const addUser = async (req, res) => {
  const {name, address, phone, branch} = req.body;

  if (phone.length !== 10) {
    return res.json({
      success: false,
      message: "phone number should be 10 digit"
    });
  }
  if (!name || !address || !phone || !branch) {
    return res.json({
      success: false,
      message: "plz fill the data"
    })
  }
  try {
    const phoneExit = await Student.findOne({phone})
    if (phoneExit) {
      return res.json({
        success: false,
        message: "invalid phone number"
      })
    } else {
      const addUser = new Student({
        name, address, phone, branch
      })
      await addUser.save();
      return res.json({
        success: true,
        message: 'Student Add successuful',
        data: addUser
      })
    }
  } catch (e) {

  }
}

//show one Student
export const showOneUser = async (req, res) => {
  try{
    const {id} = req.params;
    const oneStudent = await Student.findOne({_id: id})
    return res.json({
      success: true,
      message: 'Student show',
      data: oneStudent
    })
  }catch (e){
  }
}

//update Student
export const updateUser =  async (req, res) => {
  try{
    const {id} = req.params;
    const updateStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true
    })
    return res.json({
      success: true,
      message: 'Student updated successuful',
      data: updateStudent
    })
  }catch (e) {
  }
}

//delete Student
export const deleteUser = async (req, res) => {
  try{
    const {id} = req.params;
    const deleteStudent = await Student.findByIdAndDelete({_id: id});
    return res.json({
      success: true,
      message: 'Student deleted successuful'
    })
  }catch (e) {

  }
}


//in require type
// exports.getAllUser = (req, res) => {
//   res.status(200).json({message: "hello controller"})
// }

// import type
// const getAllUser = (req, res) => {
//   res.send('hhrrrtttgg')
// }
//
// export default getAllUser;