const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const UpgradeableERC20 = artifacts.require('UpgradeableERC20');
module.exports = async function (deployer) {
    await deployProxy(UpgradeableERC20, ['MyToken', 'MTC', '2', '1000000'], { deployer, initializer: 'initialize' });
};