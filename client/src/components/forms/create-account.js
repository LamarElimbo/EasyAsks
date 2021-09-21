import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory } from "react-router";
import { useUserUpdate } from '../../context'


export default function CreateUser() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')
    const [errors, setErrors] = useState({})

    const setUser = useUserUpdate();
    
    function onChangeName(e) { setName(e.target.value) }
    function onChangeEmail(e) { setEmail(e.target.value) }
    function onChangePassword(e) { setPassword(e.target.value) }
    function onChangeConfirmPassword(e) { setConfirmPassword(e.target.value) }

    const history = useHistory();
    
    useEffect(() => {
      if (localStorage.jwtToken) { history.push("/")};
      if (password === confirmPassword) {
        setPasswordMatch('Passwords match')
      } else {
        setPasswordMatch("Passwords don't match")
      }
    })

    const onSubmit = (e) => {
        e.preventDefault();
    
        const newUser = { 
            name: name, 
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };

        axios
          .post("/user/register", newUser)
          .then(res => {
            const loginData = { "email": res.data.email, "password": password }
            axios
              .post("/user/login", loginData)
              .then(res => {
                  // Set token to localStorage
                  const { token } = res.data;
                  localStorage.setItem("jwtToken", token);
                  // Set current user with decoded token
                  setUser("getUser", token);
              })
            history.push("/")
          })
          .catch(err => setErrors(err.response.data) );  
    }

    return (
      <>
        <h2>Create New User</h2>
 
        <form className="form" onSubmit={onSubmit}>
          <div className="input-field__area">
            <label className="label">What’s your first name?</label>
            <input className="input-field w-input" 
                    maxLength="256" 
                    placeholder="Enter your name" 
                    type="text" 
                    value={name}
                    error={errors.name}
                    onChange={onChangeName} />
            <p className="form-error">{errors.name}</p>
          </div>

          <div className="input-field__area">
            <label className="label">What’s your email?</label>
            <input className="input-field w-input" 
                    maxLength="256" 
                    placeholder="Enter your email" 
                    type="text" 
                    value={email}
                    error={errors.email}
                    onChange={onChangeEmail} />
            <p className="form-error">{errors.email}</p>
          </div>

          <div className="input-field__area">
            <label className="label">Create your password</label>
            <input className="input-field w-input"
                    maxLength="256" 
                    placeholder="Enter a password" 
                    type="password" 
                    value={password}
                    error={errors.password}
                    onChange={onChangePassword} />
            <p className="form-error">{errors.password}</p>
          </div>

          <div className="input-field__area">
            <label className="label">Confirm your password</label>
            <input className="input-field w-input" 
                    maxLength="256" 
                    placeholder="Rewrite your password" 
                    type="password" 
                    value={confirmPassword}
                    error={errors.confirmPassword}
                    onChange={onChangeConfirmPassword} />
            <p className="form-error">{errors.confirmPassword}</p>
            <p className="form-error">{(confirmPassword.length > 0) ? passwordMatch : ""}</p>
          </div>

          <input type="submit" data-wait="Please wait..." className="button" value="Create New User" />
        </form>
      </>
    )
}