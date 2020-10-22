/* eslint-disable */
const AWS = require('aws-sdk')
const fleekStorage = require('@fleekhq/fleek-storage-js')
const wallet = require('wallet-besu')
const fileDownload = require('js-file-download')
const e2e = require('./e2e-encrypt.js')
const ethers = require('ethers')

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: '****',
    secretAccessKey:  '****'
})
let s3 = new AWS.S3();

const fleekApiKey = "t8DYhMZ1ztjUtOFC8qEDqg=="
const fleekApiSecret = "XwZyU7RZ3H2Z1QHhUdFdi4MJx8j1axJm2hEq1olRWeU="

export const registerUser = async function(name, email, privateKey, userType, tx, writeContracts){
    try {
        let publicKey = e2e.getPublicKey(privateKey)
        publicKey = publicKey.toString("hex")
        const result = await tx(writeContracts.Signchain.registerUser(
            name, email, publicKey, userType
        ))
        console.log("Register res:",result)
        return true
    }catch(err){
        throw err
    }
}

export const createWallet = async function(password){
    return await wallet.create(password,"orion key1")
}

export const getAllAccounts = async function(password){
    return await wallet.login(password)
}

export const loginUser = async function(privateKey, tx, writeContracts){
    try {
        let publicKey = e2e.getPublicKey(privateKey)
        publicKey = publicKey.toString("hex")
        const result = await tx(writeContracts.Signchain.updatePublicKey(
            publicKey
        ))
        console.log("Login:",result)
        return true
    }catch (err) {
        throw err
    }
}

export const getAllUsers = async function(loggedUser, tx, writeContracts){
    const registeredUsers = await tx(writeContracts.Signchain.getAllUsers())
    const userType = {party: 0, notary: 1}
    let caller
    let userArray = []
    let notaryArray = []
    try {
        for (let i = 0; i < registeredUsers.length; i++){
            const result = await tx(writeContracts.Signchain.storeUser(registeredUsers[i]))
            const value = {
                address: registeredUsers[i],
                name: result.name,
                email: result.email,
                key: result.publicKey,
                userType: result.userType,
            }
            if (loggedUser.toLowerCase()==registeredUsers[i].toLowerCase()) {
                caller =value
                
            }else if (result.userType == userType.notary){
                notaryArray.push(value)
            }
            else {
                userArray.push(value)
            }
        }
    }
    catch(err) {
        console.log(err)
    }
    const userDetails = {
        userArray:userArray,
        notaryArray: notaryArray,
        caller:caller
    }
    return userDetails
}

const storeFileFleek = async (fileName,encryptedData)=>{
    return await fleekStorage.upload({
        apiKey: fleekApiKey,
        apiSecret: fleekApiSecret,
        key: fileName,
        data: encryptedData
    })
}

const getFileFleek = async (fileName)=>{
    const file = await fleekStorage.get({
        apiKey: fleekApiKey,
        apiSecret: fleekApiSecret,
        key: fileName
    })
    return file.data
}

const storeFileAWS = function (awsKey, encryptedData){
    return new Promise((resolve,reject) =>{
        s3.putObject({
            Bucket: 'secure-doc-test',
            Key: awsKey,
            Body: encryptedData
        }, function (error, data) {
            if (error != null) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const getFileAWS = function (key){
    return new Promise((resolve,reject) =>{
        s3.getObject({
            Bucket: 'secure-doc-test',
            Key: key
        },function(error, data){
            if (error != null) {
                reject(error)
            } else {
                resolve(data.Body)
            }
        })
    })
}

const storeFileSlate = function (encryptedData){
    const url = 'https://slate.host/api/v1/upload-data/6a77ee11-afe1-4a09-9453-54438e4fd326';
    let data = new FormData();

    data.append("data", encryptedData);
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Basic SLA083fb498-8ab3-48ef-83af-fdf0af77eae4TE',
            },
            body: data
        }).then((response)=>{
            console.log("Slate response:", response)
            resolve(response.json())
        }).catch((error)=>{
            console.log("Slate error:", error)
            reject(error)
        })
    })

}

const getFileSlate = function(url){
    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: {
                Authorization: 'Basic SLA083fb498-8ab3-48ef-83af-fdf0af77eae4TE',
            }
        }).then((response)=>{
            return response.arrayBuffer()
        }).then((data)=>{
            let encryptedFile = new Uint8Array(data);
            console.log("DATA:",encryptedFile)
            resolve(Buffer.from(encryptedFile))
        }).catch((error)=>{
            console.log("ERROR:",error)
            reject(error)
        })
    })
}

