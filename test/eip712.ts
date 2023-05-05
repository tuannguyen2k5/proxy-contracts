import { ethers } from "hardhat";
import { expect } from "chai";

describe("SimpleStorage", function () {
  let SimpleStorage;
  let simpleStorage;

  let owner;
  let addr1;

  beforeEach(async function () {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();

    [owner, addr1] = await ethers.getSigners();
  });

  describe("executeSetIfSignatureMatch", function () {
    it("should set the storedData value if the signature matches the owner's", async function () {
      const valueToSet = ethers.BigNumber.from(42);

      const deadline = ethers.BigNumber.from(Math.floor(Date.now() / 1000) + 3600);

      // Sign the transaction with the owner's private key
      const message = {
        sender: owner.address,
        x: valueToSet,
        deadline: deadline,
      };
      const domain = {
        name: "SimpleStorage",
        version: "1",
        chainId: 1337,
        verifyingContract: simpleStorage.address,
      };
      const types = {
        SetTest: [
          { name: "sender", type: "address" },
          { name: "x", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
      const signature = await owner._signTypedData(domain, types, message);
      console.log(signature)

      // Execute the transaction using the signed message and verify the result
      await
        simpleStorage.executeSetIfSignatureMatch(
          signature.v,
          signature.r,
          signature.s,
          deadline,
          valueToSet
        )
      expect(await simpleStorage.get().toString()).to.equal(valueToSet.toString());
      
    });

    

  })
})