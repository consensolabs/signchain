/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./Form.css";
import { Button, Checkbox, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logoInverted.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const index = require("../../lib/e2ee.js");
import Rocket from "./img/img-2.svg";
import test from "./img/test.png";

function SignUpForm({ writeContracts, tx }) {
  let history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notary, setNotary] = useState(false);
  const userType = { party: 0, notary: 1 };

  useEffect(() => {}, []);

  const registerUser = async () => {
    const walletStatus = await index.createWallet(password);
    if (walletStatus) {
      const accounts = await index.getAllAccounts(password);
      const registrationStatus = await index.registerUser(
        name,
        email,
        accounts[0],
        notary ? userType.notary : userType.party,
        tx,
        writeContracts,
      );
      if (registrationStatus) {
        cookies.set("userAddress", registrationStatus);
        history.push({
          pathname: "/login",
        });
      }
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="form-content-left">
          <div className="logo_inverted">
            <img src={logo} alt="" srcset="" />
          </div>
          <form action="" className="form">
            <h2>Create an Account</h2>
            <div className="form-inputs">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-inputs">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
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

            <div className="form-inputs">
              <Checkbox
                style={{ color: "#718096" }}
                className="checkbox"
                label="I'm a Notary"
                checked={notary}
                onChange={() => {
                  setNotary(!notary);
                }}
              />
            </div>

            <button className="form-input-btn" type="submit">
              <Link to="/login" style={{ color: "#fff" }}>
                SIGN UP
              </Link>
            </button>
            <span className="form-input-login">
              Already have an account? Login <Link to="/login">here</Link>
            </span>
          </form>
        </div>
        <div className="form-content-right">
          <img src={test} className="form-img" alt="left" srcset="" />
        </div>
      </div>
    </>
  );
}
export default SignUpForm;
