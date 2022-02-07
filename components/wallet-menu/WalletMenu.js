import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from './WalletMenu.module.sass'
import cn from "classnames";
import Link from "next/link";
import WalletIcon from '/public/icons/wallet.svg'
import Typography from "../Typography";
import Button from "../button/Button";
import {useRouter} from "next/router";
import ButtonCopy from "../button-copy/ButtonCopy";
import {getBlockchain, getMoneyView, getShortWalletAddress} from "../../utils";
import {POLYGON_CHAINS} from "../../fixtures";

function WalletMenu({ opened, onLogOut, onClose, user, onAddFunds }) {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const mounted = useRef(false)

  function handleLogout() {
    onLogOut()
    onClose()
  }

  const handleRefreshBalance = useCallback(async () => {
    const blockchain = await getBlockchain()
    const contractApi = require('/services/contract/index')[blockchain]

    contractApi.balanceOf(user.walletAddress)
      .then(balance => {
        setBalance(balance)
      })
  }, [user])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (router.pathname !== url && opened)
        onClose()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, onClose, opened])

  useEffect(function initBalance() {
    if (!mounted.current) {
      handleRefreshBalance()
      mounted.current = true
    }
  }, [handleRefreshBalance])

  return (
    <div className={cn(styles.walletWrapper, { [styles.opened]: opened })}>
      <div onClick={onClose} className={styles.closeLayer} />
      <div className={styles.wideContainer}>
        <div className={styles.root}>
          <div className={styles.titleContainer}>
            <div className={styles.iconContainer}>
              <WalletIcon />
            </div>
            <Typography fontSize={24} fontWeight={600} color={'#111'}>
              My wallet
            </Typography>
          </div>
          <div className={styles.walletId}>
            <Typography fontSize={20} color={'#111'}>
              { getShortWalletAddress(user.walletAddress) }
            </Typography>
            <ButtonCopy
              className={styles.btnCopy}
              value={user.walletAddress} />
          </div>
          <div className={styles.totalBalance}>
            <Typography fontSize={17} lHeight={21} color={'rgba(0, 0, 0, 0.5)'}>
              Total Balance
            </Typography>
            <button onClick={handleRefreshBalance} className={styles.btnRefresh}>
              Refresh
            </button>
          </div>
          <Typography
            fontWeight={600}
            fontSize={28}
            lHeight={34}
            color={'#111'}
            margin={'17px 0 0'}>
            {getMoneyView(balance)} USD
          </Typography>
          <Button onClick={onAddFunds} className={styles.btnAddFunds}>
            Add Funds
          </Button>
          <ul className={styles.links}>
            <li>
              <Link href="/profile">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/profile?tab=favorited">
                My Favorites
              </Link>
            </li>
            <li>
              <Link href="/settings">
                My Account Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WalletMenu