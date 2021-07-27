pragma solidity ^0.5.16;

import "./NFT.sol";

import "./SafeMath.sol";
import "./AddressUtils.sol";

import "./MarketPlaceStorage.sol";

contract Marketplace is MarketPlaceStorage{
    using SafeMath for uint256;
    using AddressUtils for address;
    address payable MarketPlaceOwner;
    
    constructor () public {
        MarketPlaceOwner = msg.sender;
    }
    
    /**
    * @dev Guarantees msg.sender is owner of the Marketplace
    */
    modifier isOwner() {
        require(MarketPlaceOwner == msg.sender);
        _;
    }
    
    /**
    * @dev Creates a new order
    * @param nftAddress - Non fungible registry address
    * @param assetId - ID of the published NFT
    * @param priceInWei - Price in Wei for the supported coin
    */
    // msg.value - Publication Fee In Wei
    
    function convertToPremium(
        address nftAddress,
        uint256 assetId,
        uint256 priceInWei
    )
    public payable
    {
        require(nftAddress.isContract(), "The NFT Address should be a contract");
        
        address sender = msg.sender;
        address assetOwner = NFT(nftAddress).ownerOf(assetId);

        require(sender == assetOwner, "Only the owner can create orders");
        require(priceInWei > 0, "Price should be bigger than 0");
        
        nftCounter = nftCounter.add(1);
        premiumNFT[nftCounter] = (assetId);

        bytes32 orderId = keccak256(
            abi.encodePacked(
                block.timestamp,
                assetOwner,
                assetId,
                nftAddress,
                priceInWei
            )
        );

        orderByAssetId[nftAddress][assetId] = Order({
            id: orderId,
            seller: address(uint160(assetOwner)),
            nftAddress: nftAddress,
            price: priceInWei
        });
        
        emit OrderCreated(
            orderId,
            assetId,
            assetOwner,
            nftAddress,
            priceInWei
        );
    }
  
    
    /**
    * @dev Executes the sale for a published NFT
    * @param nftAddress - Address of the NFT registry
    * @param assetId - ID of the published NFT
    */
    //msg.value - price
    function addPremiumNFT(
        address nftAddress,
        uint256 assetId
    )
       public payable
      {
    
        address payable sender = msg.sender;
    
        Order memory order = orderByAssetId[nftAddress][assetId];
    
        require(order.id != 0, "Asset not published");
    
        address payable seller = order.seller;
    
        require(seller != address(0), "Invalid address");
        require(seller != sender, "Unauthorized user");
        require(order.price == msg.value, "The price is not correct");
        require(seller == NFT(nftAddress).ownerOf(assetId), "The seller is no longer the owner");
        
        bytes32 orderId = order.id;
        
        // Transfer sale amount to seller
        seller.transfer(msg.value);
        
        // Approve User
        approvalList[assetId].push(msg.sender);
    
        emit OrderSuccessful(
          orderId,
          assetId,
          seller,
          nftAddress,
          msg.value,
          sender
        );
    
      }  
}
