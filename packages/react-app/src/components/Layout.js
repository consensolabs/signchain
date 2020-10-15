/* eslint-disable */
import React, {Component} from "react";
import { useHistory } from "react-router-dom";
import MainHeader from "./Navigation/HeaderSem";
import SidePannel from './Navigation/SidePannel'
import logo from './../images/logo.png'
import 'antd/dist/antd.css';
import './Layout.css';
import { Layout, } from 'antd';

const {  Content } = Layout;

export default function layout(props) {

    console.log(props)

    let history = useHistory()

    return (
<>
        {/* ['/login', '/signup'].includes(history.location.pathname) ?
            null : */}
 <Layout>

      <MainHeader {...props}/>
    <Layout>
     
    <SidePannel/>
      <Layout >
       
        <Content className=" main-content">
          { props.children }
        </Content>
      </Layout>
    </Layout>
  </Layout>
     </>      
    )
}
