/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table } from "semantic-ui-react";
const index = require("../lib/e2ee.js");

export default function Documents(props) {
  const password = localStorage.getItem("password");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.writeContracts) {
      getAllDoc();
    }
  }, [props.writeContracts]);

  const getAllDoc = async () => {
    setLoading(true);
    const result = await index.getAllFile(props.tx, props.writeContracts);
    console.log("RESULT", result);
    if (result.length > 0) {
      let docs = [];
      for (let i = 0; i < result.length; i++) {
        docs.push(parseInt(result[i]));
      }
      setDocs(docs);
    }
    setLoading(false);
  };

  const downloadFile = docIndex => {
    console.log("Downloading:", docIndex);
    index.downloadFile(docIndex, password, props.tx, props.writeContracts).then(result => {});
  };

  return (
    <div className="main__container">
      <Table singleLine striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="4">Your documents</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Date</Table.HeaderCell>
            <Table.HeaderCell>Notarised</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!loading ? (
            docs.map(index => {
              return (
                <Table.Row>
                  <Table.Cell collapsing>
                    <Icon name="file outline" /> Document {index}
                  </Table.Cell>
                  <Table.Cell>10 hours ago</Table.Cell>
                  <Table.Cell>False</Table.Cell>
                  <Table.Cell collapsing textAlign="right">
                    <Button icon="download" onClick={() => downloadFile(index)} />
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Loader active size="medium">
              Loading
            </Loader>
          )}
        </Table.Body>
      </Table>

      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Date</Table.HeaderCell>
            <Table.HeaderCell>E-mail address</Table.HeaderCell>
            <Table.HeaderCell>Premium Plan</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>John Lilki</Table.Cell>
            <Table.Cell>September 14, 2013</Table.Cell>
            <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
            <Table.Cell>No</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jamie Harington</Table.Cell>
            <Table.Cell>January 11, 2014</Table.Cell>
            <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
            <Table.Cell>Yes</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
