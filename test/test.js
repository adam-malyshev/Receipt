const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RecieptNFT Contract", function () {
  let nft;
	let nftContractAddress;
	let tokenId;

  // ReceiptNFT contract
	beforeEach('Setup Contract', async () => {
		const RecieptNFT = await ethers.getContractFactory('ReceiptNFT');
		nft = await RecieptNFT.deploy();
		await nft.deployed();
    var signers = await ethers.getSigners();
    
		nftContractAddress = await nft.address;

	});
  // Tests address for the ReceiptNFT contract
	it('Should have an address', async () => {
		expect(nftContractAddress).to.not.equal(0x0);
    expect(nftContractAddress).to.not.equal('');
    expect(nftContractAddress).to.not.equal(null);
    expect(nftContractAddress).to.not.equal(undefined);
	});

  describe("Nft Functionality", () => {
    let recipientAddress;
    let sellerAddress;
    let item;

    beforeEach('Mint', async () => {

      await nft.deployed();
      
      
      recipientAddress =  [
          123,
          "Street",
          12345,
          "NJ",
          "United States of America"
      ];
      sellerAddress =  [
        123,
        "Street",
        12345,
        "NJ",
        "United States of America"
      ];

      item = [
        "Item",
        "It is an item",
        20,
        "Shipping",
        15,
        "United States of America"
      ];

      date = [
        1,
        1,
        2022
      ]
    
      // mint NFT and check tokenId is 0
      let txn = await nft.create(
        "Joe Recipient",
        await (await ethers.getSigner()).getAddress(),
        recipientAddress,
        "Bob Seller",
        sellerAddress,
        date,
        "Dollar",
        item,
        35
      );

      let tx = await txn.wait();
      // Transfer event in ERC721 contract 
      let event = tx.events[0];
      // console.log("Event Arguements: ", event.args);
      let value = event.args[2];
      tokenId = value.toNumber();
    });
    it("Should mint nft to local address", async function () {
      expect(tokenId).to.equal(0);
    });
    it("Should re-mint nft", async function (){
      // Mint another NFT check tokenId 1
      txn = await nft.create(
        "Joe Recipient",
        await (await ethers.getSigner()).getAddress(),
        recipientAddress,
        "Bob Seller",
        sellerAddress,
        date,
        "Dollar",
        item,
        35
      );

      tx = await txn.wait();

      // Transfer event in ERC721 contract 
      event = tx.events[0];
      value = event.args[2];
      tokenId = value.toNumber();

      expect(tokenId).to.equal(1);
    });
    it("Should return proper data", async function (){
      // Mint NFT to ensure that the signer stays consistent
      txn = await nft.create(
        "Joe Recipient",
        await (await ethers.getSigner()).getAddress(),
        recipientAddress,
        "Bob Seller",
        sellerAddress,
        date,
        "Dollar",
        item,
        35
      );

      tx = await txn.wait();

      // Transfer event in ERC721 contract 
      event = tx.events[0];
      value = event.args[2];
      tokenId = value.toNumber();

      // get reciept with tokenId
      let reciept = await nft.getReciept(tokenId);

      let expectedReciept = [
        "Joe Recipient",
        await (await ethers.getSigner()).getAddress(),
        recipientAddress,
        "Bob Seller",
        await (await ethers.getSigner()).getAddress(),
        sellerAddress,
        date,
        "Dollar",
        item,
        35
      ];
      // assert token matches expectations by picking some values
      expect(reciept.recipientName).to.equal(expectedReciept[0]);
      expect(reciept.seller).to.equal(expectedReciept[4]);
      console.log(reciept);
    });
  });
  
});
