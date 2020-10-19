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
      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="violet" textAlign="center">
            <Image src={logo} /> Log-in to your account
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={(e, { value }) => setPassword(value)}
              />

              <Button color="violet" fluid size="large" onClick={loginUser}>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            Haven't registered ? <Link to="/signup"> Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>

      {/* from here */}
      <div className="form-container">
        <div className="form-content-left">
          <div className="logo_inverted ">
            <img src={logo} alt="" srcset="" />
          </div>
          <form action="" className="form">
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

            <button className="form-input-btn" type="submit" onClick={loginUser}>
              Login
            </button>
            <span className="form-input-login">
              Haven't registered ? Sign Up <Link to="/signup">here</Link>
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
export default LoginForm;
