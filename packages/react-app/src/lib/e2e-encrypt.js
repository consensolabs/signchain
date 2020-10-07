const crypto = require('crypto')
const eccrypto = require("eccrypto")

/**
 * Encrypts Symmetric key used for encrypting file
 * @param publicKey: {Buffer}
 * @param cipherKey: {Buffer} Symmetric Key
 * @returns {Promise<unknown>|null}
 */
export const encryptKey = function(publicKey,cipherKey){
    try {
        const iv = Buffer.alloc(16);
        iv.fill(5);
        const ephemPrivateKey = Buffer.alloc(32);
        ephemPrivateKey.fill(4);
        const encOpts = {ephemPrivateKey: ephemPrivateKey, iv: iv};
        return new Promise((resolve) => {
            eccrypto.encrypt(publicKey, cipherKey, encOpts).then(function (result) {
                resolve(result);
            })
        })
    }catch(err) {
        console.error("Error while encrypting key:",err)
        return null
    }

}

/**
 * Get public key from private key
 * @param privateKey: {String}
 * @returns {null|Buffer}
 */
export const getPublicKey = function (privateKey){
    try {
        return eccrypto.getPublic(Buffer.from(privateKey, "hex"))
    }catch(err){
        throw err
    }
}

/**
 * Decrypts Symmetric key used for encrypting file
 * @param privateKey: {String}
 * @param encryptedKey: {Buffer}
 * @returns {Promise<unknown>|null}
 */
export const decryptKey = function(privateKey,encryptedKey){
    try {
        return new Promise((resolve) => {
            eccrypto.decrypt(Buffer.from(privateKey, "hex"), encryptedKey)
                .then(function (decryptedKey) {
                    console.log('Decrypted key:',decryptedKey)
                    resolve(decryptedKey)
                });
        })

    }catch(err){
        console.error("Error while decrypting key:",err)
        return null
    }
}

/**
 * Create symmetric key for file encryption
 * @param password: {String}
 * @returns {null|Buffer}
 */
export const generateCipherKey = function(password){
    try {
        return new Promise((resolve)=>{
            const cipherKey = crypto.createHash('sha256').update(password).digest();
            console.log("AES Key:",cipherKey)
            resolve(cipherKey)
        })
    }catch (err) {
        console.error("Error while generating symmetric key:",err)
        return null
    }
}


export const encryptFile = function(file,cipherKey){
    return new Promise((resolve)=>{
        let iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes256', cipherKey, iv);
        const encryptedData= Buffer.concat([
            iv,
            cipher.update(file),
            cipher.final()
        ]);

        resolve(encryptedData)
    })
}

export const calculateHash = function(file){
    return crypto.createHash('sha256').update(file.toString()).digest()
}

export const decryptFile = async function(encryptedData,cipherKey){
    const iv = encryptedData.slice(0,16)
    encryptedData = encryptedData.slice(16)
    return new Promise((resolve)=>{
        const decipher = crypto.createDecipheriv("aes256",cipherKey,iv)
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        resolve(decryptedData)
    })

}
