import React, {useState} from 'react';
import styles from "../styles/signup.module.scss";
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import {  toast } from 'react-toastify';

const Signup = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    verified: false
  })

  const handleChange = (e) => {
    // e.preventDefault();
    // console.log(e.target)
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const register = () => {
    const { name, email, password, cpassword } = user

    if(name && email && password && (password === cpassword)){
      axios.post("http://localhost:8000/register", user)
      .then(res => {
        toast(res.data.message)
        navigate('/login')
      })
    }else {
      toast('invalid')
    }

  }

  return (
      <div className={styles.main}>
        <p>Signup Page</p>
        <div className={styles.form}>
          <label>Name</label>
          <input type={'text'} name='name' value={user.name} onChange={handleChange} placeholder={'Enter name'}/>

          <label>Email</label>
          <input type={'email'} name='email' value={user.email} onChange={handleChange} placeholder={'Enter email'}/>


          <label>Password</label>
          <input type={'password'} name='password' value={user.password} onChange={handleChange} placeholder={'Enter password'}/>

          <label>Confirm Password</label>
          <input type={'password'} name='cpassword' value={user.cpassword} onChange={handleChange} placeholder={'Enter confirm password'}/>

          <button onClick={register}>Register</button>
          <div className={styles.centerDiv}>or</div>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
  );
};

export default Signup;