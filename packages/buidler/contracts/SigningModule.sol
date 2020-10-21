// SPDX-License-Identifier: GPLv3
pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@nomiclabs/buidler/console.sol";

/**
 * @author Consenso Labs
 * @title Signing Module
 * @dev A reusable signing module for agreements and other documents
*/
contract SigningModule {

    //Struct to timestamp the document
    // @notice: Storing signers in a separate array instead of mapping signer to signature to reduce complexity
    struct SignedDocument {
        string title;
        uint timestamp;
        address owner;
        address[] signers;
        Signature[] signatures;
    }

    //Struct to store signature details
    struct Signature{
        address signer;
        uint nonce;
        bytes signatureDigest;
        uint timestamp;

    }

    event DocumentSigned (
        bytes32 docHash,
        uint timestamp,
        address signer
    );

    //Mapping between original document hash before annotation and Document contents
    mapping(bytes32 => SignedDocument) public signedDocuments;

    // Mapping between address and nonce to prevent replay attack
    mapping(address => uint) public replayNonce;

    modifier isSignable(bytes32 docHash, uint nonce) {

        //Should have a valid timestamp for the document
        require(signedDocuments[docHash].timestamp > 0, "Document doesn't exist");
        require(nonce == replayNonce[msg.sender]);
        require(signerExists(docHash) == true, "Not in the signers list");
        require(notSigned(docHash) == true, "Signer already signed");
        _;
    }

    function signerExists(bytes32 docHash) private view returns (bool) {

        for(uint signerCount=0; signerCount < signedDocuments[docHash].signers.length; signerCount++) {
            if(signedDocuments[docHash].signers[signerCount] == msg.sender)
                return true;
        }
        return false;
    }

    function notSigned(bytes32 docHash) private view returns (bool) {

        for(uint signCount=0; signCount < signedDocuments[docHash].signatures.length; signCount++) {
            if(signedDocuments[docHash].signatures[signCount].signer == msg.sender)
                return false;
        }
        return true;
    }

    /**
     * @dev Add a document that needs to be signed
     * @param docHash: keccak256 hash value of the original document
     * @param signers: Array of signers of the document
     */
    function addDocument(bytes32 docHash, string memory title, address[] memory signers) public{

        // NOTE: Only solution to assign empty Signature array without hitting the storage pointer issue
        signedDocuments[docHash].timestamp = now;
        signedDocuments[docHash].title = title;
        signedDocuments[docHash].signers = signers;
        signedDocuments[docHash].owner = msg.sender;

    }

    /**
     * @dev Add a signer to the document
     * @param docHash: keccak256 hash value of the original document
     * @param signer: Signer of the document
     */
    function addSigner(bytes32 docHash, address signer) public {

        signedDocuments[docHash].signers.push(signer);
    }

    /**
     * @dev Attach a signature to the document
     * @param docHash: keccak256 hash value of the original document
     * @param nonce: Nonce to prevent replay attack
     * @param _signature: signed off chain by the initiator
     */
    function signDocument(bytes32 docHash, uint nonce, bytes memory _signature) public isSignable(docHash, nonce) {

        bytes32 metaHash = keccak256(abi.encode(docHash, nonce));
        require(getSigner(metaHash, _signature)==msg.sender, "Signature was not signed by the initiator");
        Signature memory signature = Signature(msg.sender, nonce, _signature, now);
        signedDocuments[docHash].signatures.push(signature);

        //increase the nonce to prevent replay attacks
        replayNonce[msg.sender]++;

        emit DocumentSigned(docHash, now, msg.sender);
    }

    /**
     * @return signatures of the document
     */
    function getSignatures(bytes32 docHash) public view returns(Signature[] memory) {
        return signedDocuments[docHash].signatures;

    }

    function getSignedDocuments(bytes32 docHash) public view returns(SignedDocument memory doc){
        return signedDocuments[docHash];
    }

    /**
     * @return true if the document is signed.
    */
    function isDocumentSigned(bytes32 documentHash) public view returns (bool) {
        return signedDocuments[documentHash].signers.length == signedDocuments[documentHash].signatures.length;
    }

    /**
     * @return address of the signer
     */
    function getSigner(
        bytes32 _hash,
        bytes memory _signature)
    internal
    pure
    returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;
        if (_signature.length != 65){
            return address(0);
        }
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        if (v < 27){
            v += 27;
        }
        if (v != 27 && v != 28){
            return address(0);
        } else {
            return ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)), v, r, s );
        }
    }

}