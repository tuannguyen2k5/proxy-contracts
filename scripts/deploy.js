
const hre = require("hardhat");

async function main() {
  const UpgradeableERC20 = await hre.ethers.getContractFactory('UpgradeableERC20');
  const deployedContract = await hre.upgrades.deployProxy(UpgradeableERC20, ['MyToken', 'MTC', '2', '1000000']);
  console.log(`Contract deployed to address: ${deployedContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


