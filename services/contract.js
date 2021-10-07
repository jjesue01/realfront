const abi = require('/public/abi.json')
const busd = require('/public/busd.json')

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
    const tokenID = await homejab.methods.mint(royalties).call({ from: walletAddress });
    return tokenID;
  }


  contractApi.balanceOf = async (address) => {
    return await homejab.methods.balanceOf(address).call()
  }
}

module.exports = contractApi

