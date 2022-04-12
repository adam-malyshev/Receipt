const fs = require("fs");
let { networkConfig } = require("../helper-hardhat-config");

module.exports = async({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-")
    const ReceiptNFT = await deploy("ReceiptNFT", {
        from: deployer,
        log: true
    });

    log(`You have deployed an NFT contract to ${ReceiptNFT.address}`);

    const receiptNFTContract = await ethers.getContractFactory("ReceiptNFT");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const customer = accounts[1];
    const receiptNFT = new ethers.Contract(ReceiptNFT.address, receiptNFTContract.interface, signer);
    const networkName = networkConfig[chainId]['name'];

    log(`Verify with: \n npx hardhat verify --network ${networkName} ${receiptNFT.address}`);

    var recipientAddress =  [
        123,
        "Street",
        12345,
        "NJ",
        "United States of America"
    ];
    var sellerAddress =  [
      123,
      "Street",
      12345,
      "NJ",
      "United States of America"
    ];

    var item = [
      "Item",
      "It is an item",
      20,
      "Shipping",
      15,
      "United States of America"
    ];

    var date = [
      1,
      1,
      2022
    ];
  
    // mint NFT and check tokenId is 0
    let transactionResponse = await receiptNFT.create(
      "Joe Recipient",
      await accounts[1].getAddress(),
      recipientAddress,
      "Bob Seller",
      sellerAddress,
      date,
      "Dollar",
      item,
      35
    );
    // wait for one block for transaction to go through 
    let receipt = await transactionResponse.wait(1);
    log(`You have made an NFT!`);
}