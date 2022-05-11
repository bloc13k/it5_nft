const { expect } = require("chai");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    // get reference to the address the market was deployed at
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    //get ref to NFT contract
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    // create NFTs
    await nft.createToken("www.tokenlocation.com");
    await nft.createToken("www.tokenlocation2.com");

    // put NFTs in market for sale
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    // sell NFT to someone
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    // return unsold items
    const items = await market.fetchMarketItems();
    // async mapping to make output more user-friendly
    // items = await Promise.all(
    //   items.map(async (i) => {
    //     const tokenUri = await nft.tokenURI(i.tokenId);
    //     let item = {
    //       price: i.price.toString(),
    //       tokenId: i.tokenId.toString(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       tokenUri,
    //     };
    //     return item;
    //   })
    // );

    console.log("items: ", items);
  });
});
