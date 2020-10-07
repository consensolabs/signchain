/* eslint-disable */
import React, {useEffect, useState} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Link, useHistory } from "react-router-dom";
import logo from "../static/logo.png";
const index = require('../lib/e2ee.js')

function LoginForm(props) {

    let history = useHistory();
    const [password, setPassword] = useState('');

    useEffect(()=>{
    }, [])


    async function loginUser() {
        let accounts = await index.getAllAccounts(password)
        localStorage.setItem('password', password)
        history.push('/dashboard')
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='violet' textAlign='center'>
                    <Image src={logo} /> Log-in to your account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={(e, {value}) => setPassword(value)}
                        />

                        <Button color='violet' fluid size='large' onClick={loginUser}>
                            Login
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    Haven't registered ? <Link to="/signup" > Sign Up</Link>
                </Message>
            </Grid.Column>
        </Grid>
    )
}
export default LoginForm
