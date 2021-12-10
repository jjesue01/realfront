const abi = require('/public/abi.json')
const busd = require('/public/busd.json')
const contractApi = {};

const HOMEJAB_ADDRESS = '0x3730F29f0F569141d5C797aAF54827670102Fabe'
const DBUSD_ADDRESS = '0xDf1AE3eCFF4E32431e9010B04c36E901f7ED388b'

if (typeof window !== "undefined" && window?.web3App) {
  const homejab = new window.web3App.eth.Contract(
    abi,
    HOMEJAB_ADDRESS);
  const dummyBUSD = new window.web3App.eth.Contract(
    busd,
    DBUSD_ADDRESS);

  contractApi.mintAndList = (royalties, price, endTime, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())

      homejab.methods.mintAndList(royalties, weiPrice, endTime).send({ from: walletAddress })
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

  contractApi.listForAuction = (tokenID, price, endTime, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())
      homejab.methods.listForEnglishAuction(tokenID, weiPrice, endTime).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.bidOnAuction = (tokenID, bidPrice, walletAddress) => {
    return new Promise((resolve, reject) => {
      contractApi.approve(bidPrice + 1, walletAddress)
        .then(() => {
          const weiPrice = window.web3App.utils.toWei(bidPrice.toString())
          homejab.methods.bidOnAuction(tokenID, weiPrice).send({ from: walletAddress })
            .once('confirmation', (confirmation, receipt) => {
              if (receipt.events['BidSuccess'] !== undefined) {
                const bidIndex = receipt.events['BidSuccess'].returnValues._id
                resolve(bidIndex)
                console.log('bought')
              } else {
                reject()
                console.log('error')
              }
            })
            .on('error', reject)
        })
        .catch(reject)
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

  contractApi.approve = (price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString())
      dummyBUSD.methods.approve(HOMEJAB_ADDRESS, weiPrice).send({from: walletAddress})
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
      contractApi.approve(price, walletAddress)
        .then(() => {
          return contractApi.pureBuy(tokenID, walletAddress)
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  }

  contractApi.pureBuy = (tokenID, walletAddress) => {
    return new Promise((resolve, reject) => {
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
        .on('error', reject)
    })
  }

  contractApi.getMarketplaceFee = async () => {
    return homejab.methods.marketplaceFee().call()
  }

  contractApi.balanceOf = async (address) => {
    const weiBalance = await dummyBUSD.methods.balanceOf(address).call()
    return window.web3App.utils.fromWei(weiBalance)
  }
}

module.exports = contractApi

