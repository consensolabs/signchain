/* eslint-disable */
import React, {useEffect, useState} from 'react'
import { Header, Image, Button } from 'semantic-ui-react'
const index = require('../lib/e2ee.js')

export default function Profile(props) {

    const [user, setUser] = useState({})

    useEffect(() => {
        index.getAllUsers(props.address, props.tx, props.writeContracts).then(result =>{
            if(result.caller) {
                console.log(result.caller)
                setUser(result.caller)
            }
        })
    }, [props.writeContracts] )

    return (
        <Header as='h2'>
            <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' /> {user.name}
        </Header>
    )
}
