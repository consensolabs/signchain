/* eslint-disable */
import React, {Component} from "react";
import { useHistory } from "react-router-dom";
import MainHeader from "./Navigation/HeaderSem";

import 'antd/dist/antd.css';
import './Layout.css';
import { Layout, Menu } from 'antd';
import { UserOutlined, FileSearchOutlined, DashboardOutlined } from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

export default function layout(props) {

    console.log(props)

    let history = useHistory()

    return (
<>
        {/* ['/login', '/signup'].includes(history.location.pathname) ?
            null : */}
            <div>
                <MainHeader {...props}/>
                
            </div>



            <Layout>
    <Header className="header" style={{background:'#4c51bf'  }}>
    
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
     
      </Menu>
    </Header>
    <Layout>
      <Sider width={250} className="site-layout-background" >
      <Menu  mode="inline" defaultSelectedKeys={['1']} style={{padding:24}}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={ <FileSearchOutlined />}>
          All Documents
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
         Profile
        </Menu.Item>
       
      </Menu>
      </Sider>
    
      <Layout >
       
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 900,
            background:'#edf2f7'
          }}
        >
          { props.children }
        </Content>
      </Layout>
    </Layout>
  </Layout>
     </>      
    )
}
