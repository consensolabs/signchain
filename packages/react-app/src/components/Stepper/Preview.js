 /* eslint-disable */ 
import React from 'react'
import { Table, Dropdown } from 'semantic-ui-react'
import './Preview.css'

const index = require('../../lib/e2ee.js')

const Preview = ({parties, fileInfo}) => {

    console.log(parties)
    console.log(fileInfo)
    
    
return (
<div className="preview__container">
    <div className="wrapper">
        
            <div>
                <h3 clasdName='h2__medium' style={{textAlign:'left'}}>Selected Party</h3>
                 <div style={{marginBottom:'14px'}}>
                 <Table singleLine>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Party Name</Table.HeaderCell>
                    <Table.HeaderCell>Party Address</Table.HeaderCell>
                
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {
                parties.map((party) => {
                    return <Table.Row>
                    <Table.Cell>{party.name}</Table.Cell>
                <Table.Cell>{party.address}</Table.Cell>
                </Table.Row>})
                }
                </Table.Body>
            </Table>
            </div>
            </div>
             <h3 clasdName='h2__medium' style={{textAlign:'left'}}>Selected Document</h3>
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
                    <Table.Cell>{fileInfo.fileName}</Table.Cell>
            <Table.Cell>{fileInfo.fileFormat}</Table.Cell>
                    <Table.Cell>3 MB</Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>
      </div>
 
</div>
 
)
}

export default Preview