export const uploadFile = async function(party, file, password, setSubmitting, tx, writeContracts, signer,
                                         storageType){
    let encryptedKeys=[]
    let userAddress=[]
    const cipherKey = await e2e.generateCipherKey(password)
    const fileSplit = file.name.split(".")
    const fileFormat = fileSplit[fileSplit.length - 1]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async (val) => {
        const fileInput = new Uint8Array(val.target.result)
        const encryptedFile = await e2e.encryptFile(Buffer.from(fileInput), cipherKey)

        const fileHash = e2e.calculateHash(fileInput)

        const signature = await signDocument(fileHash, tx, writeContracts , signer)

        for (let i=0;i<party.length;i++){
            let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key,"hex"), cipherKey)
            let storeKey = {
                iv: aesEncKey.iv.toString("hex"),
                ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
                ciphertext: aesEncKey.ciphertext.toString("hex"),
                mac: aesEncKey.mac.toString("hex")
            }
            encryptedKeys.push(JSON.stringify(storeKey))
            userAddress.push(party[i].address)
        }
        const fileKey = fileHash.toString("hex").concat(".")
            .concat(storageType).concat(".").concat(fileFormat)

        if (storageType==="Fleek"){
            storeFileFleek(fileKey, encryptedFile).then(()=>{
                tx(writeContracts.Signchain.uploadDocument(
                    fileHash,
                    fileKey,
                    encryptedKeys,
                    userAddress
                )).then((receipt) => {
                    setSubmitting(false)
                })
            }).catch((err) => {
                console.log("ERROR: ", err)
            })
        }else {
            storeFileAWS(fileKey, encryptedFile).then(() => {
                tx(writeContracts.Signchain.signAndShareDocument(
                    fileHash,
                    fileKey,
                    encryptedKeys,
                    userAddress,
                    userAddress,
                    signature[0],
                    signature[1],
                    '0x0000000000000000000000000000000000000000'
                )).then((receipt) => {
                    setSubmitting(false)
                })
            }).catch((err) => {
                console.log("ERROR: ", err)
            })
        }
    }
}

export const getAllFile = async function(tx, writeContracts, address){
    const documents = await tx(writeContracts.Signchain.getAllDocument())
    let result = []
    for (let i=0;i<documents.length;i++){
        const hash = documents[i];
        const signDetails = await tx(writeContracts.Signchain.getSignedDocuments(hash))
        const notaryInfo = await getNotaryInfo(hash, tx, writeContracts)
        let signStatus = true
        let partySigned = false
        if (signDetails.signers.length !== signDetails.signatures.length){
            const array = signDetails.signatures.filter((item) => item[0]===address.toString())
            if (array.length===1){
                partySigned = true
            }
            signStatus = false;
        }else{
            signStatus = true
            partySigned = true
        }
        let value = {
            hash: hash,
            title: signDetails.title,
            timestamp: parseInt(signDetails.timestamp) * 1000,
            signStatus: signStatus,
            signers: signDetails.signers,
            signatures: signDetails.signatures,
            owner: signDetails.owner,
            partySigned: partySigned,
            notary: notaryInfo.notaryAddress,
            notarySigned: notaryInfo.notarized
        }
        result.push(value)
    }
    return result
}

export const getFile = async function(tx, writeContracts, address, docHash){

        const signDetails = await tx(writeContracts.Signchain.getSignedDocuments(docHash))
        if (!signDetails.signers.length)
          return false
        const notaryInfo = await getNotaryInfo(docHash, tx, writeContracts)
        let signStatus = true
        let partySigned = false
        if (signDetails.signers.length !== signDetails.signatures.length){
            const array = signDetails.signatures.filter((item) => item[0]===address.toString())
            if (array.length===1){
                partySigned = true
            }
            signStatus = false;
        }else{
            signStatus = true
            partySigned = true
        }
        let result = {
            hash: docHash,
            title: signDetails.title,
            timestamp: parseInt(signDetails.timestamp) * 1000,
            signStatus: signStatus,
            owner: signDetails.owner,
            signers: signDetails.signers,
            partySigned: partySigned,
            notary: notaryInfo.notaryAddress,
            notarySigned: notaryInfo.notarized
        }

    return result
}

export const registerDoc = async function(party, fileHash, cipherKey, title, fileKey, setSubmitting, tx,
    writeContracts, signer, notary){

    let encryptedKeys=[]
    let userAddress=[]

    setSubmitting(true)

    //const cipherKey = await e2e.generateCipherKey(password)

    const signature = await signDocument(fileHash, tx, writeContracts , signer)

    for (let i=0;i<party.length;i++){
        let aesEncKey = await e2e.encryptKey(Buffer.from(party[i].key,"hex"), cipherKey)
        let storeKey = {
            iv: aesEncKey.iv.toString("hex"),
            ephemPublicKey: aesEncKey.ephemPublicKey.toString("hex"),
            ciphertext: aesEncKey.ciphertext.toString("hex"),
            mac: aesEncKey.mac.toString("hex")
        }
        encryptedKeys.push(JSON.stringify(storeKey))
        userAddress.push(party[i].address)
    }

    tx(writeContracts.Signchain.signAndShareDocument(
        fileHash,
        title,
        fileKey,
        encryptedKeys,
        userAddress,
        userAddress,
        signature[0],
        signature[1],
        notary ? notary.address : '0x0000000000000000000000000000000000000000',
        {value: ethers.utils.parseUnits(notary ? "0.1" : "0", "ether")}
    )).then((receipt) => {
        setSubmitting(false)
    })
    
}

