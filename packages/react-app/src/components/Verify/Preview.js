/* eslint-disable */

import React from "react";
import { Button } from 'antd';
import { Header, Icon, Loader, Segment, Table } from 'semantic-ui-react'
import "./Preview.css";

const index = require("../../lib/e2ee.js");

const Preview = ({ submitting, docInfo }) => {
  console.log(docInfo)

  return (
    !submitting ?
    (docInfo ?
    <div className="preview__container">

<Table padded="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Name</h3>
                </Table.Cell>
                <Table.Cell>
                {docInfo.title}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Hash</h3>
                </Table.Cell>
                <Table.Cell>
                {docInfo.hash}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Created By</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3> {docInfo.owner} </h3>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Status</h3>
                </Table.Cell>
                <Table.Cell>  
                { docInfo.signStatus ? <div><Icon name='circle' color='green' />Signed</div> : <div><Icon name='circle' color='red'/> Pending</div>}
                </Table.Cell>
              </Table.Row>
              { docInfo.notarySigned ?<Table.Row positive>
              <Table.Cell>
                <Icon name='checkmark' />
                Notarized
              </Table.Cell>
            </Table.Row> : null}
            </Table.Body>
          </Table>

    </div> :
      <div>
      <Header icon>
        <Icon name='search' />
        We don't have any documents matching your query.
      </Header>
      <Segment.Inline>
      <Button type="primary"  style={{ margin: '0 8px' }} className="button">Search again</Button>
      </Segment.Inline>
    </div>):
    <Loader active size="medium">
    Loading
  </Loader>
  );
};

export default Preview;
