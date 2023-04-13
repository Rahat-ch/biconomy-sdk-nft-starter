import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import SmartAccount from "@biconomy/smart-account";

interface Props {
    smartAccount: SmartAccount
    provider: any
    acct: any
  }

const Minter:React.FC<Props> = ({ smartAccount, provider, acct}) => {
    const [nftContract, setNFTContract] = useState<any>(null)
    const [nftCount, setNFTCount] = useState<number>(0);
    const nftAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

    useEffect(() => {
        getNFTCount()
    },[])

    const getNFTCount= async() => {
        const contract = new ethers.Contract(
            nftAddress,
            abi,
            provider,
          )
        setNFTContract(contract)
        const count = await contract.balanceOf(smartAccount.address)
        setNFTCount(count.toNumber());
    }

    const mintNFT = async () => {
        try {
            const mintTx = await nftContract.populateTransaction.mint()
            const tx1 = {
            to: nftAddress,
            data: mintTx.data,
            }
            const txResponse = await smartAccount.sendTransaction({ transaction: tx1})

            const txHash = await txResponse.wait();
            console.log({txHash})
            console.log({txResponse})
            getNFTCount()
        } catch (error) {
            console.log(error)
        }
    }

    const mintMultipleNFT = async () => {
        try {
            const mintTx = await nftContract.populateTransaction.mint()
            const tx1 = {
            to: nftAddress,
            data: mintTx.data,
            }
            const tx2 = {
                to: nftAddress,
                data: mintTx.data,
                }
            const txResponse = await smartAccount.sendTransactionBatch({ transactions: [tx1, tx2]})

            const txHash = await txResponse.wait();
            console.log({txHash})
            console.log({txResponse})
            getNFTCount()
        } catch (error) {
            console.log(error)
        }
    }

    const nftURL = `https://testnets.opensea.io/${smartAccount.address}`

    return(
        <div>
            <button onClick={() => mintNFT()}>Mint One</button>
            <button onClick={() => mintMultipleNFT()}>Mint Two</button>
            {nftCount ? (<p>You own {nftCount} tickets </p>): null}
            {nftCount ? (<p>View your NFTs <a href={nftURL} target="_blank">here</a> </p>): null}
        </div>
    )
};

export default Minter;

