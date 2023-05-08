import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import  { signTypedData_v4 } from "eth-sig-util";
import { fromRpcSig } from "ethereumjs-util";

describe("SimpleStorage", function () {
  let SimpleStorage;
  let simpleStorage:Contract;

  let owner:any;
  let addr1:any;

  beforeEach(async function () {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();

    [owner, addr1] = await ethers.getSigners();
    
  });

  describe("executeSetIfSignatureMatch", function () {
    it("Should set the stored data to a new value with a valid signature", async function () {
      // Define the parameters for the executeSetIfSignatureMatch function
      const sender = addr1.address; // The address of the signer
      const deadline = Math.floor(Date.now() / 1000) + 3600; // The expiration time of the signature
      const x = 100; // The new value to set
  
      // Create a typed data object for EIP-712 signature
      const typedData = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Set: [
            { name: "sender", type: "address" },
            { name: "x", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Set",
        domain: {
          name: "SimpleStorage",
          version: "1",
          chainId: (await ethers.provider.getNetwork()).chainId,
          verifyingContract: simpleStorage.address,
        },
        message: {
          sender,
          x,
          deadline,
        },
      };
  
      // Sign the typed data with the sender's private key

      const signature = signTypedData_v4(
        Buffer.from("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d".slice(2), "hex"),
        { data: typedData }
      );
  
      // Parse the signature into v, r, and s components
      const { v, r, s } = fromRpcSig(signature);
  
      // Call the executeSetIfSignatureMatch function with the parameters and signature
      await simpleStorage.executeSetIfSignatureMatch(v, r, s,sender, deadline, x);
  
      // Check that the stored data has changed
      expect(await simpleStorage.get()).to.equal(x);
    });

    it("Should revert with invalid signature", async function () {
      // Define the parameters for the executeSetIfSignatureMatch function
      const sender = owner.address; // The address of the signer
      const deadline = Math.floor(Date.now() / 1000) + 3600; // The expiration time of the signature
      const x = 100; // The new value to set
  
      // Create a typed data object for EIP-712 signature
      const typedData = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Set: [
            { name: "sender", type: "address" },
            { name: "x", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Set",
        domain: {
          name: "SimpleStorage",
          version: "1",
          chainId: (await ethers.provider.getNetwork()).chainId,
          verifyingContract: simpleStorage.address,
        },
        message: {
          sender,
          x,
          deadline,
        },
      };
  
      // Sign the typed data with the sender's private key

      const signature = signTypedData_v4(
        Buffer.from("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d".slice(2), "hex"),
        { data: typedData }
      );
  
      // Parse the signature into v, r, and s components
      const { v, r, s } = fromRpcSig(signature);
  
      // Call the executeSetIfSignatureMatch function with the parameters and signature
      await expect(
        simpleStorage.executeSetIfSignatureMatch(v, r, s, sender, deadline, x)
      ).to.be.revertedWith("SimpleStorage: invalid signature");
    });
    it("Should revert with an expired signature", async function () {
      // Define the parameters for the executeSetIfSignatureMatch function
      const sender = addr1.address; // The address of the signer
      const deadline = Math.floor(Date.now() / 1000) - 3600; // The expiration time of the signature
      const x = 100; // The new value to set
  
      // Create a typed data object for EIP-712 signature
      const typedData = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Set: [
            { name: "sender", type: "address" },
            { name: "x", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Set",
        domain: {
          name: "SimpleStorage",
          version: "1",
          chainId: (await ethers.provider.getNetwork()).chainId,
          verifyingContract: simpleStorage.address,
        },
        message: {
          sender,
          x,
          deadline,
        },
      };
  
      // Sign the typed data with the sender's private key

      const signature = signTypedData_v4(
        Buffer.from("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d".slice(2), "hex"),
        { data: typedData }
      );
  
      // Parse the signature into v, r, and s components
      const { v, r, s } = fromRpcSig(signature);
  
      // Call the executeSetIfSignatureMatch function with the parameters and signature
      await expect(
        simpleStorage.executeSetIfSignatureMatch(v, r, s, sender, deadline, x)
      ).to.be.revertedWith("Signed transaction expired");
  
    });

  })
})

