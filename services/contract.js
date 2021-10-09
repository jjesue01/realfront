import {error} from "next/dist/build/output/log";

const abi = require('/public/abi.json')
const contractApi = {};

if (typeof window !== "undefined" && window.web3.eth) {
  const homejab = new window.web3.eth.Contract(
    abi,
    '0x35702cC56EBBbd0023F25d3560E1BCBB4A60cA2d');

  contractApi.mintAndList = (royalties, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3.utils.toWei(price.toString())

      homejab.methods.mintAndList(royalties, weiPrice).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          const tokenID = receipt.events['Minted'].returnValues._id
          resolve(tokenID)
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }
//test buy http://localhost:3000/photos/6161795de854b7346b6f4917
  contractApi.buy = (tokenID, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3.utils.toWei(price.toString())

      homejab.methods.buy(tokenID).send({ from: walletAddress, value: weiPrice })
        .once('confirmation', (confirmation, receipt) => {
          console.log(confirmation, receipt)
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.balanceOf = async (address) => {
    return await homejab.methods.balanceOf(address).call()
  }
}

module.exports = contractApi

