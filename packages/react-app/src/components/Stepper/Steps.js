 /* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import Dashboard from '../Dashboard'
import 'antd/dist/antd.css';
import './stepper.css';
import { Steps, Button, message } from 'antd';
import { Grid, Image } from 'semantic-ui-react'
import SelectFiles from './SelectFiles'
import SelectParties from './SelectParties'
import Preview from './Preview'

const index = require('../../lib/e2ee.js')

const { Step } = Steps;

const steps = [
  {
    title: 'Select Document',
  content: (users, setParties, setFileInfo, parties, fileInfo) => {return <SelectFiles setFileInfo = {setFileInfo}/>} ,
  },
  {
    title: 'Select Parties',
    content: (users, setParties, setFileInfo, parties, fileInfo) => {return <SelectParties users = {users} setParties = {setParties}/>},
  },
  {
    title: 'Preview and Sign',
    content: (users, setParties, setFileInfo, parties, fileInfo) => {return <Preview parties = {parties} fileInfo = {fileInfo} />},
  },
];

const stepper=(props)=> {


  const password = localStorage.getItem('password')
  

  const [signer, setSigner] = useState({})
  const fileStorage =["AWS","Fleek"]
  const [users, setUsers] = useState([])
  const [caller, setCaller] = useState(null)
  const [parties, setParties] = useState([])
  const [file, selectFile] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [storageType, setStorage] = useState("AWS")
  const [fileInfo, setFileInfo] = useState({})

  let fileInputRef = React.createRef();

  console.log(parties)
  console.log(fileInfo)

  useEffect(() => {
        
    if (props.writeContracts) {
        setSigner(props.userProvider.getSigner())
        index.getAllUsers(props.address, props.tx, props.writeContracts).then(result => {
            console.log("Registered users:", result)
            if (result.userArray.length > 0) {
                setUsers(result.userArray)
                setCaller(result.caller)
            }
        })
    }
}, [props.writeContracts])

const [current, setCurrent] = useState(0)
  const next=()=> {
 
    setCurrent(current +1);
  }

 const prev=() =>{
   
    setCurrent(current-1);
  }

 
    // const { current } = this.state;
    return (
      <>
<div className="step__container">


    <Grid columns='two' >
    <Grid.Row>
      <Grid.Column width={12}>
        <div className="steps-content">{steps[current].content(users, setParties, setFileInfo, parties, fileInfo)}</div>
        
        <div className="steps-action" style={{float:'right'}}>
       
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}  className="button">
              Previous
            </Button>
          )}

             {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()} className="button">
              Next
            </Button>
          )}
          
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => {
              const allParties = parties;
              allParties.push(caller);
              console.log(allParties)
              index.registerDoc(allParties, fileInfo.fileHash, fileInfo.fileKey, '123', setSubmitting, props.tx, props.writeContracts, signer)}}  className="button">
              Sign & Share
            </Button>
          )}
        </div>
      </Grid.Column>

      <Grid.Column width={4}>
        <div className='stepper__container'>
            <Steps direction="vertical" current={current} >
          {steps.map(item => (
            <Step key={item.title} title={item.title}  style={{display:'flex',border:'1px solid  #cbd5e0', alignItems:'center', padding:'10px'}}/>
          ))}
        </Steps>
        </div>
       
      </Grid.Column>
     
    </Grid.Row>
  </Grid>
  </div>
  </>
    );
 
}

export default stepper