import React from 'react'
import styles from './ConnectWallet.module.sass'
import Web3 from 'web3'
import Image from "next/image";
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";

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
      <div onClick={handleLoginMetaMask} className={styles.iconContainer}>
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
      window.web3 = new Web3(window.ethereum);

      onLogin({
        walletId: accounts[0]
      })

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
        </Typography>
        <div className={styles.wallets}>
          { walletsList }
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConnectWallet