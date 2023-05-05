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
    uint256 deadline,
    uint x
  ) external {
    require(block.timestamp < deadline, "Signed transaction expired");

    bytes32 structHash = keccak256(abi.encode(
        keccak256("SetTest(address sender,uint256 x,uint256 deadline)"),
        _msgSender(),
        x,
        deadline
    ));

    bytes32 digest = _hashTypedDataV4(structHash);

    address signer = ECDSAUpgradeable.recover(digest, v, r, s);
    require(signer == owner(), "SimpleStorage: invalid signature");

    set(x);
  }
}
