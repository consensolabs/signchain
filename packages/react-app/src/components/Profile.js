/* eslint-disable */
import React, { useEffect, useState } from "react";

import { Loader, Grid, Card, Icon, Table } from "semantic-ui-react";
// import { Form, Input, Button, Checkbox } from "antd";
import "./Profile.css";
const index = require("../lib/e2ee.js");


export default function Profile({ceramic, idx}) {

    // const [user, setUser] = useState({});

  // useEffect(() => {
  //   if(props.writeContracts) {
  //   index.getAllUsers(props.address, props.tx, props.writeContracts).then(result => {
  //     if (result.caller) {
  //       console.log(result.caller);
  //       setUser(result.caller);
  //     }
  //   });
  // }
  // }, [props.writeContracts]);

    const [user, setUser] = useState(null)
    useEffect(() => {
       async function getUserData() {
           try{
            if(idx) {
                const profileSchema = localStorage.getItem("profileSchema");
                const data = await idx.get(profileSchema, idx.id)
                setUser(data)
                console.log(data);
            }
           }catch(err){
               console.log(err);
           }
           
       }
        getUserData()
    }, [idx] )


  const extra = (
    <a>
      <Icon name="user" />
      Notary
    </a>
  );

  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };
  // const tailLayout = {
  //   wrapperCol: { offset: 8, span: 16 },
  // };

        return (
            user ?
            <div className="main__container">
              <Grid columns="two">
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Card
                      image="https://react.semantic-ui.com/images/avatar/large/patrick.png"
                      header={user.name}
                      extra={user.notary ? extra : null}
                      style={{ height: "387.2px" }}
                    />
                  </Grid.Column>
        
                  <Grid.Column width={12} style={{marginTop: "18px"}}>
                    <Card.Group>
              
                          <Table padded="very">
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell>
                                  <h3>Email</h3>
                                </Table.Cell>
                                <Table.Cell>
                                    <h3>{user.email}</h3>
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>
                                  <h3>Ceramic DID</h3>
                                </Table.Cell>
                                <Table.Cell>
                                    <h5>{idx.id}</h5>
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>
                                  <h3>User type</h3>
                                </Table.Cell>
                                <Table.Cell>
                                  {
                                    user.notary ? <h3>Notary</h3> : <h3>Party</h3>
                                  }
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>
                                  <h3>Member Since</h3>
                                </Table.Cell>
                                <Table.Cell>
                                  <h3>October 2020</h3>
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          </Table>
                   
                    </Card.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div> :
            <Loader active size="medium">
            Fetching profile
          </Loader>
          );
      
}
