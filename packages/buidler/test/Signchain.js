const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Signchain", function () {
  let contractInstance, account1, account2;


  describe("SignchainFlow", function () {

    
    it("Should deploy YourContract", async function () {

      [account1, account2] = await ethers.getSigners();
  
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
        "doc location",
        ["AesEncKeyPartyA","AesEncKeyPartyB"],
        [account1._address,account2._address],
        [account1._address,account2._address],
        replayNonce,
        signature)
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


  });
});
