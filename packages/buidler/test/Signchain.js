const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const userType = {party: 0, notary: 1}

describe("Signchain", function () {
  let contractInstance, account1, account2;


  describe("SignchainFlow", function () {

    
    it("Should deploy Signchain", async function () {

      [account1, account2, notary] = await ethers.getSigners();
  
      const DocumentRegistry = await ethers.getContractFactory("Signchain");

      contractInstance = await DocumentRegistry.deploy();
    });

    it('Should sign and share a document', async () => {

      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash"))
      const replayNonce = await contractInstance.connect(account1).replayNonce(account1._address)

      const params = [
        ["bytes32", "uint"],
        [
            docHash,
            replayNonce
        ]
    ];
  
    let paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
    let signature  = await account1.signMessage(ethers.utils.arrayify(paramsHash))

      const document = await contractInstance.connect(account1).signAndShareDocument(
        docHash,
        "test Doc",
        "doc location",
        ["AesEncKeyPartyA","AesEncKeyPartyB"],
        [account1._address,account2._address],
        [account1._address,account2._address],
        replayNonce,
        signature,
        '0x0000000000000000000000000000000000000000')
    expect(document)

    let isSigned = await contractInstance.connect(account1).isDocumentSigned(docHash) 
    expect(isSigned).is.false

    signature  = await account2.signMessage(ethers.utils.arrayify(paramsHash))
  expect(await contractInstance.connect(account2).signDocument(docHash, replayNonce, signature))

  const signatures = await contractInstance.connect(account1).getSignatures(docHash) 
  expect(signatures.length).is.equal(2)
  isSigned = await contractInstance.connect(account1).isDocumentSigned(docHash) 
  expect(isSigned).is.true
  })

  it('Should notarize a document', async () => {

    const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash 2"))
    let replayNonce = await contractInstance.connect(account1).replayNonce(account1._address)

    let params = [
      ["bytes32", "uint"],
      [
          docHash,
          replayNonce
      ]
  ];

  let paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
  let signature  = await account1.signMessage(ethers.utils.arrayify(paramsHash))

  // Create a notary user
  await contractInstance.connect(notary).registerUser("Notary","n@gmail.com", "publicKeyNotary", userType.notary)

    const document = await contractInstance.connect(account1).signAndShareDocument(
      docHash,
      "test Doc",
      "doc location",
      ["AesEncKeyPartyA","AesEncKeyPartyB"],
      [account1._address,account2._address],
      [account1._address, notary._address],
      replayNonce,
      signature,
      notary._address,
      {value: ethers.utils.parseUnits("0.1", "ether")})
  expect(document)
  let notaryInfo = await contractInstance.connect(account1).notarizedDocs(docHash) 
  expect(ethers.utils.formatUnits(notaryInfo.notaryFee, "ether")).is.equal('0.1')
  expect(notaryInfo.notaryAddress).is.equal(notary._address)

  

   replayNonce = await contractInstance.connect(notary).replayNonce(notary._address)

     params = [
      ["bytes32", "uint"],
      [
          docHash,
          replayNonce
      ]
  ];

  paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
  signature  = await notary.signMessage(ethers.utils.arrayify(paramsHash))
  expect(await contractInstance.connect(notary).notarizeDocument(docHash, replayNonce, signature))
  

  const isSigned = await contractInstance.connect(account1).isDocumentSigned(docHash) 
  expect(isSigned).is.true
    });


  });
});
