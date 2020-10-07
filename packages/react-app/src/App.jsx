/* eslint-disable */
import React, {useCallback, useEffect, useState} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import "antd/dist/antd.css";
import 'semantic-ui-css/semantic.min.css'
import "./App.css";
import {Row, Col} from "antd";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useBalance, } from "./hooks";
import { Transactor } from "./helpers";
import {Account, Faucet} from "./components";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";

const blockExplorer = "https://etherscan.io/"
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 })
// const localProviderUrl = "http://localhost:8545";
// const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
// const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App() {

    const [injectedProvider, setInjectedProvider] = useState();
    const price = useExchangePrice(mainnetProvider);
    const gasPrice = useGasPrice("fast");
    const userProvider = useUserProvider(injectedProvider);
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
    const yourLocalBalance = useBalance(userProvider, address);
    const yourMainnetBalance = useBalance(mainnetProvider, address);
    const readContracts = useContractLoader(userProvider)
    const writeContracts = useContractLoader(userProvider)
    console.log(writeContracts)

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
    }, [loadWeb3Modal]);

    const [route, setRoute] = useState();
    useEffect(() => {
        console.log("SETTING ROUTE",window.location.pathname)
        setRoute(window.location.pathname)
    }, [ window.location.pathname ]);

  return (
      <div className="App">
        <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10,}}>
          <Account
              address={address}
              localProvider={userProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
          />
        </div>

        <div style={{position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10}}>
          <Row align="middle" gutter={4}>
            <Col span={15}>
              <Faucet localProvider={userProvider} price={price}/>
            </Col>
          </Row>
        </div>

        <HashRouter>
          <div className="App">
            <Switch>
              <Route exact path="/" render={(props) =>
                  <SignUpForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                  />}/>

              <Route exact path="/login" render={(props) =>
                  <LoginForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                      {...props}
                  />}/>
              <Route exact path="/signup" render={(props) =>
                  <SignUpForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                  />}/>

              <Layout
              address={address}
              localProvider={userProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
              
              >
                <Route exact path="/dashboard" render={(props) =>
                    <Dashboard
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        readContracts={readContracts}
                        {...props}
                    />}/>
                <Route exact path="/documents" render={(props) =>
                    <Documents
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        {...props}
                    />}/>
                <Route exact path="/profile" render={(props) =>
                    <Profile
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        {...props}
                    />}/>
              </Layout>
            </Switch>
          </div>
        </HashRouter>
      </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
});

const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
        window.location.reload();
    }, 1);
};

export default App;
