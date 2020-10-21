/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./Form.css";
import { Checkbox } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logoInverted.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const index = require('../../lib/e2ee.js')
import {profileSchema} from "../../ceramic/schemas"
import { createDefinition } from '@ceramicstudio/idx-tools'

import test from "./img/test.png";

function SignUpForm({ writeContracts, tx, ceramic, idx }) {

  let history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notary, setNotary] = useState(false);
  const userType = { party: 0, notary: 1 };


    const registerUser = async () => {
        const walletStatus = await index.createWallet(password)
        if (walletStatus){
            console.log(idx)
            const accounts = await index.getAllAccounts(password)
            const profileId = await createDefinition(ceramic, {
                name:"Signchain Profile",
                schema: profileSchema
            })

            await idx.set(profileId, {
                name:name,
                email:email,
                notary:notary
            })
            console.log(profileId)
            localStorage.setItem("profileSchema", profileId);
            const registrationStatus = await index.registerUser(name, email, accounts[0], notary ? userType.notary : userType.party, tx, writeContracts)
            if (registrationStatus) {
                cookies.set('userAddress', registrationStatus);
                history.push({
                    pathname:'/login'
                })
            }
        }
    }

  return (
    <>
      <div className="form-container">
        <div className="form-content-left">
          <div className="logo_inverted">
            <img src={logo} alt="" srcset="" />
          </div>
          <div className="form">
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

            <button className="form-input-btn" onClick={registerUser}>
              Sign Up
            </button>
            <span className="form-input-login">
              Already have an account? Login <Link to="/login">here</Link>
            </span>
          </div>
        </div>
        <div className="form-content-right">
          <img src={test} className="form-img" alt="left" srcset="" />
        </div>
      </div>
    </>
  );
}
export default SignUpForm;
