/* eslint-disable */
import React, {useEffect, useState} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Link, useHistory } from "react-router-dom";
import logo from "../static/logo.png";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const index = require('../lib/e2ee.js')

function SignUpForm({writeContracts, tx}) {

    let history = useHistory();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

    }, [] )

    const registerUser = async () => {
        const walletStatus = await index.createWallet(password)
        if (walletStatus){
            const accounts = await index.getAllAccounts(password)
            const registrationStatus = await index.registerUser(name, email, accounts[0], tx, writeContracts)
            if (registrationStatus) {
                cookies.set('userAddress', registrationStatus);
                history.push({
                    pathname:'/login'
                })
            }
        }
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='violet' textAlign='center'>
                    <Image src={logo} /> Log-in to your account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Full name'
                                    onChange={(e, {value}) => setName(value)}/>
                        <Form.Input fluid icon='mail' iconPosition='left' placeholder='E-mail address'
                                    onChange={(e, {value}) => setEmail(value)}/>
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={(e, {value}) => setPassword(value)}
                        />

                        <Button color='violet' fluid size='large' onClick={registerUser}>
                            Register
                        </Button>

                    </Segment>
                </Form>
                <Message>
                    Login here: <Link to="/login"> Login</Link>
                </Message>
            </Grid.Column>
        </Grid>
    )
}
export default SignUpForm
