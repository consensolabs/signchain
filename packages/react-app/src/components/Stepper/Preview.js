 /* eslint-disable */ 
import React from 'react'
import { Table } from 'semantic-ui-react'
import './Preview.css'
const Preview = () => (
<div className="preview__container">
    <div className="wrapper">
            <Table singleLine>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>File Name</Table.HeaderCell>
                    <Table.HeaderCell>File Type</Table.HeaderCell>
                    <Table.HeaderCell>Size</Table.HeaderCell>
                
                </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row>
                    <Table.Cell>Rental Agreement</Table.Cell>
                    <Table.Cell>PDF</Table.Cell>
                    <Table.Cell>3 MB</Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>
      </div>
 
</div>
 
)

export default Preview