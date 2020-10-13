// SPDX-License-Identifier: GPLv3
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "./DocumentRegistry.sol";
import "./SigningModule.sol";
import "@nomiclabs/buidler/console.sol";

contract Signchain is DocumentRegistry, SigningModule {

    function signAndShareDocument(bytes32 documentHash, string memory documentLocation,
                                string[] memory key, address[] memory users, address[] memory signers,
                                uint nonce, bytes memory signature) public {

        uploadDocument(
        documentHash,
        documentLocation,
        key,
        users);
    
        addDocument(documentHash, signers);

        signDocument(documentHash, nonce, signature);
  
    }

}
