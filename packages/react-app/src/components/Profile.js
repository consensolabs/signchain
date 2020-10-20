/* eslint-disable */
import React, { useEffect, useState } from "react";

import { Header, Image, Grid, Card, Icon, Table } from "semantic-ui-react";
import { Form, Input, Button, Checkbox } from "antd";
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
    <div className="main__container">
      <Grid columns="two">
        <Grid.Row>
          <Grid.Column width={4}>
            <Card
              image="https://react.semantic-ui.com/images/avatar/large/patrick.png"
              header={user.name}
              extra={extra}
              style={{ height: "387.2px" }}
            />
          </Grid.Column>

          <Grid.Column width={12}>
            <Card.Group>
              <Card fluid>
                <Card.Content>
                  <Table padded="very">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <h3>User Name</h3>
                        </Table.Cell>
                        <Table.Cell>
                          <h3>{user.name}</h3>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <h3>Email</h3>
                        </Table.Cell>
                        <Table.Cell>
                          <h3>name@domain.com</h3>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <h3>User Adress</h3>
                        </Table.Cell>
                        <Table.Cell>
                          <h3>0x337b2aF19e840E8761Ef7a90Ce05Fedf4E91E2B2</h3>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <h3>User Type</h3>
                        </Table.Cell>
                        <Table.Cell>
                          <h3>Notary</h3>
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
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
