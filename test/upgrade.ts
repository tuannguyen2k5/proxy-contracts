import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("upgrade", function () {
    it('it should upgrade balance,name,symbol in the NewERC20 the same in UpgradeableERC20', async () => {
        const [owner] = await ethers.getSigners();

        const UpgradeableERC20 = await ethers.getContractFactory("UpgradeableERC20");
        const NewERC20 = await ethers.getContractFactory("NewERC20");

        const instance = await upgrades.deployProxy(UpgradeableERC20, ['MyToken', 'MTC', '2', '1000000']);
        const upgraded = await upgrades.upgradeProxy(instance.address, NewERC20);

        const balance = await upgraded.balanceOf(owner.address);
        const name = await upgraded.name();
        const symbol = await upgraded.symbol();

        expect(balance).to.equal(1000000);
        expect(name).to.equal('MyToken');
        expect(symbol).to.equal('MTC');
    });
    it('it should upgrade balance of address of NewERC20 contract equal to Upgradeable Contract', async () => {
        const [owner] = await ethers.getSigners();

        const UpgradeableERC20 = await ethers.getContractFactory("UpgradeableERC20");
        const NewERC20 = await ethers.getContractFactory("NewERC20");

        const instance = await upgrades.deployProxy(UpgradeableERC20, ['MyToken', 'MTC', '2', '1000000']);
        const upgraded = await upgrades.upgradeProxy(instance.address, NewERC20);
        instance.transfer('0xdD2FD4581271e230360230F9337D5c0430Bf44C0',10)
        const balance = await upgraded.balanceOf('0xdD2FD4581271e230360230F9337D5c0430Bf44C0');
        expect(balance).to.equal(10);
    })
});