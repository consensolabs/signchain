/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
//import logo from "../../static/logo.png";
const index = require("../../lib/e2ee.js");
import test from "./img/test.png";
import logo from "../../images/logoInverted.png";
import "./Form.css";

function LoginForm(props) {
  let history = useHistory();
  const [password, setPassword] = useState("");

  useEffect(() => {}, []);

  async function loginUser() {
    let accounts = await index.getAllAccounts(password);
    localStorage.setItem("password", password);
    history.push("/dashboard");
  }

  return (
    <>
      <div className="form__container">
        <div className="form-container">
          <div className="form-content-left">
            <div className="logo_inverted ">
              <img src={logo} alt="" srcset="" />
            </div>
            <div className="form">
              <h2>Login to your Account</h2>

              <div className="form-inputs">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button className="form-input-btn" onClick={loginUser}>
                Login
              </button>
              <span className="form-input-login">
                Haven't registered ? Sign Up <Link to="/signup">here</Link>
              </span>
            </div>
          </div>
          <div className="form-content-right">
            <img src={test} className="form-img" alt="left" srcset="" />
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginForm;
