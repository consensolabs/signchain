// SPDX-License-Identifier: GPLv3
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "./DocumentRegistry.sol";
import "./SigningModule.sol";
import "@nomiclabs/buidler/console.sol";

contract Signchain is DocumentRegistry, SigningModule {
    
    struct Notarize {
        address notaryAddress;
        uint notaryFee;
        bool notarized;
    }

    event DocumentNatarized (
        bytes32 docHash,
        uint timestamp,
        address notary 
    );

    // Fixed Notary fee    
    uint notaryFee = 0.1 ether;

    mapping(bytes32 => Notarize) public notarizedDocs;

    modifier isNotary() {

        //Check for the notary user type
        require(storeUser[msg.sender].userType == UserType.notary, "User is not a notary");
        _;
    }

    function signAndShareDocument(bytes32 documentHash, string memory title, string memory documentLocation,
                                string[] memory key, address[] memory users, address[] memory signers,
                                uint nonce, bytes memory signature, address notary) public payable {

        uploadDocument(
        documentHash,
        documentLocation,
        key,
        users);

        if(notary!= address(0)) {
            require(msg.value == notaryFee, "Invalid Notary Fee");
            notarizedDocs[documentHash] = Notarize(notary, msg.value, false);
        }
    
        addDocument(documentHash, title, signers);

        signDocument(documentHash, nonce, signature);
  
    }

    function notarizeDocument(bytes32 documentHash, uint nonce, bytes memory signature) isNotary public {
        
        // Make sure to sign the document first and then disburse the payment: Reentrancy threat
        signDocument(documentHash, nonce, signature);    
        notarizedDocs[documentHash].notarized = true;
        payable(address(msg.sender)).transfer(notarizedDocs[documentHash].notaryFee);

        emit DocumentNatarized(documentHash, now, msg.sender);

    }

}
