// SPDX-License-Identifier: MIT
pragma solidity >=0.8.1 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

import "hardhat/console.sol";

contract SimpleStorage is OwnableUpgradeable, EIP712Upgradeable {
    uint storedData;
   address[] private whitelist = [
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
        0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    ];
    struct Set {
        address sender;
        uint256 x;
        uint256 deadline;
    }

    bytes32 private constant _TYPEHASH = keccak256("Set(address sender,uint256 x,uint256 deadline)");

    function __SimpleStorage_init() internal initializer {
        __Ownable_init_unchained();
        __EIP712_init_unchained("SimpleStorage", "1");
    }

    function set(uint x) internal {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
    
    function getSigner(Set calldata req, bytes calldata signature)
        public
        view
        returns (address)
    {
    bytes32 digest = keccak256(abi.encode(_TYPEHASH, req.sender, req.x, req.deadline));
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

    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", eip712DomainHash, digest));
    address signer = ECDSAUpgradeable.recover(hash,signature);

    return signer;
    }
    function isSigner(address _signer) private view returns (bool) {
        for (uint i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _signer) {
                return true;
            }
        }
        return false;
    }

    function executeSetIfSignatureMatch(
       Set calldata _req, bytes calldata signature
    ) public {
        address signer = getSigner(_req, signature);
        require(isSigner(signer),"Invalid signature");
        require(block.timestamp < _req.deadline, "Signed transaction expired");
        set(_req.x);
    }
}
