import {error} from "next/dist/build/output/log";

const abi = require('/public/abi.json')
const contractApi = {};

if (typeof window !== "undefined" && window.web3.eth) {
  const homejab = new window.web3.eth.Contract(
    abi,
    '0x35702cC56EBBbd0023F25d3560E1BCBB4A60cA2d');

  /**
   * @param {uint256} royalties
   * @return {uint256}
   */
  contractApi.mint = async (royalties, walletAddress) => {
    return new Promise((resolve, reject) => {
      homejab.methods.mint(royalties).send({ from: walletAddress })
        //actual tokenID located inside receipt object
        .once('confirmation', (confirmation, receipt) => {
          console.log(receipt)
          homejab.methods.mint(royalties).call({ from: walletAddress })
            .then(tokenID => {

              resolve(`${+tokenID - 1}`)
            })
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.buy = (tokenID, walletAddress) => {
    return new Promise((resolve, reject) => {
      homejab.methods.buy(tokenID).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          console.log(confirmation, receipt)
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }
// price in wei
  contractApi.listForSell = (tokenID, price, walletAddress) => {
    //return new Promise((resolve, reject) => {
      homejab.methods.listForSell(12, 1000000000000000).call({ from: walletAddress })
        .then(result => {

        })
        .catch(error => {
          console.log(error)
        })
    //})
  }

  contractApi.balanceOf = async (address) => {
    return await homejab.methods.balanceOf(address).call()
  }
}

module.exports = contractApi

