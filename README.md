> ### Signchain has bagged 2 sponsor prizes during the [EthOnline hackathon](https://hack.ethglobal.co/showcase/signchain-recY6409wwWnJyxJ9) :tada: :confetti_ball:.
> * :large_orange_diamond: [Ceramic](https://www.ceramic.network): Best overall use of [Identity Index (IDX)](http://idx.xyz) Library
> * :file_folder: [Protocol Labs](https://protocol.ai), 3rd place
>
>  **We have some exciting roadmap planned for Signchain :rocket:. So, keep an eye on https://www.signchain.xyz :eyes:**

> ### :construction_worker: The project development is moved to [Signchain organization](https://github.com/signchain).


# Signchain :memo: :key:


![logo](./logo.png)
> Digital signing platform for legal documents


We have been working on an Arbitration platform for some time. While dealing with the conventional system, we felt that there is an absolute need for digitizing the signing process of legal agreements/ documents. That's when we started ideating around the digital signing platform (Signchain).

We know that there has been plenty of effort in the area of electronic signing. But the existing solutions don't seem to operate on standards that are interoperable. In Signchain, we want to address the age-old issues of document signing such as tampering, delayed process, verification troubles, with the help of decentralized storage and open verification. We also want to address the interoperability concerns by using standardized identity, storage, and signing protocols.

We created a basic platform where users can share the document privately with other counterparties that need access and sign the document. Whenever any party signs on the document, the proofs (standard digitally signed data) are recorded. The proofs of the signatures can be verified by anyone on the platform while only certain parties will have access to the document. The identity of all the parties can also be verified as the credentials are maintained using decentralized identity standards

We have used the the following technologies/ protocols:

* Fleek / Filecoin slate/ Textile storage solutions
* Ceramic IDX for decentralized identities

[Check out the demo video:](https://youtu.be/XZy307J-0dI)


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
