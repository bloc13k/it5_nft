import NFT from "./ABIS/nft.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftAddress } from "../config";


export default function AboutPage() {



    const mintInit = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, NFT.output.abi, signer);
    const gas_limit = '3000000';
    const uri = '{"name": "IT5", "description": "IT5 Item", "image": "https://ipfs.io/ipfs/QmPCPxiuRf83kC5gugywcv9iZmW1JzAhzNZK4m8R7yvknZ?filename=it5.jpg"}'
    const tx = await contract.mintToken(
        uri,
        {
            gasLimit: gas_limit
        }
    )
    await tx.wait();
}
    return(
 <button
                className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                onClick={mintInit}
            >
                Mint default IT5 NFT
            </button>
    )
  }