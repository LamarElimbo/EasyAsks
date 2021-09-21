import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useUser, useUserUpdate } from "../../context";

export default function LoginUser() {

    const user = useUser();
    const setUser = useUserUpdate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const history = useHistory();

    useEffect(() => {
        if (localStorage.jwtToken) { 
          history.push("/")
        };
    }, [user, history])

    function onChangeEmail(e) { setEmail(e.target.value) }

    function onChangePassword(e) { setPassword(e.target.value) }

    const onSubmit = (e) => {
        e.preventDefault();

        axios
          .post("/user/login", { email: email, password: password })
          .then(res => {
              // Set token to localStorage
              const { token } = res.data;
              localStorage.setItem("jwtToken", token);
              // Set current user with decoded token
              setUser("getUser", token);
              history.push("/")
          })
          .catch( err => setErrors(err) );

    }
    
    return (
        <>
          <h2>Login User</h2>

          <form className="form" onSubmit={onSubmit}>
            <div className="input-field__area">
              <label className="label">What’s your email?</label>
              <input className="input-field w-input" 
                      maxLength="256" 
                      placeholder="Enter your email" 
                      type="text" 
                      value={email}
                      error={errors.email}
                      onChange={onChangeEmail} />
              <p className="form-error">
                  {errors.email}
                  {errors.emailnotfound}
              </p>
            </div>

            <div className="input-field__area">
              <label className="label">What’s your password?</label>
              <input className="input-field w-input" 
                      type="password"
                      maxLength="250" 
                      placeholder="Enter your password" 
                      value={password}
                      error={errors.password}
                      onChange={onChangePassword} />
              <p className="form-error">
                  {errors.password}
                  {errors.passwordincorrect}
              </p>
            </div>

            <input type="submit" data-wait="Please wait..." className="button" value="Login" />
          </form>
        </>
    );
}