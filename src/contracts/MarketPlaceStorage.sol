pragma solidity ^0.5.16;

/**
 * @title Interface for contracts conforming to ERC-721
 */


contract MarketPlaceStorage {

  struct Order {
    // Order ID
    bytes32 id;
    // Owner of the NFT
    address payable seller;
    // NFT registry address
    address nftAddress;
    // Price (in wei) for the published item
    uint256 price;
  }

  uint256 public nftCounter;
    
  // From NFT registry assetId to Order (to avoid asset collision)
  mapping (address => mapping(uint256 => Order)) public orderByAssetId;
  
  // nftCounter => assetID
  mapping (uint256 => uint256) public premiumNFT;
  
  //
  mapping (uint256 => address[]) public approvalList;

  // EVENTS
  event OrderCreated(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    address nftAddress,
    uint256 priceInWei
  );
  event OrderSuccessful(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    address nftAddress,
    uint256 totalPrice,
    address indexed buyer
  );
  event OrderCancelled(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    address nftAddress
  );

}