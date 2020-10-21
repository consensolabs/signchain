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
import {profileSchema, documentSchema} from "./ceramic/schemas"
import SignUpForm from "./components/auth/SignUpForm";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import Steps from './components/Stepper/Steps'
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default;
const { IDX } = require('@ceramicstudio/idx');
const { publishSchemas, schemasList } = require('@ceramicstudio/idx-schemas')
const Wallet = require('identity-wallet').default
const ceramic = new Ceramic('http://15.207.222.193:7007');

const blockExplorer = "https://etherscan.io/"
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 })
// const localProviderUrl = "http://localhost:8545";
// const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
// const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App() {

    const [injectedProvider, setInjectedProvider] = useState();
    const [idx, setIdx] = useState(null);
    const [did, setDid] = useState(null);
    const [schemas, setSchemas] = useState(null)
    const price = useExchangePrice(mainnetProvider);
    const gasPrice = useGasPrice("fast");
    const userProvider = useUserProvider(injectedProvider);
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
    const yourLocalBalance = useBalance(userProvider, address);
    const yourMainnetBalance = useBalance(mainnetProvider, address);
    const readContracts = useContractLoader(userProvider)
    const writeContracts = useContractLoader(userProvider)
    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    const init = async(address) => {
        const did = await Wallet.create({
            ceramic,
            seed: address,
            getPermission(){
                return Promise.resolve([])
            }
        })
        console.log("DID",did)
        await ceramic.setDIDProvider(did.getDidProvider());
        setDid(did);

        const schema = await publishSchemas({ceramic, schemas:schemasList});
        setSchemas(schema);

        console.log("Schemas",JSON.stringify(schemas, null, 2))

        const idx = new IDX({ ceramic, schemas });
        setIdx(idx)
        console.log(idx.id)
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
        if(address){
            init(address).then(data => console.log(idx))
        }
    }, [loadWeb3Modal, address]);

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
                      ceramic={ceramic}
                      idx={idx}
                      schemas={schemas}
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
                      ceramic={ceramic}
                      idx={idx}
                      schemas={schemas}
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
                    {/* <Steps/> */}
                <Route exact path="/dashboard" render={(props) =>
                    <Steps
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        readContracts={readContracts}
                        userProvider={userProvider}
                        {...props}
                    />}/>
                   
         <Route exact path="/documents" render={(props) =>
                    <Documents
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        userProvider={userProvider}
                        {...props}
                    />}/>
                <Route exact path="/profile" render={(props) =>
                    <Profile
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        {...props}
                        ceramic={ceramic}
                        idx={idx}
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
