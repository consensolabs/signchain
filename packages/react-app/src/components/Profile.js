/* eslint-disable */
import React, {useEffect, useState} from 'react'
import { Header, Image, Button } from 'semantic-ui-react'
const index = require('../lib/e2ee.js')

export default function Profile({ceramic, idx}) {

    const [user, setUser] = useState(null)
    useEffect(() => {
       async function getUserData() {
           try{
            console.log(idx)
            const profileSchema = localStorage.getItem("profileSchema");
            const data = await idx.get("ceramic://bagcqcera5h4ell4xe55tmuikuoj626zgf2sof4urgmnu2mok5flml34lclga", idx.id)
            setUser(data);
            console.log(data);
           }catch(err){
               console.log(err);
           }
           
       }
       if(idx){
        getUserData()
       }
    }, [idx] )

    return (
        <Header className="test"as='h2'>
            <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' />
        </Header>
    )
}
