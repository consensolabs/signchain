const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Signchain", function () {
  let contractInstance, account1, account2;


  describe("SigningModule", function () {

    
    it("Should deploy SigningModule", async function () {

      [account1, account2] = await ethers.getSigners();
  
      const DocumentRegistry = await ethers.getContractFactory("SigningModule");

      contractInstance = await DocumentRegistry.deploy();
    });

    it('Should add a document for signing', async () => {

      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("docHash"))
      // Don't covers to bytes if it is a hexa string
      const signers = [account1._address, account2._address]

      expect(await contractInstance.connect(account1).addDocument(docHash, "test Doc", signers))
    })

    it('Should sign the document', async () => {

      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("docHash"))
      // Don't covers to bytes if it is a hexa string
      const signers = [account1._address, account2._address]

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
      expect(await contractInstance.connect(account1).signDocument(docHash, replayNonce, signature))
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
