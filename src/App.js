
import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/MyNFT.json';
import { ethers } from 'ethers';
const contractAddress = "0xb54d8Aef20Fe73A289744dAeEc13D4B9E5fc16FC";
const abi = contract.abi;

function App() {

 
 const [currentAccount, setCurrentAccount] = useState(null);
 const checkWalletIsConnected =()=>{

 }

 const connectWalletHandler = async()=>{
    const {ethereum} = window;
    if(!ethereum) alert("Please install Metamask!");

    try {
      const accounts = await ethereum.request({method:"eth_requestAccounts"});
      console.log('all accounts',accounts)
      console.log("Found an account, Address is ",accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch(err) {
      console.log(err)
    }
 }

 const mintNFTHandler= async()=>{
   try {
     const {ethereum} = window;
     if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer  = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress,abi,signer);
      console.log('Intinial Payment');
      let nftTxn =await nftContract.mintNFTs(1,{value:ethers.utils.parseEther("0.01")});
     
      console.log('Minning ... please wait');
      await nftTxn.wait();
      const tokenCount = await nftContract.tokensOfOwner(currentAccount);

      console.log('TOKEN COUNT',tokenCount);
      console.log('Please see transaction at link'+`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
     }else {
       console.log('Ethereum object not exit')
     }
   } catch (error) {
     console.log(error);
   }
 }
 const connectWalletButton =()=>{
   return (
     <button onClick={connectWalletHandler} className="cta-button connect-wallet-button">
           Connect Wallet
     </button>
   )
 }
 const mintNftButton=()=>{
  return (
    <button onClick={mintNFTHandler} className='cta-button mint-nft-button'>
      Mint NFT
    </button>
  )
 }
 useEffect(()=>{
  checkWalletIsConnected();
 },[])

  return (
    <div className='main-app'>
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        {!currentAccount? connectWalletButton():mintNftButton()}
      </div>
    </div>
  )
}

export default App;