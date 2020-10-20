const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const userType = {party: 0, notary: 1}

describe("Signchain", function () {
  let contractInstance, account1, account2;


  describe("DocumentRegistry", function () {

    
    it("Should deploy DocumentRegistry", async function () {

      [account1, account2] = await ethers.getSigners();
  
      const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");

      contractInstance = await DocumentRegistry.deploy();
    });

    it('Should register PartyA', async () => {
      expect(await contractInstance.connect(account1).registerUser("PartyA","a@gmail.com", "publicKeyPartyA", userType.party))
  })
    
  it('Should  register PartyB', async () =>{
    expect(await contractInstance.connect(account2).registerUser("PartyB","b@gmail.com", "publicKeyPartyA", userType.party))
});

it('Should get all users', async () =>{

  const users = await contractInstance.getAllUsers()
  expect(users.length).to.equal(2)
});

it('Should update public key of PartyA', async() => {

  expect(await contractInstance.connect(account1).updatePublicKey("publicKeyPartyA"))

});

it('Should update public key of PartyB', async() => {
  expect(await contractInstance.connect(account2).updatePublicKey("publicKeyPartyB"))
});

//PartyB getting PartyA public key for encryption
it('Should get partyA public key', async() => {
  const publicKey = await contractInstance.getPublicKey(account1._address)
  expect(publicKey).to.equal("publicKeyPartyA")
});

it('Should share document between PartyA and PartyB', async() => {
  const document = await contractInstance.connect(account2).uploadDocument(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash")),
      "doc location",
      ["AesEncKeyPartyA","AesEncKeyPartyB"],
      [account1._address,account2._address])
  expect(document)
});

it('Should get all document for PartyA', async() => {
  const document = await contractInstance.connect(account1).getAllDocument()
  expect(document.length).to.equal(1)
});

it('Should get specific document', async() => {
  const document = await contractInstance.getDocument(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash")))
  expect(document.users.length).to.equal(2)
  expect(document.key.length).to.equal(2)
  expect(document.documentLocation).to.equal('doc location')
  expect(document.documentHash).to.equal(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash")))
});

it('Should get AesEncKey for PartyA for document 0', async () => {
  const cipherKey = await contractInstance.connect(account1).getCipherKey(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc Hash")))
  expect(cipherKey).to.equal('AesEncKeyPartyA')
});

  });
});
