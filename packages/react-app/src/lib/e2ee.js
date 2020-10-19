/* eslint-disable */
const AWS = require("aws-sdk");
const fleekStorage = require("@fleekhq/fleek-storage-js");
const wallet = require("wallet-besu");
const fileDownload = require("js-file-download");
const e2e = require("./e2e-encrypt.js");
const ethers = require("ethers");

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: "****",
  secretAccessKey: "****",
});
let s3 = new AWS.S3();

const fleekApiKey = "****";
const fleekApiSecret = "****";

export const registerUser = async function (name, email, privateKey, userType, tx, writeContracts) {
  try {
    let publicKey = e2e.getPublicKey(privateKey);
    publicKey = publicKey.toString("hex");
    const result = await tx(writeContracts.Signchain.registerUser(name, email, publicKey, userType));
    console.log("Register res:", result);
    return true;
  } catch (err) {
    throw err;
  }
};

export const createWallet = async function (password) {
  return await wallet.create(password, "orion key1");
};

export const getAllAccounts = async function (password) {
  return await wallet.login(password);
};

export const loginUser = async function (privateKey, tx, writeContracts) {
  try {
    let publicKey = e2e.getPublicKey(privateKey);
    publicKey = publicKey.toString("hex");
    const result = await tx(writeContracts.Signchain.updatePublicKey(publicKey));
    console.log("Login:", result);
    return true;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async function (loggedUser, tx, writeContracts) {
  const registeredUsers = await tx(writeContracts.Signchain.getAllUsers());
  const userType = { party: 0, notary: 1 };
  let caller;
  let userArray = [];
  let notaryArray = [];
  try {
    for (let i = 0; i < registeredUsers.length; i++) {
      const result = await tx(writeContracts.Signchain.storeUser(registeredUsers[i]));
      const value = {
        address: registeredUsers[i],
        name: result.name,
        email: result.email,
        key: result.publicKey,
        userType: result.userType,
      };
      if (loggedUser.toLowerCase() == registeredUsers[i].toLowerCase()) {
        caller = value;
      } else if (result.userType == userType.notary) {
        notaryArray.push(value);
      } else {
        userArray.push(value);
      }
    }
  } catch (err) {
    console.log(err);
  }
  const userDetails = {
    userArray: userArray,
    notaryArray: notaryArray,
    caller: caller,
  };
  return userDetails;
};

const storeFileFleek = async (fileName, encryptedData) => {
  return await fleekStorage.upload({
    apiKey: fleekApiKey,
    apiSecret: fleekApiSecret,
    key: fileName,
    data: encryptedData,
  });
};

const getFileFleek = async fileName => {
  const file = await fleekStorage.get({
    apiKey: fleekApiKey,
    apiSecret: fleekApiSecret,
    key: fileName,
  });
  return file.data;
};

export const storeFileAWS = function (awsKey, encryptedData) {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: "secure-doc-test",
        Key: awsKey,
        Body: encryptedData,
      },
      function (error, data) {
        if (error != null) {
          reject(false);
        } else {
          resolve(true);
        }
      },
    );
  });
};

export const getFileAWS = function (key) {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: "secure-doc-test",
        Key: key,
      },
      function (error, data) {
        if (error != null) {
          reject(error);
        } else {
          resolve(data.Body);
        }
      },
    );
  });
};

export const uploadFile = async function (
  party,
  file,
  password,
  setSubmitting,
  tx,
  writeContracts,
  signer,
  storageType,
) {
  let encryptedKeys = [];
  let userAddress = [];
  const cipherKey = await e2e.generateCipherKey(password);
  const fileSplit = file.name.split(".");
  const fileFormat = fileSplit[fileSplit.length - 1];
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async val => {
    const fileInput = new Uint8Array(val.target.result);
    const encryptedFile = await e2e.encryptFile(Buffer.from(fileInput), cipherKey);

    const fileHash = e2e.calculateHash(fileInput);

    const signature = await signDocument(fileHash, tx, writeContracts, signer);

    for (let i = 0; i < party.length; i++) {
      let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key, "hex"), cipherKey);
      let storeKey = {
        iv: aesEncKey.iv.toString("hex"),
        ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
        ciphertext: aesEncKey.ciphertext.toString("hex"),
        mac: aesEncKey.mac.toString("hex"),
      };
      encryptedKeys.push(JSON.stringify(storeKey));
      userAddress.push(party[i].address);
    }
    const fileKey = fileHash.toString("hex").concat(".").concat(storageType).concat(".").concat(fileFormat);

    if (storageType === "Fleek") {
      storeFileFleek(fileKey, encryptedFile)
        .then(() => {
          tx(writeContracts.Signchain.uploadDocument(fileHash, fileKey, encryptedKeys, userAddress)).then(receipt => {
            setSubmitting(false);
          });
        })
        .catch(err => {
          console.log("ERROR: ", err);
        });
    } else {
      storeFileAWS(fileKey, encryptedFile)
        .then(() => {
          tx(
            writeContracts.Signchain.signAndShareDocument(
              fileHash,
              fileKey,
              encryptedKeys,
              userAddress,
              userAddress,
              signature[0],
              signature[1],
            ),
          ).then(receipt => {
            setSubmitting(false);
          });
        })
        .catch(err => {
          console.log("ERROR: ", err);
        });
    }
  };
};

