import React, {useState} from 'react';
import styles from '../styles/login.module.scss'
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import {  toast } from 'react-toastify';

const Login = ({setLoginUser}) => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    console.log(e.target)
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const login = () => {
    const {email, password} = user
    if (email && password) {
      axios.post("http://localhost:8000/login", user)
          .then(res => {
            toast(res.data.message)
            setLoginUser(res.data.user)
            navigate('/')
            console.log(res.data.user)
          })
    }else {
      toast('please fill the data')
    }
  }


  return (
      <div className={styles.main}>
        <p>Login Page</p>
        <div className={styles.form}>
          <label>Email</label>
          <input type={'email'} name='email' value={user.email} onChange={handleChange} placeholder={'Enter Email'}/>

          <label>Password</label>
          <input type={'password'} name='password' value={user.password} onChange={handleChange}  placeholder={'Enter Password'}/>

          <button onClick={login}>Submit</button>
          <div className={styles.centerDiv}>or</div>
          <button onClick={() => navigate('/signup')}>Signup</button>

        </div>
      </div>
  );
};

export default Login;