import React, {useState} from 'react';
import styles from '../styles/homepage.module.scss'
import { useNavigate } from 'react-router-dom'

const HomePage = ({setLoginUser,user}) => {

  return (
      <div className={styles.main}>

        <div className={styles.container}>
        <h2>Home page</h2>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => setLoginUser({})}>Logout</button>

        </div>
      </div>
  );
};

export default HomePage;