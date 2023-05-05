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
        instance.transfer('0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 10)
        const balance = await upgraded.balanceOf('0xdD2FD4581271e230360230F9337D5c0430Bf44C0');
        expect(balance).to.equal(10);
    }),
    it('it should not transfer amount exceeds 50% when upgrade', async () => {
        const [owner] = await ethers.getSigners();
    
        const MyCollectible = await ethers.getContractFactory("MyCollectible");
        const MyCollectibleV2 = await ethers.getContractFactory("MyCollectibleV2");
    
        // Deploy the initial contract and transfer more than 50% of the total supply.
        const instance = await upgrades.deployProxy(MyCollectible, ['MyToken', 'MTC', '1000000']);
        await instance.transfer('0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '500100');
    
        // Verify that the transfer exceeds 50% of the total supply.
        const balance = await instance.balanceOf(owner.address);
        expect(balance).to.equal('499900');
    
        // Upgrade the contract and attempt to transfer more than 50% of the total supply.
        const upgraded = await upgrades.upgradeProxy(instance.address, MyCollectibleV2);
        await expect(upgraded.transfer('0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '400000'))
            .to.be.revertedWith('Transfer amount exceeds 50% of balance of sender');
    
        // Verify that the transfer was not allowed and the balance remains the same.
        const newBalance = await upgraded.balanceOf(owner.address);
        expect(newBalance).to.equal(balance);
    });
    
});