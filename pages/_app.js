import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';
import Web3 from 'web3';
//import { NFT721ATokenAddress } from '../config';

import contractABI from '../artifacts/contracts/NFT721AToken/NFT721AToken.json';
import { contractAddress } from '../config';
const { Buffer } = require('buffer');
function App() {
  const projectId = '';
  const projectSecret = '';
  const [message, setMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  const contractAddress = '';
  const contractABI = contractABI.abi;
  useEffect(() => {
    const init = async () => {
      try {
        // Check if the browser has Ethereum provider (MetaMask)
        if (typeof window.ethereum !== 'undefined') {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new Web3.providers.Web3Provider(connection);
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const ff = await contract.methods.showFruit();

          setMessage('TTTTTTT');
        } else {
          console.error('Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error reading message:', error);
      }
    };
    init();
  }, []);

  const { name, description, price } = formInput;
  if (!name || !description || !price || !fileUrl) return;

  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
  });
  try {
    const added = client.add(data);
    const url = `https://ankit-nft.infura-ipfs.io/ipfs/${added.path}`;
    console.log(url);
    createSale(url);
  } catch (error) {
    console.log('error uploading file:', error);
  }
  const MintPrice = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let whitelistAddresses = [
          '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
          '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
          '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        ];
        console.log(whitelistAddresses);
        const leafNodes = whitelistAddresses.map((addr) => ethers.utils.keccak256(addr));
        console.log(leafNodes);
        const merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });

        const connectedAddress1 = await signer.getAddress();
        console.log('Connected wallet address:', connectedAddress1);

        const hashofConnAdd = ethers.utils.keccak256(connectedAddress1);
        const hexProof = merkleTree.getHexProof(hashofConnAdd);
        console.log(hexProof);

        const rootHash = merkleTree.getRoot();
        var isWhiteList = merkleTree.verify(hexProof, hashofConnAdd, rootHash);
        const listPrice = 0;

        const nftMintContract = new ethers.Contract(contractAddress, contractABI, provider);
        if (isWhiteList == true) {
          listPrice = await nftMintContract.whiteListMintPrice();
        } else {
          listPrice = await nftMintContract.nonWhiteListMintPrice();
        }
        console.log('Verify ', merkleTree.verify(hexProof, hashofConnAdd, rootHash));
        console.log('Whitelist Merkle Tree\n', merkleTree.toString());
        console.log('Root Hash: ', rootHash);
        return listPrice;
      } else {
        console.error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error writing message:', error);
    }
  };
  async function CreateMarket() {
    const { description, price } = formInput;
    if (!description || !price || !fileUrl) return;

    const data = JSON.stringify({
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ankit-nft.infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      createSale(url);
    } catch (error) {
      console.log('error uploading file:', error);
    }
  }
  const mintNFT = async () => {};
  return (
    <div>
      <h1>Simple React DApp</h1>
      <p>Message: {message}</p>

      <textarea
        placeholder="NFT Description"
        className="mt-2 border rounded p-4"
        onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
      />

      <input
        placeholder="NFT price in ETH"
        className="mt-2 border rounded p-4"
        onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
      />

      <input type="file" name="asset" className="my-3" onChange={onChange} />

      {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}

      {fileUrl && <img width="350" src={fileUrl} />}
      <button onClick={CreateMarket}>Create NFT</button>
      <button onClick={MintPrice}>Mint NFT Cost</button>
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}

export default App;
