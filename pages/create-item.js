import NFTmarket from "./ABIS/nftMarket.json";
import {  ethers } from "ethers";
import Web3Modal from "web3modal";
//import { useState } from "react";
import { Formik, Field, Form, useFormik,useFormikContext } from 'formik';
import { nftAddress,nftMarketAddress } from "../config";

export default function AboutPage() {
  const formik = useFormik({
    initialValues: {
      price: '',
      tokenID: '',
    },
    onSubmit: async () => {

      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftMarketAddress, NFTmarket.output.abi, signer);
      const gas_limit = '300000';
      
      //const tokenID = '3'
      const price = ethers.utils.parseEther(formik.values.price)
      const transaction = await contract.createMarketItem(
          nftAddress,
          formik.values.tokenID,
          price,
          {gasLimit: gas_limit}
          );
      await transaction.wait();
  }
  });
  
    //const sellInit = 
 

return( 
  <form  >
 
    <label htmlFor="price">Price</label>

     <input

      id="price"

      name="price"

      type="text"

      onChange={formik.handleChange}

      value={formik.values.price}

    />

    <label htmlFor="tokenID">token ID</label>

      <input

        id="tokenID"

         name="tokenID"

          type="number"

           onChange={formik.handleChange}

           value={formik.values.tokenID}
      />

    <button type="button" onClick={formik.handleSubmit}>Submit</button>
  </form >
);
}


