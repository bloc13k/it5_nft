import NFTmarket from "./ABIS/nftMarket.json";
import { BigNumber, ethers } from "ethers";
import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import NFT from "./ABIS/nft.json";
import axios from "axios";
import { nftAddress, nftMarketAddress } from "../config";
import { render } from "react-dom";

export default function AboutPage() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded')
    
    useEffect(() => {
      setNfts()
    }, [])
    const fetchInit = async () => {

    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, NFTmarket.output.abi, signer);
    const contract2 = new ethers.Contract(nftAddress, NFT.output.abi, provider);

    const gas_limit = '3000000';
    const data = await contract.getMyNFTs({gasLimit: gas_limit})
    console.log(data);
    const items = await Promise.all(
      data.map( async i => {
          const tokenURI = await contract2.tokenURI(i.tokenId);
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
    setLoadingState('loaded') 
}
return (
    <div className="container mx-auto mt-28">
       <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={fetchInit}
              >
                  Fetch my NFTs
              </button>
      <h1 className="text-4xl font-semibold text-center ">
        My <span className="text-primary">NTFs</span>
      </h1>
  <table className="table table-bordered">
  <tr>
      <th>name</th>
      <th>tokenId</th>
      <th>image</th>
      <th>price</th>
  
  </tr>
  
  { nfts && nfts.length > 0 ? (
  nfts.map((nft, index) => (
  
    <tr data-index={index}>
        <td>{nft.name}</td>
        <td>{nft.tokenId}</td>
        <td>{nft.image}</td>
        <td>{nft.price} IT5</td>
      </tr>
      )
      )
      ) : (<div>You don&apos;t have a NFT yet</div>)
    }
    </table>
    </div>
  );
}