export const uploadDoc = async function(file, password, setSubmitting, storageType, setFileInfo){

    let encryptedKeys=[]
    let userAddress=[]
    const cipherKey = await e2e.generateCipherKey(password)
    const fileSplit = file.name.split(".")
    const fileFormat = fileSplit[fileSplit.length - 1]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async (val) => {
        const fileInput = new Uint8Array(val.target.result)
        const encryptedFile = await e2e.encryptFile(Buffer.from(fileInput), cipherKey)

        const fileHash = e2e.calculateHash(fileInput)

        let fileKey = fileHash.toString("hex").concat(".")
            .concat(storageType).concat(".").concat(fileFormat)

        if (storageType==="Fleek"){
            await storeFileFleek(fileKey, encryptedFile)
        }else if (storageType==="Slate"){
            let blob = new Blob([encryptedFile])
            const response = await storeFileSlate(blob)
            fileKey = response.url
            fileKey = fileKey.concat(".").concat(fileFormat)
        }else {
            await storeFileAWS(fileKey, encryptedFile)
        }
        
        setSubmitting(false)
        setFileInfo({
            cipherKey: cipherKey,
            fileKey: fileKey,
            fileHash: fileHash,
            fileName: file.name,
            fileFormat: fileFormat
        })

    }

    return {cipherKey: cipherKey}
}


export const downloadFile = async function (name, docHash,password, tx, writeContracts){

    let cipherKey = await tx(writeContracts.Signchain.getCipherKey(docHash))
    console.log(cipherKey)
    cipherKey = JSON.parse(cipherKey)
    const document = await tx(writeContracts.Signchain.getDocument(docHash))
    let encryptedKey = {
        iv: Buffer.from(cipherKey.iv,"hex"),
        ephemPublicKey: Buffer.from(cipherKey.ephemPublicKey,"hex"),
        ciphertext: Buffer.from(cipherKey.ciphertext,"hex"),
        mac: Buffer.from(cipherKey.mac,"hex")
    }

    const privateKey = await wallet.login(password);
    const decryptedKey = await e2e.decryptKey(privateKey[0],encryptedKey)
    const documentHash = document.documentHash
    let documentLocation = document.documentLocation
    console.log("Document Location:",documentLocation)
    const fileSplit= documentLocation.split(".")
    const fileFormat = fileSplit[fileSplit.length - 1]
    const storageType = fileSplit[fileSplit.length - 2]
    console.log("download storage type:",storageType)

    return new Promise((resolve)=>{
        if (storageType==="AWS") {
            getFileAWS(documentLocation).then((encryptedFile) => {
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }else if (storageType==="Fleek"){
            getFileFleek(documentLocation).then((encryptedFile) => {
                console.log("Encrypted:",encryptedFile)
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }else {
            documentLocation = documentLocation.slice(0, documentLocation.lastIndexOf("."))
            console.log("document new location:",documentLocation)
            getFileSlate(documentLocation).then((encryptedFile) => {
                console.log("Encrypted Slate:",encryptedFile)
                e2e.decryptFile(encryptedFile, decryptedKey).then((decryptedFile) => {
                    const hash2 = e2e.calculateHash(new Uint8Array(decryptedFile)).toString("hex")
                    fileDownload(decryptedFile, name.concat(".").concat(fileFormat))
                    resolve(true)
                })
            })
        }
    })
}

const signDocument = async function (fileHash, tx, writeContracts , signer){

    
    const selfAddress = await signer.getAddress()
    const replayNonce = await tx(writeContracts.Signchain.replayNonce(selfAddress))
    

    const params = [
      ["bytes32", "uint"],
      [
          fileHash,
          replayNonce
      ]
  ];

  const paramsHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(...params));
  return [replayNonce, await signer.signMessage(ethers.utils.arrayify(paramsHash))]

}

export const attachSignature = async function(fileHash, tx, writeContracts , signer){

    const signature = await signDocument(fileHash, tx, writeContracts , signer)
    const signDetails = await tx(writeContracts.Signchain.signDocument(
        fileHash,
        signature[0],
        signature[1]
    ))
    console.log("signDetails:",signDetails)
    return true
}

export const notarizeDoc = async function(fileHash, tx, writeContracts , signer){

    const signature = await signDocument(fileHash, tx, writeContracts , signer)
    const signDetails = await tx(writeContracts.Signchain.notarizeDocument(
        fileHash,
        signature[0],
        signature[1]
    ))
    console.log("signDetails:",signDetails)
    return true
}

export const getNotaryInfo = async function(fileHash, tx, writeContracts) {
   
    const notaryDetails = await tx(writeContracts.Signchain.notarizedDocs(
        fileHash))
    
    return notaryDetails


}
