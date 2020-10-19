/* eslint-disable */
import React, { useEffect, useState } from "react";

import { Header, Image, Grid, Card, Icon } from "semantic-ui-react";
import { Form, Input, Button, Checkbox } from "antd";
const index = require("../lib/e2ee.js");

export default function Profile(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    index.getAllUsers(props.address, props.tx, props.writeContracts).then(result => {
      if (result.caller) {
        console.log(result.caller);
        setUser(result.caller);
      }
    });
  }, [props.writeContracts]);

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
                  <Form layout="vertical">
                    <Form.Item label="Username">
                      <Input placeholder="John Doe" readOnly />
                    </Form.Item>
                    <Form.Item label="Email">
                      <Input placeholder="john.doe@domain.com" readOnly />
                    </Form.Item>
                    <Form.Item label="Address">
                      <Input placeholder="0x337bbbbbbbbbbbbb" readOnly />
                    </Form.Item>
                    <Form.Item label="User Type">
                      <Input placeholder="Notary" readOnly />
                    </Form.Item>
                  </Form>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
