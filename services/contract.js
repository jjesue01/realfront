const abi = require('/public/abi.json')
const busd = require('/public/busd.json')
const contractApi = {};

if (typeof window !== "undefined" && window?.web3App) {
  const homejab = new window.web3App.eth.Contract(
    abi,
    '0x35702cC56EBBbd0023F25d3560E1BCBB4A60cA2d');
  const dummyBUSD = new window.web3App.eth.Contract(
    busd,
    '0xDf1AE3eCFF4E32431e9010B04c36E901f7ED388b');

  contractApi.mintAndList = (royalties, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())

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

  contractApi.listForSell = (tokenID, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())
      homejab.methods.listForSell(tokenID, weiPrice).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.revokeSell = (tokenID, walletAddress) => {
    return new Promise((resolve, reject) => {
      homejab.methods.revokeSell(tokenID).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          if (receipt?.events?.Delisted)
            resolve(receipt)
          else
            reject('Something went wrong')
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.getSellData = (tokenID, walletAddress) => {
    return homejab.methods.sellData(tokenID).call({ from: walletAddress })
  }

  contractApi.editPrice = (tokenID, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())
      homejab.methods.editPrice(tokenID, weiPrice).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.buy = (tokenID, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())
      dummyBUSD.methods.approve('0x35702cC56EBBbd0023F25d3560E1BCBB4A60cA2d', weiPrice).send({from: walletAddress})
        .once('confirmation', () => {
          homejab.methods.buy(tokenID).send({ from: walletAddress })
            .once('confirmation', (confirmation, receipt) => {
              if (receipt.events['Bought'] !== undefined) {
                resolve(receipt)
                console.log('bought')
              } else {
                reject()
                console.log('error')
              }
            })
            .on('error', (error) => {
              reject(error)
            })
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.balanceOf = async (address) => {
    const weiBalance = await dummyBUSD.methods.balanceOf(address).call()
    return window.web3App.utils.fromWei(weiBalance)
  }
}

module.exports = contractApi

