import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftAddress, nftMarketAddress } from "../config";
//import ABIs
import NFT from "./ABIS/nft.json";
import Market from "./ABIS/nftMarket.json";
import erc20Abi from './ABIS/erc20.json'

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [buyInfo, setBuyInfo] = useState({
    tokenId: ''
  });

  const handleBuy = (event) => {
    //add
    setBuyInfo((prevalue) => {
      return {
          ...prevalue,
          [event.target.name]: event.target.value
      }      
  })
};

  useEffect(() => {
    setNfts()
  }, []);

  const it5 = '0x83162b5f83535e927cc02efC3Fb57065c7f5a98C';

  const allowance = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const token0contract = new ethers.Contract(it5, erc20Abi.output.abi, signer);
     await token0contract.approve(nftMarketAddress,ethers.utils.parseUnits('10000' ,18))
  }

  const fetchInit = async () =>  {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.output.abi, signer);

    const gas_limit = '300000';
    const data = await contract.getAllMarketItems({gasLimit: gas_limit});
    console.log(data);
    console.log(data);
    const items = await Promise.all(
      data.map( async i => {
          //
          const meta = await axios.get('https://ipfs.io/ipfs/QmaZzkkvffczJmbB6h3Dd5Ui7LUQDZyNM3Xw26MppjE4HF?filename=uri.json');
          //let price = ethers.utils.formatEther(BigNumber.toString(i.price) );
          // nft
          let item = {
            price : ethers.utils.formatEther(i.price),
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
    setNfts(items);
    setLoadingState('loaded') ;
};

    const buyNft =  async (nft) => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, Market.output.abi, signer)
    const gas_limit = '300000';
    const transaction = await contract.createMarketSale(
      nftAddress,
      buyInfo.tokenId,
    {
      gasLimit : gas_limit
    });
    await transaction.wait()
    fetchInit()
  }


  //if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="container mx-auto mt-28">
       <button
                  className="w-full bg-yellow-300 text-white font-bold py-2 px-12 rounded"
                  onClick={allowance}
              >
                  please approve your IT5 tokens for marketplace
              </button>


        <button
                  className="w-full bg-pink-300 text-white font-bold py-2 px-12 rounded"
                  onClick={fetchInit}
              >
                  Fetch market Items
              </button>
      <h1 className="text-4xl font-semibold text-center ">
        Market <span className="text-primary">Items</span>
      </h1>
  <table className="table table-bordered">
  <tr>
      <th>name</th>
      <th>tokenId</th>
      <th>price</th>
  </tr>
  
  { nfts && nfts.length > 0 ? (
  nfts.map((nft, index) => (
    
    <tr key={nft} data-index={index}>
        <td>{nft.name}</td>
        <td>{nft.tokenId}</td>
        <td>{nft.price} IT5</td>
        </tr>
      )
      )
      ) : (<div>Market don&apos;t have NFT yet</div>)
    }
    </table>
    <form>
    <input
    className="bg-gray-300 text-white font-bold py-2 px-12 rounded"
    id="tokenId"
    placeholder="Enter token ID"
    name="tokenId"

    type="text"

    onChange={handleBuy}

    value={buyInfo.tokenId}

/>

      <button  type="button"  className="bg-blue-300 text-white font-bold py-2 px-12 rounded"
          onClick={buyNft}>Buy IT5 NFT</button>
    </form>
    </div>
  );
}

