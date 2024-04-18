import React, { useState } from "react";
import "./LoginRegister.css";

const LoginRegister = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({username:"",email:"",password:""});

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
    }

  const login = async () => {
    let dataObj;
    await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});
      console.log(dataObj);
      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/products");
      }
      else
      {
        alert(dataObj.errors)
      }
  }

  const Register = async () => {
    let dataObj;
    await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});

      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
      else
      {
        alert(dataObj.errors)
      }
  };
  

  return (
    <div className="loginregister">
      <div className="loginregister-container">
        <h1>{state}</h1>
        <div className="loginregister-fields">
          {state==="Register"?<input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler}/>:<><input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler}/></>}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler}/>
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler}/>
        </div>

        <button onClick={() => state === "Login" ? login() : Register()}>Continue</button>

        {state==="Login"?
        <p className="loginregister-login">Create an account? <span onClick={()=>{setState("Register")}}>Click here</span></p>
        :<p className="loginregister-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>}

        <div className="loginregister-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
