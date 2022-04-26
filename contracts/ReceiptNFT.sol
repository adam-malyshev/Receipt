// give contract some SVG code
// output nft uri with this svg code
// store all nft metadata on-chain

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ReceiptNFT is ERC721{

    uint256 public tokenCounter;

    // reciept
    // Legal requirements for invoice/receipt:
    // Merchandise port of entry destination (if imported) -- optional
    // Name and address of both seller and recipient, as well as the date of sale -- private
    // Detailed description of the merchandise -- private?
    // Quantities of merchandise in weights and measures -- private?
    // Price of each item of merchandise -- private?
    // Currency type, both according to system (i.e. dollars, euros, etc.) and kind (i.e. gold, silver, paper) -- public (include crypto)
    // All additional charges on the merchandise (shipping, insurance, etc.) --
    // All rebates, drawbacks, and bounties, separately itemized
    // Country of origin of merchandise
    // All goods and services for the production not included in the invoice price, such as dies, molds, tools, and engineering work (if furnished outside of the USA)

    // These must be properties of the receipt:
    // publicly accessbile properties/ must be state --> little gas
    // read functions that are only authorized for customer and seller -->most gas
    // tokenURI attributes --> 0 gas

    // interface will then interact with contract and seamlessly read properties
    // must be very low gas

    // overall optimization must focus on cheaped possible mint and cheapest possible attribute reads
    // must also preserve privacy 

    // struct definitions to reduce variables
    // too many variables in stack cause solidity error
    


    struct StreetAddress {
        uint32 houseNumber;
        string streetName;
        string cityName;
        uint32 zipcode;
        string stateName;
        string countryName;
    }


    struct Item {
        string name;
        string description;
        uint256 price;
        string additionalChargeType;
        uint256 additionalCharge;
        string countryOfOrigin;
    }

    struct Date{
        uint8 day;
        uint8 month;
        uint16 year;
    }

    // prototype 1 simplified no arrays
    // one item reciept
    struct Reciept {
        string recipientName;
        address recipient;
        StreetAddress recipientAddress;
        string sellerName;
        address seller;
        StreetAddress sellerAddress;
        Date date;
        string currency;
        Item item;
        uint256 rebate;
    }
    
    mapping(uint256 => Reciept) private tokenIdToReciept;

    event CreatedReceiptNFT(uint256 indexed tokenId);

    modifier onlyAllowed(uint256 _tokenId) {
        require(
            msg.sender == tokenIdToReciept[_tokenId].recipient || 
            msg.sender == tokenIdToReciept[_tokenId].seller, 
            "Only reciept recipient and seller allowed");
        _;
    }

    constructor() ERC721 ("ReceiptNFT", "rcpt"){
        tokenCounter = 0;
    }

    // use Structs to decrease stack variables
    function create(
        string memory _recipientName,
        address _recipient,
        StreetAddress memory _recipientAddress,
        string memory _sellerName,
        StreetAddress memory _sellerAddress,
        Date memory _date,
        string memory _currency,
        Item memory _item,
        uint256 _rebate
        ) public{
        
        _safeMint(_recipient, tokenCounter);
        address _seller = msg.sender;
        Reciept memory _reciept = 
            Reciept(
                _recipientName, 
                _recipient, 
                _recipientAddress,
                 _sellerName, 
                 _seller, 
                 _sellerAddress, 
                 _date, 
                 _currency, 
                 _item, 
                 _rebate
            );

        tokenIdToReciept[tokenCounter] = _reciept;
        emit CreatedReceiptNFT(tokenCounter);
        
        tokenCounter = tokenCounter + 1;

    }
    function getReciept(uint256 _tokenId) public view onlyAllowed(_tokenId) returns (Reciept memory){
        return tokenIdToReciept[_tokenId];
    }
}
