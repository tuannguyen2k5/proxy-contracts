import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import  { signTypedData_v4 } from "eth-sig-util";

describe("SimpleStorage", function () {
  let SimpleStorage;
  let simpleStorage:Contract;

  let owner:any;
  let addr1:any;
  let addr2: any;

  beforeEach(async function () {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();

    [owner, addr1,addr2] = await ethers.getSigners();
    
  });

  describe("executeSetIfSignatureMatch", function () {
    it('Should set the stored data to a new value with a valid signature', async () => {
        const value = 42;
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        const message = {
            sender: addr1.address,
            x: value,
            deadline: deadline,
          };
        const types = {
            Set: [
                { name: "sender", type: "address" },
                { name: "x", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
        };
        const domain =  {
            name: "SimpleStorage",
            version: "1",
            chainId: (await ethers.provider.getNetwork()).chainId,
            verifyingContract: simpleStorage.address,
          }
          
        const signature = await owner._signTypedData(
          domain,
          types,
          message
        );
    
        await simpleStorage.executeSetIfSignatureMatch(
          message,
          signature
        );
    
        expect(await simpleStorage.get()).to.equal(value);
      });
      it('Should revert with an expired signature', async () => {
        const value = 42;
        const deadline = Math.floor(Date.now() / 1000) - 3600;

        const message = {
            sender: addr1.address,
            x: value,
            deadline: deadline,
          };
        const types = {
            Set: [
                { name: "sender", type: "address" },
                { name: "x", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
        };
        const domain =  {
            name: "SimpleStorage",
            version: "1",
            chainId: (await ethers.provider.getNetwork()).chainId,
            verifyingContract: simpleStorage.address,
          }
          
        const signature = await owner._signTypedData(
          domain,
          types,
          message
        );
    
        await expect(
          simpleStorage.executeSetIfSignatureMatch(message,signature)
        ).to.be.revertedWith("Signed transaction expired");
      });
      it('Should revert with invalid signature', async () => {
        const value = 42;
        const deadline = Math.floor(Date.now() / 1000) - 3600;

        const message = {
            sender: addr1.address,
            x: value,
            deadline: deadline,
          };
        const types = {
            Set: [
                { name: "sender", type: "address" },
                { name: "x", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
        };
        const domain =  {
            name: "SimpleStorage",
            version: "1",
            chainId: (await ethers.provider.getNetwork()).chainId,
            verifyingContract: simpleStorage.address,
          }
          
        const signature = await addr2._signTypedData(
          domain,
          types,
          message
        );
    
        await expect(
          simpleStorage.executeSetIfSignatureMatch(message,signature)
        ).to.be.revertedWith("Invalid signature");
      });
    it("Should set the stored data to a new value with a valid signature with signTypedDataV4", async function () {
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
  
      // Call the executeSetIfSignatureMatch function with the parameters and signature
      await simpleStorage.executeSetIfSignatureMatch(typedData.message,signature);
  
      // Check that the stored data has changed
      expect(await simpleStorage.get()).to.equal(x);
    });
    
    

  })
})

