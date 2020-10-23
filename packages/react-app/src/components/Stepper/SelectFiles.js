/* eslint-disable */

import React, { useState } from "react";
import "antd/dist/antd.css";
import upload from "../../images/upload.png";
import { Upload, message } from "antd";
import { Dropdown, Input } from "semantic-ui-react";

import fleek from "../../images/fleek.png";
import AWS from "../../images/aws.png";
import filecoin from "../../images/filecoin.png";


const index = require("../../lib/e2ee.js");

const { Dragger } = Upload;

const fileStorage = [{name: "AWS", image: AWS},
 {name: "Fleek", image: fleek},
 {name: "Slate", image: filecoin}];

const SelectFiles = ({ setFileInfo, setSubmitting, setTitle, submitting }) => {
  const [selected, setSelected] = useState(false);
  const [storageType, setStorage] = useState("AWS");


  const props = {
    name: "file",
    multiple: true,
    customRequest: data => {
      uploadFile(data.file);
    },
    onChange(status) {
      if (status) {
        message.success(` file uploaded successfully.`);
      } else {
        message.error(`file upload failed.`);
      }
    },
  };

  const uploadFile = async file => {
    let partiesInvolved = [];
    setSelected(true);
    setSubmitting(true);
    const receipt = await index.uploadDoc(file, "123", setSubmitting, storageType, setFileInfo);
    if (receipt) {
      return true;
    }
  };

  return (
    <div className="parties__container">
      <div className="wrapper">
        <div style={{ marginBottom: "14px" }}>
          <Dropdown
            placeholder="Select Storage Provider"
            fluid
            selection
            options={fileStorage.map(storage => {
              return {
                key: storage.name,
                text: storage.name,
                value: storage.name,
                image: { avatar: true, src: storage.image },
              };
            })}
            onChange={(event, data) => {
              setStorage(data.value);
            }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <Dragger {...props} style={{ border: "none" }}>
            <p className="ant-upload-drag-icon">
              <img src={upload} alt="" srcset="" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
          {selected && !submitting ? (
            <Input
              fluid
              style={{ marginTop: "16px" }}
              placeholder="Enter document title"
              onChange={(event, data) => {
                setTitle(data.value);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SelectFiles;

