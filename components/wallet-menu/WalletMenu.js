import React, { useEffect } from "react";
import styles from './WalletMenu.module.sass'
import cn from "classnames";
import Link from "next/link";
import WalletIcon from '/public/icons/wallet.svg'
import CopyIcon from '/public/icons/copy.svg'
import Typography from "../Typography";
import Button from "../button/Button";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";

function WalletMenu({ opened, onLogOut, onClose, user }) {
  const router = useRouter()

  function handleLogout() {
    onLogOut()
    onClose()
  }

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
              { user.walletAddress.slice(0, 11) }...{ user.walletAddress.slice(-4) }
            </Typography>
            <button className={styles.btnCopy}>
              <CopyIcon />
            </button>
          </div>
          <div className={styles.totalBalance}>
            <Typography fontSize={17} lHeight={21} color={'rgba(0, 0, 0, 0.5)'}>
              Total Balance
            </Typography>
            <button className={styles.btnRefresh}>
              Refresh
            </button>
          </div>
          <Typography
            fontWeight={600}
            fontSize={28}
            lHeight={34}
            color={'#111'}
            margin={'17px 0 0'}>
            $0.00 USD
          </Typography>
          <Button className={styles.btnAddFunds}>
            Add Funds
          </Button>
          <ul className={styles.links}>
            <li>
              <Link href="/profile">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/collections">
                My Collections
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