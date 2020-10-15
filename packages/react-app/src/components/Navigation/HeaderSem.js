/* eslint-disable */
import React, { useState } from 'react'
//import { Menu, Segment } from 'semantic-ui-react'
import { Link, useHistory } from "react-router-dom";
import logo from '../../images/logo.png'
import {Account} from "..";
import './Header.css'
import 'antd/dist/antd.css';

import { Layout, Menu } from 'antd';


const { Header } = Layout;

export default function MainHeader({address,
    localProvider,
    userProvider,
    mainnetProvider,
    price,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    blockExplorer}) {

    let history = useHistory()

    const [activeItem, setActiveItem] = useState(history.location.pathname)

    const handleClick = (selected) => {setActiveItem(selected); history.push(`/${selected}`)}

    return(
        // <Segment inverted color='violet'>
        //     <Menu inverted pointing secondary>
        //         <Menu.Item
        //             name='dashboard'
        //             active={history.location.pathname === '/dashboard'}
        //             onClick={(e, item) => handleClick(item.name)}
        //         />
        //         <Menu.Item
        //             name='documents'
        //             active={history.location.pathname === '/documents'}
        //             onClick={(e, item) => handleClick(item.name)}
        //         />
        //         <Menu.Item
        //             name='profile'
        //             active={history.location.pathname === '/profile'}
        //             onClick={(e, item) => handleClick(item.name)}
        //         />

        //     <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10,}}>
        //     <Account
        //       address={address}
        //       localProvider={localProvider}
        //       userProvider={userProvider}
        //       mainnetProvider={mainnetProvider}
        //       price={price}
        //       web3Modal={web3Modal}
        //       loadWeb3Modal={loadWeb3Modal}
        //       logoutOfWeb3Modal={logoutOfWeb3Modal}
        //       blockExplorer={blockExplorer}
        //   />
        //     </div>
        //     </Menu>

            
        // </Segment>


<Header className="header" style={{background:'#4c51bf'  }}>
     
<div className="logo">
  <img src={logo}  alt="" srcset=""/>
</div>

 <Menu style={{float:'right',background:'#4c51bf', color:'#fff' }} mode="horizontal" defaultSelectedKeys={['2']}>
   <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10,color:'#fff'}}>
      
        <Account
              address={address}
              localProvider={localProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
          />
           </div>
      </Menu>
    </Header> 


    )
}
