 /* eslint-disable */ 
import React from 'react'
import { Table, Dropdown } from 'semantic-ui-react'
import './Preview.css'
const Preview = () => (
<div className="preview__container">
    <div className="wrapper">
        
            <div>
                <h3 clasdName='h2__medium' style={{textAlign:'left'}}>Selected Party</h3>
                 <div style={{marginBottom:'14px'}}>
                <Dropdown
                placeholder='Koshik Raj'
                fluid
                multiple
                readOnly
                selection />
            </div>
            </div>
             <h3 clasdName='h2__medium' style={{textAlign:'left'}}>Selected File</h3>
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