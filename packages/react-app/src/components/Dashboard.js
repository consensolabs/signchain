import React from "react";
import { Card, Grid } from "semantic-ui-react";
import "./Dashboard.css";
import Secure from "../images/secure.png";
import Sign from "../images/sign.png";
import Verify from "../images/verify.png";
import { Link } from "react-router-dom";

const Dashboard = () => (
  <>
    <div className="main__container card__container">
      <Grid divided="vertically" className="spacing">
        <Grid.Row columns={5}>
          <Grid.Column>
            <Link to="/sign">
              <div className="card">
                <div className="inner__container">
                  <div className="img">
                    <img src={Sign} alt="" srcset="" />
                  </div>
                  <p className="title">Sign & Send</p>
                </div>
              </div>
            </Link>
          </Grid.Column>
          <Grid.Column>
            <Link to="/sign">
              <div className="card">
                <div className="inner__container">
                  <div className="img">
                    <img src={Secure} alt="" srcset="" />
                  </div>
                  <p className="title">Secure & Share</p>
                </div>
              </div>
            </Link>
          </Grid.Column>
          <Grid.Column>
            <Link to="/verify">
              <div className="card">
                <div className="inner__container">
                  <div className="img">
                    <img src={Verify} alt="" srcset="" />
                  </div>
                  <p className="title">Verify Document</p>
                </div>
              </div>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </>
);

export default Dashboard;
