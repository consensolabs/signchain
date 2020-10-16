 /* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import upload from '../../images/upload.png'
import { Upload, message } from 'antd';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const SelectFiles=()=>{
 return(
   
 <Dragger {...props} style={{marginTop:'-40px', border:'none'}}>
    <p className="ant-upload-drag-icon">
   
     <img src={upload} alt="" srcset=""/>
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
   
  </Dragger>    

);
}

export default SelectFiles