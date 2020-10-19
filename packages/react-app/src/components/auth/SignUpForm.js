/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import "./Form.css";
import logo from "../../images/logoInverted.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const index = require("../../lib/e2ee.js");
import Rocket from "./img/img-2.svg";

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
      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="violet" textAlign="center">
            <Image src={logo} /> Log-in to your account
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Full name"
                onChange={(e, { value }) => setName(value)}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={(e, { value }) => setEmail(value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={(e, { value }) => setPassword(value)}
              />
              <div style={{ marginBottom: "14px", float: "left" }}>
                <Checkbox
                  label="I'm a Notary"
                  checked={notary}
                  onChange={() => {
                    setNotary(!notary);
                  }}
                />
              </div>

              <Button color="violet" fluid size="large" onClick={registerUser}>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Login here: <Link to="/login"> Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
      {/* From here */}
      <div className="form-container">
        <div className="form-content-left">
          <div style={{ margin: "24px 40px 0px 65px" }}>
            <img src={logo} alt="" srcset="" />
          </div>
          <form action="" className="form" style={{ marginTop: "18px" }}>
            <h1>Get started with us today! Create your account by filling out the information below.</h1>
            <div className="form-inputs">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Enter your username"
                // value={values.username}
                // onChange={handleChange}
              />
            </div>
            <div className="form-inputs">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                // value={values.email}
                // onChange={handleChange}
              />
            </div>
            <div className="form-inputs">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                // value={values.password}
                // onChange={handleChange}
              />
              {/* {errors.password && <p>{errors.password}</p>} */}
            </div>
            <div className="form-inputs">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                name="password2"
                placeholder="Confirm your password"
                // value={values.password2}
                // onChange={handleChange}
              />
              {/* {errors.password2 && <p>{errors.password2}</p>} */}
            </div>
            <button className="form-input-btn" type="submit">
              Sign up
            </button>
            <span className="form-input-login">
              Already have an account? Login <Link to="/login">here</Link>
            </span>
          </form>
        </div>
        <div className="form-content-right">
          <img src={Rocket} className="form-img" alt="left" srcset="" />
        </div>
      </div>
    </>
  );
}
export default SignUpForm;
