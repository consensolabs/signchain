 /* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './verify.css';
import { Steps, Button, message } from 'antd';
import { Grid, Image } from 'semantic-ui-react'
import SelectFiles from './SelectFiles'
import Preview from './Preview'

const index = require('../../lib/e2ee.js')

const { Step } = Steps;

const steps = [
  {
    title: 'Select Document',
  content: (args) => {return <SelectFiles setSubmitting={args.setSubmitting} setFileHash={args.setFileHash}/>} ,
  },
  {
    title: 'Verify Document',
    content: (args) => {return <Preview submitting={args.submitting} docInfo = {args.docInfo}/>},
  },
];

const verify=(props)=> {

  const [users, setUsers] = useState([])
  const [signer, setSigner] = useState()
  const [caller, setCaller] = useState({})
  const [docInfo, setDocInfo] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [fileHash, setFileHash] = useState("AWS")

  console.log(fileHash)




  useEffect(() => {
        
    if (props.writeContracts) {
      props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {
        console.log(event);
      });
        setSigner(props.userProvider.getSigner())
        index.getAllUsers(props.address, props.tx, props.writeContracts).then(result => {
            console.log("Registered users:", result)
            
            setUsers(result.userArray)
            setCaller(result.caller)
            
        })
    }
}, [props.writeContracts])

const getDocInfo = async () => {
  setSubmitting(true)
  const docInfo = await index.getFile(props.tx, props.writeContracts, props.address, fileHash)
  setDocInfo(docInfo)
  setSubmitting(false)
}

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
        <div className="steps-content">{steps[current].content({ submitting, setSubmitting, getDocInfo, setFileHash, docInfo})}</div>
        
        <div className="steps-action" style={{float:'right'}}>
       
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}  className="button">
              Previous
            </Button>
          )}

             {current < steps.length - 1 && (
            <Button type="primary" loading={submitting} onClick={() => {next(); getDocInfo()}} className="button">
              Verify
            </Button>
          )}
          
          {current === steps.length - 1 && (null
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

export default verify