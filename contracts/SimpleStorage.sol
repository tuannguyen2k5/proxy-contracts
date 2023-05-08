// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
contract SimpleStorage is OwnableUpgradeable, EIP712Upgradeable {
    uint storedData;

    function __SimpleStorage_init() internal initializer {
        __Ownable_init();
        __EIP712_init("SimpleStorage", "1");
    }

    function set(uint x) internal {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }

    function executeSetIfSignatureMatch(
        uint8 v,
        bytes32 r,
        bytes32 s,
         address sender,
        uint256 deadline,
        uint x
    ) external {
       
        require(block.timestamp < deadline, "Signed transaction expired");

        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Set(address sender,uint256 x,uint256 deadline)"),
                sender,
                x,
                deadline
            )
        );
        bytes32 eip712DomainHash = keccak256(
        abi.encode(
            keccak256(
                "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
            ),
            keccak256(bytes("SimpleStorage")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        )
    );  

        bytes32 hash = keccak256(abi.encodePacked("\x19\x01", eip712DomainHash, structHash));
        // bytes32 digest = _hashTypedDataV4(structHash);

        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
        require(signer == sender, "SimpleStorage: invalid signature");

        set(x);
    }
}
