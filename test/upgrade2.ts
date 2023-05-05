import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("upgrade", function () {
    it('it should upgrade balance,name,symbol in the MyCollectibleV2 equal in MyCollectible', async () => {
        const [owner] = await ethers.getSigners();

        const MyCollectible = await ethers.getContractFactory("MyCollectible");
        const MyCollectibleV2 = await ethers.getContractFactory("MyCollectibleV2");

        const instance = await upgrades.deployProxy(MyCollectible, ['MyToken', 'MTC', '1000000']);
        const upgraded = await upgrades.upgradeProxy(instance.address, MyCollectibleV2);

        const balance = await upgraded.balanceOf(owner.address);
        const name = await upgraded.name();
        const symbol = await upgraded.symbol();

        expect(balance).to.equal(1000000);
        expect(name).to.equal('MyToken');
        expect(symbol).to.equal('MTC');
    });
    it('it should upgrade balance of address of MyCollectibleV2 contract equal to MyCollectible Contract', async () => {

        const MyCollectible = await ethers.getContractFactory("MyCollectible");
        const MyCollectibleV2 = await ethers.getContractFactory("MyCollectibleV2");

        const instance = await upgrades.deployProxy(MyCollectible, ['MyToken', 'MTC', '1000000']);
        const upgraded = await upgrades.upgradeProxy(instance.address, MyCollectibleV2);
        instance.transfer('0xdD2FD4581271e230360230F9337D5c0430Bf44C0',10)
        const balance = await upgraded.balanceOf('0xdD2FD4581271e230360230F9337D5c0430Bf44C0');
        expect(balance).to.equal(10);
    })
});