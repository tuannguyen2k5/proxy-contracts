// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyCollectible is Initializable, ERC20Upgradeable {
    function initialize(string memory _name, string memory _symbol, uint256 _supply) public payable initializer {
        __ERC20_init(_name, _symbol);
        _mint(msg.sender, _supply);
    }
}