export const registerDoc = async function (
  party,
  fileHash,
  fileKey,
  password,
  setSubmitting,
  tx,
  writeContracts,
  signer,
  notary,
) {
  console.log(notary);

  let encryptedKeys = [];
  let userAddress = [];

  setSubmitting(true);

  const cipherKey = await e2e.generateCipherKey(password);

  const signature = await signDocument(fileHash, tx, writeContracts, signer);

  for (let i = 0; i < party.length; i++) {
    let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key, "hex"), cipherKey);
    let storeKey = {
      iv: aesEncKey.iv.toString("hex"),
      ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
      ciphertext: aesEncKey.ciphertext.toString("hex"),
      mac: aesEncKey.mac.toString("hex"),
    };
    encryptedKeys.push(JSON.stringify(storeKey));
    userAddress.push(party[i].address);
  }

  tx(
    writeContracts.Signchain.signAndShareDocument(
      fileHash,
      fileKey,
      encryptedKeys,
      userAddress,
      userAddress,
      signature[0],
      signature[1],
      notary ? notary.address : "0x0000000000000000000000000000000000000000",
      { value: ethers.utils.parseUnits(notary ? "0.1" : "0", "ether") },
    ),
  ).then(receipt => {
    setSubmitting(false);
  });
};

export const uploadDoc = async function (file, password, setSubmitting, storageType, setFileInfo) {
  let encryptedKeys = [];
  let userAddress = [];
  const cipherKey = await e2e.generateCipherKey(password);
  const fileSplit = file.name.split(".");
  const fileFormat = fileSplit[fileSplit.length - 1];
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async val => {
    const fileInput = new Uint8Array(val.target.result);
    const encryptedFile = await e2e.encryptFile(Buffer.from(fileInput), cipherKey);

    const fileHash = e2e.calculateHash(fileInput);

    const fileKey = fileHash.toString("hex").concat(".").concat(storageType).concat(".").concat(fileFormat);

    if (storageType === "Fleek") {
      await storeFileFleek(fileKey, encryptedFile);
    } else {
      await storeFileAWS(fileKey, encryptedFile);
    }
    setSubmitting(false);
    setFileInfo({
      cipherKey: cipherKey,
      fileKey: fileKey,
      fileHash: fileHash,
      fileName: file.name,
      fileFormat: fileFormat,
    });
  };

  return { cipherKey: cipherKey };
};

export const getAllFile = async function (tx, writeContracts) {
  return await tx(writeContracts.Signchain.getAllDocIndex());
};

export const downloadFile = async function (docIndex, password, tx, writeContracts) {
  let cipherKey = await tx(writeContracts.Signchain.getCipherKey(docIndex));
  console.log(cipherKey);
  cipherKey = JSON.parse(cipherKey);
  const document = await tx(writeContracts.Signchain.getDocument(docIndex));
  let encryptedKey = {
    iv: Buffer.from(cipherKey.iv, "hex"),
    ephemPublicKey: Buffer.from(cipherKey.ephemPublicKey, "hex"),
    ciphertext: Buffer.from(cipherKey.ciphertext, "hex"),
    mac: Buffer.from(cipherKey.mac, "hex"),
  };

  const privateKey = await wallet.login(password);
  const decryptedKey = await e2e.decryptKey(privateKey[0], encryptedKey);
  const documentHash = document.documentHash;
  const documentLocation = document.documentLocation;

  const fileSplit = documentLocation.split(".");
  const fileFormat = fileSplit[fileSplit.length - 1];
  const storageType = fileSplit[fileSplit.length - 2];
  console.log("download storage type:", storageType);
  return new Promise(resolve => {
    if (storageType === "AWS") {
      getFileAWS(documentLocation).then(encryptedFile => {
        e2e.decryptFile(encryptedFile, decryptedKey).then(decryptedFile => {
          const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex");
          fileDownload(decryptedFile, "res2".concat(".").concat(fileFormat));
          resolve(true);
        });
      });
    } else {
      getFileFleek(documentLocation).then(encryptedFile => {
        e2e.decryptFile(encryptedFile, decryptedKey).then(decryptedFile => {
          const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex");
          fileDownload(decryptedFile, "res2".concat(".").concat(fileFormat));
          resolve(true);
        });
      });
    }
  });
};

const signDocument = async function (fileHash, tx, writeContracts, signer) {
  const selfAddress = await signer.getAddress();
  const replayNonce = await tx(writeContracts.Signchain.replayNonce(selfAddress));

  const params = [
    ["bytes32", "uint"],
    [fileHash, replayNonce],
  ];

  const paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
  return [replayNonce, await signer.signMessage(ethers.utils.arrayify(paramsHash))];
};
