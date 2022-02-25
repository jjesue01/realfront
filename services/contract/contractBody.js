import {store} from "../../store";
import {pushToast} from "../../features/toasts/toastsSlice";
import {isAllOf} from "@reduxjs/toolkit";

const { dispatch } = store

export default function createContract(homejab, BUSD, HOMEJAB_ADDRESS, weiUnit = 'ether') {
  const contractApi = {};
  if (!window?.ethereum)
    return contractApi

  contractApi.mintAndList = (royalties, price, endTime, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)


      homejab.methods.mintAndList(royalties, weiPrice, endTime).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          console.log(receipt)
          const tokenID = receipt.events['Minted'].returnValues._id
          resolve(tokenID)
        })
        .on('error', (error) => {
          let message = 'Error while executing mintAndList'
          console.log(error)
          if (error?.code === 4001)
            message = 'User cancelled mint and list processes'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.listForSell = (tokenID, price, walletAddress) => {
    return new Promise(async (resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)
      homejab.methods.listForSell(tokenID, weiPrice).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          let message = 'Error while executing listForSell'

          if (error?.code === 4001)
            message = 'User cancelled list for sell process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.listForAuction = (tokenID, price, endTime, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)
      homejab.methods.listForEnglishAuction(tokenID, weiPrice, endTime).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          let message = 'Error while executing listForAuction'

          if (error?.code === 4001)
            message = 'User cancelled list for auction process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.acceptBid = (tokenID, bidIndex, walletAddress) => {
    return new Promise((resolve, reject) => {
      homejab.methods.acceptBid(tokenID, bidIndex).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          console.log(receipt)
          if (receipt?.events?.Bought)
            resolve(receipt)
          else {
            dispatch(pushToast({ type: 'error', message: 'Error while executing acceptBid' }))
            reject('Something went wrong')
          }
        })
        .on('error', (error) => {
          let message = 'Error while executing acceptBid'

          if (error?.code === 4001)
            message = 'User cancelled finish auction process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.bidOnAuction = (tokenID, bidPrice, walletAddress) => {
    return new Promise(async (resolve, reject) => {
      const allowance = await contractApi.allowance(walletAddress)
      const hasAllowance = allowance > 0

      contractApi[hasAllowance ? 'increaseAllowance' : 'approve'](bidPrice + 1, walletAddress)
        .then(() => {
          const weiPrice = window.web3App.utils.toWei(bidPrice.toString(), weiUnit)
          homejab.methods.bidOnAuction(tokenID, weiPrice).send({ from: walletAddress })
            .once('confirmation', (confirmation, receipt) => {
              if (receipt.events['BidUpdate'] !== undefined) {
                resolve()
                console.log('bidOnAuction')
              } else {
                dispatch(pushToast({ type: 'error', message: 'Error while executing bidOnAuction' }))
                reject()
                console.log('error')
              }
            })
            .on('error', error => {
              let message = 'Error while executing bidOnAuction'

              if (error?.code === 4001)
                message = 'User cancelled bid on auction process'

              dispatch(pushToast({ type: 'error', message }))
              reject(error)
            })
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
          else {
            dispatch(pushToast({ type: 'error', message: 'Error while executing revokeSell' }))
            reject('Something went wrong')
          }
        })
        .on('error', (error) => {
          let message = 'Error while executing revokeSell'

          if (error?.code === 4001)
            message = 'User cancelled revoke sell process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.revokeBid = (tokenID, bidIndex, walletAddress) => {
    return new Promise((resolve, reject) => {
      homejab.methods.revokeBid(tokenID, bidIndex).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          console.log(receipt)
          if (receipt?.events?.BidUpdate)
            resolve(receipt)
          else {
            dispatch(pushToast({ type: 'error', message: 'Error while executing revokeBid' }))
            reject('Something went wrong')
          }
        })
        .on('error', (error) => {
          let message = 'Error while executing revokeBid'

          if (error?.code === 4001)
            message = 'User cancelled revoke bid process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.getSellData = (tokenID, walletAddress) => {
    return homejab.methods.sellData(tokenID).call({ from: walletAddress })
  }

  contractApi.editPrice = (tokenID, price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)
      homejab.methods.editPrice(tokenID, weiPrice).send({ from: walletAddress })
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          let message = 'Error while executing editPrice'

          if (error?.code === 4001)
            message = 'User cancelled edit price process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.approve = (price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)
      BUSD.methods.approve(HOMEJAB_ADDRESS, weiPrice).send({from: walletAddress})
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          let message = 'Error while approving amount'

          if (error?.code === 4001)
            message = 'User cancelled approve amount process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.disapprove = (walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei('0')
      BUSD.methods.approve(walletAddress, weiPrice).send({from: walletAddress})
        .once('confirmation', (confirmation, receipt) => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  }

  contractApi.increaseAllowance = (price, walletAddress) => {
    return new Promise((resolve, reject) => {
      const weiPrice = window.web3App.utils.toWei(price.toString(), weiUnit)
      BUSD.methods.increaseAllowance(HOMEJAB_ADDRESS, weiPrice).send({from: walletAddress})
        .once('confirmation', (confirmation, receipt) => {
          console.log('increaseAllowance')
          resolve()
        })
        .on('error', (error) => {
          let message = 'Error while increasing allowance'

          if (error?.code === 4001)
            message = 'User cancelled increase allowance process'

          dispatch(pushToast({ type: 'error', message }))
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
            dispatch(pushToast({ type: 'error', message: 'Error while executing buy' }))
            reject()
            console.log('error')
          }
        })
        .on('error', error => {
          let message = 'Error while executing buy'

          if (error?.code === 4001)
            message = 'User cancelled buy process'

          dispatch(pushToast({ type: 'error', message }))
          reject(error)
        })
    })
  }

  contractApi.getMarketplaceFee = async () => {
    return homejab.methods.marketplaceFee().call()
  }

  contractApi.balanceOf = async (address) => {
    try {
      const weiBalance = await BUSD.methods.balanceOf(address).call()
      return window.web3App.utils.fromWei(weiBalance, weiUnit)
    } catch (error) {
      const message = `Error while getting user's balance`
      dispatch(pushToast({ type: 'error', message }))
      return 0
    }
  }

  contractApi.allowance = async (address) => {
    try {
      const weiAllowance = await BUSD.methods.allowance(address, HOMEJAB_ADDRESS).call()
      return window.web3App.utils.fromWei(weiAllowance, weiUnit)
    } catch (error) {
      const message = `Error while getting allowance balance`
      dispatch(pushToast({ type: 'error', message }))
      return 0
    }
  }

  return contractApi
}

