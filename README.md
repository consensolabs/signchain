# Signchain :file_folder: :key:

![logo](./logo.png)
> Digital signing tool for legal contracts


We have been working on an Arbitration platform for some time. While dealing with the conventional system, we felt that there is an absolute need for digitizing the signing process of legal agreements/ documents. That's when we started ideating around the digital signing platform (Signchain).

We know that there has been plenty of effort in the area of electronic signing. But the existing solutions don't seem to operate on standards that are interoperable. In Signchain, we want to address the age-old issues of document signing such as tampering, delayed process, verification troubles, with the help of decentralized storage and open verification. We also want to address the interoperability concerns by using standardized identity, storage, and signing protocols.

We are building a digital signing platform with the help of DIDs, end-to-end encrypted document solution on decentralized storages, and verifiable documents NFTs.


We plan on using the following technologies/ protocols:

* NFT standards
* Fleek / Filecoin/ Textile storage solutions
* Ceramic DIDs


## quickstart

```bash 
git clone https://github.com/consensolabs/signchain

cd signchain
```

```bash

yarn install

```

> you might get node-gyp errors, ignore them and run:

```bash

yarn run start

```

> in a second terminal window:

```bash

yarn run chain

```

> in a third terminal window:

```bash

yarn run deploy

```

🔏 Smart contract is located at `packages/buidler/contracts`

📝 React frontend is at `packages/react-app`

📱 Open http://localhost:3000 to see the app
