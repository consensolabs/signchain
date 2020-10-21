 /* eslint-disable */ 
import React, {useState} from 'react';
import 'antd/dist/antd.css';
import upload from '../../images/upload.png'
import { Upload, message } from 'antd';
import { Icon } from 'semantic-ui-react'

const index = require('../../lib/e2ee.js')
const e2e = require('../../lib/e2e-encrypt.js')

const { Dragger } = Upload;

const fileStorage =["AWS","Fleek"]


const SelectFiles=({setSubmitting, setFileHash})=>{
  

const [selected, setSelected] = useState(false)


const uploadProps = {
  name: 'file',
  multiple: false,
  customRequest: (data) => {
    uploadFile(data.file)
  },
  onChange: function (status) {
    if (status) {
      message.success(` file uploaded successfully.`);
    } else  {
      message.error(`file upload failed.`);
    }
    
  },
};

const uploadFile = async (file)=>{
  let partiesInvolved = []
  setSelected(true)
  setSubmitting(true)

  const fileSplit = file.name.split(".")
  const fileFormat = fileSplit[fileSplit.length - 1]
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

    reader.onload = async (val) => {
        const fileInput = new Uint8Array(val.target.result)

        const fileHash = e2e.calculateHash(fileInput)
        setFileHash(fileHash)
        setSubmitting(false)
        
    }
}



 return(

  <div className="parties__container">
  <div className="wrapper">
  <div style={{marginBottom:'14px'}}>
</div>

        <div style={{marginBottom:'14px'}}>
    <Dragger {...uploadProps} style={{ border:'none'}}>
    <p className="ant-upload-drag-icon">
   
     {/* <img src={upload} alt="" srcset=""/> */}
     <Icon name="file alternate" size="huge" color="violet"/>
    </p>
    <p className="ant-upload-text">Click or drag a document to verify</p>
   
  </Dragger>  
     </div>
          
        
</div>

</div>



   
 

);
}

export default SelectFiles