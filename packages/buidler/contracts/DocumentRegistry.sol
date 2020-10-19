// SPDX-License-Identifier: GPLv3
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@nomiclabs/buidler/console.sol";

contract DocumentRegistry {

    enum UserType {
        party,
        notary
    }

    struct UserSchema {
        string name;
        string email;
        bool status;
        string publicKey;
        bytes32[] documentHash;
        UserType userType;
    }

    struct Document{
        string documentLocation;
        bytes32 documentHash;
        string[] key;
        address[] users;
    }

    // Map to store all the registered users
    mapping(address=>UserSchema) public storeUser;

    // array to store registered users address
    address[] registeredUsers;

    //mapping of docHash
    mapping(bytes32 => Document) storeDocument;

    /**
     * @dev Register User
     * @param userName: User Name
     * @param userEmail: User mail id
     */
    function registerUser(
        string memory userName,
        string memory userEmail,
        string memory publicKey,
        UserType userType
    ) public{
        require(!storeUser[msg.sender].status, "Should not be registered before!");

        storeUser[msg.sender].name = userName;
        storeUser[msg.sender].email = userEmail;
        storeUser[msg.sender].publicKey = publicKey;
        storeUser[msg.sender].status = true;
        storeUser[msg.sender].userType = userType;
        registeredUsers.push(msg.sender);
        console.log("User registered");
    }

    /**
     * @dev Update public key
     * @param key: caller's public key
     */
    function updatePublicKey(string memory key) public{
        storeUser[msg.sender].publicKey = key;
    }

    /**
     * @dev Upload document
     * @param documentHash: doc Hash
     * @param documentLocation: doc location
     * @param key: Array to hold AesEnc Key for party's involved in document exchange
     * @param users: Array to hold party's address
     * @notice Consider there is document exchange between PartyA and PartyB then key array will
     * contain key for both party and the user array will contain address of both party.
     *
     * For each party present in the user array, the respected party's docIndex will be appended with
     * the index where current document is stored
     */
    function uploadDocument(
        bytes32 documentHash,
        string memory documentLocation,
        string[] memory key,
        address[] memory users
    ) public {
        Document memory newDoc = Document({
            documentLocation: documentLocation,
            documentHash: documentHash,
            key: key,
            users: users
        });

        for(uint256 i=0;i<users.length;i++){
            storeUser[users[i]].documentHash.push(documentHash);
        }
        storeDocument[documentHash] = newDoc;
    }

    function getDocument(bytes32 documentHash) public view returns(Document memory document){
        return storeDocument[documentHash];
    }

    function getAllDocument() public view returns(bytes32[] memory docHash){
        return storeUser[msg.sender].documentHash;
    }

    /*function getTotalDocuments() public view returns(uint256){
        return storeDocument.length;
    }*/

    function getPublicKey(address userAddress) public view returns(string memory publicKey){
        return storeUser[userAddress].publicKey;
    }

    function getCipherKey(bytes32 docHash)public view returns(string memory cipherKey){
        Document memory document = storeDocument[docHash];
        uint256 index;
        for (uint256 i = 0;i<document.users.length;i++){
            if(document.users[i]==msg.sender){
                index =i;
                break;
            }
        }
        return document.key[index];
    }

    function getAllUsers() public view returns(address[] memory users){
        return registeredUsers;
    }
}
