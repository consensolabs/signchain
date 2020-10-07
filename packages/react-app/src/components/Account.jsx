import React from "react";
import { Button } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{  marginLeft: 8, marginTop: 4}}
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{  marginLeft: 8, marginTop: 4 }}
          size="large"
          type={minimized ? "default" : "primary"}
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  const display = minimized ? (
    ""
  ) : (
    <span>
      {address ? <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={19}/> : "Connecting..."}
      <Balance address={address} provider={localProvider} dollarMultiplier={price} size={19} />
      <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} size={19} />
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
