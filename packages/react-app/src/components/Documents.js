/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Step } from "semantic-ui-react";
import { InfoCircleOutlined, FieldTimeOutlined, EditOutlined } from "@ant-design/icons";
import { Badge } from "antd";

const index = require("../lib/e2ee");
import { Collapse } from "antd";
const userType = { party: 0, notary: 1 };

const { Panel } = Collapse;

export default function Documents(props) {
  const password = localStorage.getItem("password");

  const [open, setOpen] = useState(false);
  const [caller, setCaller] = useState({});
  const [signer, setSigner] = useState({});
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Docs", docs);

  let modalData = docs.map(value => {
    let title = value.title;
    let TimeStamp = value.timestamp;
    let isSigned = value.signStatus;
    console.log("Title", title);
    console.log("timestamp", TimeStamp);
    console.log("isSigned", isSigned);

    return [title, TimeStamp, isSigned];
  });

  console.log("MODALLLL DATA", modalData);

  useEffect(() => {
    if (props.writeContracts) {
      props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
      props.writeContracts.Signchain.on("DocumentNatarized", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
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
            <Table.HeaderCell colSpan="5">Your documents</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Sign</Table.HeaderCell>
            <Table.HeaderCell>Actions </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!loading ? (
            docs.map(value => {
              return (
                <Table.Row>
                  <a>
                    <Table.Cell collapsing onClick={() => setOpen(true)}>
                      <Icon name="file outline" /> {value.title}
                    </Table.Cell>
                  </a>
                  <Table.Cell>{new Date(value.timestamp).toDateString()}</Table.Cell>

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
                    ) : (
                      <Button disabled basic color="blue" icon labelPosition="left">
                        <Icon name="signup" />
                        Sign Document
                      </Button>
                    )}
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
                  <h3>Signature TimeStamp</h3>
                </Table.Cell>
                <Table.Cell>
                  <Step.Group vertical fluid>
                    <Step>
                      <InfoCircleOutlined />
                      <Step.Content>
                        <p style={{ marginLeft: "14px" }}>Created On : xxxx</p>
                      </Step.Content>
                    </Step>

                    <Step>
                      <FieldTimeOutlined />
                      <Step.Content>
                        <p style={{ marginLeft: "14px" }}>Signed On : xxxx</p>
                      </Step.Content>
                    </Step>

                    <Step>
                      <EditOutlined />
                      <Step.Content>
                        <p style={{ marginLeft: "14px" }}> Notary Signed On : xxxx</p>
                      </Step.Content>
                    </Step>
                  </Step.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Notarised</h3>
                </Table.Cell>
                <Table.Cell>
                  <Badge count="No" />
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
    </div>
  );
}
