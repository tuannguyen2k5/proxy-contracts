import { ethers,upgrades } from "hardhat";

// TO DO: Place the address of your proxy here!

async function main() {
    const UpgradeableERC20 = await ethers.getContractFactory("UpgradeableERC20")
    const UpgradeableContract = await upgrades.deployProxy(UpgradeableERC20, ['MyToken', 'MTC', '2', '1000000']);
    const NewERC20 = await ethers.getContractFactory("NewERC20");
    const upgraded = await upgrades.upgradeProxy(UpgradeableContract.address, NewERC20);
   console.log(upgraded.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });