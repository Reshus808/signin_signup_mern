import './App.css';
import HomePage from "./Components/homepage/HomePage";
import Login from "./Components/login/Login";
import Signup from "./Components/signup/Signup";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from "react";

function App() {

  const [user, setLoginUser] = useState({});
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path={'/'} element=
              {
            user && user._id ? <HomePage user={user} setLoginUser={setLoginUser}/> : <Login setLoginUser={setLoginUser}/>
          }/>
          <Route  path={'/login'} element={<Login setLoginUser={setLoginUser}/>}/>
          <Route  path={'/signup'} element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  )
}

export default App;
