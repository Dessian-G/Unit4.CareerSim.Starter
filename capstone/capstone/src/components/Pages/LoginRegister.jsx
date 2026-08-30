import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const LoginRegister = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({username:"",email:"",password:""});
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
    }

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }
      localStorage.setItem('auth-token', data.token);
      navigate("/products");
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  const Register = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }
      setState("Login");
    } catch (error) {
      console.error('Error registering:', error);
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
