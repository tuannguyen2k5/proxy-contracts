// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyCollectibleV2 is Initializable, ERC20Upgradeable {
    function initialize(string memory _name, string memory _symbol, uint256 _supply) public initializer {
        __ERC20_init(_name, _symbol);
        _mint(msg.sender, _supply);
    }
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 senderBalance = balanceOf(msg.sender);
        require(amount <= senderBalance / 2, "Transfer amount exceeds 50% of balance of sender");
        return super.transfer(recipient, amount);
    }
}
