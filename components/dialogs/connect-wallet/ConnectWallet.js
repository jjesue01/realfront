import React from 'react'
import styles from './ConnectWallet.module.sass'
import Web3 from 'web3'
import Image from "next/image";
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import {getConfig} from "../../../app-config";
import {switchNetwork} from "../../../utils";

const wallets = [
  {
    iconUrl: '/icons/wallets/metamask.svg',
    iconWidth: 22,
    iconHeight: 23,
    name: 'MetaMask'
  }
]

function ConnectWallet({ opened, onClose, onLogin }) {

  const walletsList = wallets.map(({ name, ...icon }) => (
    <div onClick={handleLoginMetaMask} key={name} className={styles.wallet}>
      <div className={styles.iconContainer}>
        <Image
          src={icon.iconUrl}
          width={icon.iconWidth}
          height={icon.iconHeight}
          alt={name} />
      </div>
      <Typography fontSize={20} fontWeight={600} color={'#000'}>
        { name }
      </Typography>
    </div>
  ))

  async function handleLoginMetaMask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3App = new Web3(window.ethereum);

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const AVAILABLE_CHAINS = [
        getConfig().BSC_NETWORK.chainId,
        getConfig().POLYGON_NETWORK.chainId
      ]

      if (AVAILABLE_CHAINS.includes(chainId)) {
        onLogin({
          walletId: accounts[0]
        })
      } else {
        switchNetwork('binance_smart_chain')
          .then(mode => {
            onLogin({
              walletId: accounts[0]
            })
          })
      }

      return true;
    }
    alert('You have to install MetaMask')
    return false;
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography fontSize={24} fontWeight={600} color={'#111'} lHeight={29} align="center">
          Connect your wallet
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={14}
          lHeight={22}
          color={'rgba(55, 65, 81, 0.8)'}
          align="center"
          margin={'20px auto 32px'}
          maxWidth={427}>
          A crypto wallet is an application or hardware that allows individuals to store and retrieve digital items. MetaMask is one of the most popular wallets, existing as both a mobile app and a browser extension. Please connect with our wallet provider listed below.
        </Typography>
        <div className={styles.wallets}>
          { walletsList }
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConnectWallet