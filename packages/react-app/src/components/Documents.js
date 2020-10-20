/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Header, Form } from "semantic-ui-react";
//import DocumentModal from "./DocumentModal";
const index = require("../lib/e2ee");

const userType = { party: 0, notary: 1 };

export default function Documents(props) {
  const password = localStorage.getItem("password");
  const [open, setOpen] = useState(false);
  const [caller, setCaller] = useState({});
  const [signer, setSigner] = useState({});
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal

  console.log(docs);

  useEffect(() => {
    if (props.writeContracts) {
      getAllDoc();
      setSigner(props.userProvider.getSigner());
      index.getAllUsers(props.address, props.tx, props.writeContracts).then(result => {
        console.log("Registered users:", result);
        setCaller(result.caller);
      });
    }
  }, [props.writeContracts]);

  const getAllDoc = async () => {
    setLoading(true);
    const result = await index.getAllFile(props.tx, props.writeContracts, props.address);
    if (result.length > 0) {
      setDocs(result);
    }
    setLoading(false);
  };

  const downloadFile = docHash => {
    console.log("Downloading:", docHash);
    index.downloadFile(docHash, password, props.tx, props.writeContracts).then(result => {});
  };

  const signDocument = async docHash => {
    console.log("Sign doc dow:", docHash);
    const result = await index.attachSignature(docHash, props.tx, props.writeContracts, props.userProvider.getSigner());
    console.log("resultsss:", result);
  };

  const notarizeDocument = async docHash => {
    const result = await index.notarizeDoc(docHash, props.tx, props.writeContracts, props.userProvider.getSigner());
  };

  return (
    <div className="main__container">
      <Table singleLine striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="6">Your documents</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!loading ? (
            docs.map(value => {
              return (
                <Table.Row>
                  <Table.Cell collapsing>
                    <Icon name="file outline" /> Document
                  </Table.Cell>
                  <Table.Cell>10 hours ago</Table.Cell>

                  <Table.Cell>
                    {" "}
                    {value.signStatus ? (
                      <div>
                        <Icon name="circle" color="green" />
                        Signed
                      </div>
                    ) : (
                      <div>
                        <Icon name="circle" color="red" /> Pending
                      </div>
                    )}
                  </Table.Cell>

                  {/*
                                        Handel this button based on value.partySigned .
                                        If partySigned is false then only display button else hide it
                                    */}
                  <Table.Cell>
                    {value.notary === caller.address && !value.notarySigned ? (
                      <Button basic color="blue" icon labelPosition="left" onClick={() => notarizeDocument(value.hash)}>
                        <Icon name="signup" />
                        Notarize
                      </Button>
                    ) : !value.partySigned ? (
                      <Button basic color="blue" icon labelPosition="left" onClick={() => signDocument(value.hash)}>
                        <Icon name="signup" />
                        Sign Document
                      </Button>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell collapsing textAlign="right">
                    <Button icon="download" onClick={() => downloadFile(value.hash)} />
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

      {/* demo -replace - with actual table data */}

      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>Document Status</Modal.Header>
        <Modal.Content>
          <Table padded="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Name</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3>Rental Agreement</h3>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Hash</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3>0x337b2aF19e840E8761Ef7a90Ce05Fedf4E91E2B2</h3>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Created By</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3>Koushith@consensolabs.com</h3>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Signature Status</h3>
                </Table.Cell>
                <Table.Cell>
                  <Button color="green">Sign Now</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Notarised?</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3>No</h3>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>

      <Table singleLine striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row onClick={() => setOpen(true)}>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>None</Table.Cell>
            <Table.Cell>
              <Button className="button__primary" onClick={() => setOpen(true)}>
                More Info
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
