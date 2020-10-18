/* eslint-disable */
import React, {useEffect, useState} from 'react'
import {Button, Icon, Loader, Table} from 'semantic-ui-react'
const index = require('../lib/e2ee.js')

export default function Documents(props) {

    const password = localStorage.getItem('password')
    const [signer, setSigner] = useState({})
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.writeContracts) {
            getAllDoc()
        }

    }, [props.writeContracts])

    const getAllDoc = async () =>{
        setLoading(true)
        const result = await index.getAllFile(props.tx, props.writeContracts, props.address)
        if(result.length>0) {
            setDocs(result)
        }
        setLoading(false)
    }

    const downloadFile = (docHash)=>{
        console.log('Downloading:',docHash)
        index.downloadFile(docHash,password, props.tx, props.writeContracts).then((result)=>{
        })
    }

    const signDocument = async (docHash)=>{
        console.log("Sign doc dow:",docHash)
        const result = await index.attachSignature(docHash, props.tx, props.writeContracts , props.userProvider.getSigner())
        console.log("resultsss:",result)
    }

    return (
        <div>
        <Table singleLine striped >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='6'>Your documents</Table.HeaderCell>
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
                {
                    !loading ?
                        docs.map((value) => {
                            return (
                                <Table.Row>
                                    <Table.Cell collapsing>
                                        <Icon name='file outline'/> Document
                                    </Table.Cell>
                                    <Table.Cell>10 hours ago</Table.Cell>

                                    <Table.Cell> Status: { value.signStatus.toString() }</Table.Cell>
                                    <Table.Cell>
                                        Party Signed: { value.partySigned.toString() }
                                    </Table.Cell>
                                    {/*
                                        Handel this button based on value.partySigned .
                                        If partySigned is false then only display button else hide it
                                    */}
                                    <Table.Cell>
                                        <Button onClick={()=>signDocument(value.hash)}>Sign Doc</Button>
                                    </Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>
                                        <Button icon='download' onClick={()=>downloadFile(value.hash)}/>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        ) :
                        <Loader active size='medium'>Loading
                        </Loader>
                }
            </Table.Body>
        </Table>
        </div>
    )
}
