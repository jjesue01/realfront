import React, {useCallback, useEffect, useRef, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.sass'
import Button from "./button/Button";
import Typography from "./Typography";
import cn from "classnames";
import NavLink from "./nav-link/NavLink";
import WalletIcon from '/public/icons/wallet.svg'
import WalletMenu from "./wallet-menu/WalletMenu";
import ConnectWallet from "./dialogs/connect-wallet/ConnectWallet";
import {useRouter} from "next/router";
import {useLoginMutation} from "../services/auth";
import {useDispatch, useSelector} from "react-redux";
import {logout, setCredentials} from "../features/auth/authSlice";
import AddFunds from "./dialogs/add-funds/AddFunds";
import DepositFromExchange from "./dialogs/deposit-from-exchange/DepositFromExchnage";
import BuyWithCard from "./dialogs/buy-with-card/BuyWithCard";
import Web3 from "web3";
import {isPrivateRoute, isTokenExpired} from "../utils";
import {initSocket} from "../services/socket";
import Notifications from "./notifications/Notifications";
import {pushNotification} from "../features/notifications/notificationsSlice";
import {useGetUserCollectionsQuery} from "../services/collections";

const marketplaceLinks = [
  {
    name: 'New York, NY',
    link: '/'
  },
  {
    name: 'Los Angeles, CA',
    link: '/'
  },
  {
    name: 'Chicago, IL',
    link: '/'
  },
  {
    name: 'Houston, TX',
    link: '/'
  },
  {
    name: 'Phoenix, AZ',
    link: '/'
  },
  {
    name: 'Philadelphia, PA',
    link: '/'
  },
]

const accountLinks = [
  {
    name: 'My Profile',
    link: '/profile'
  },
  {
    name: 'My Collections',
    link: '/collections'
  },
  {
    name: 'My Favorites',
    link: '/profile?tab=favorited'
  },
  {
    name: 'My Account Settings',
    link: '/settings'
  },
]

const companyLinks = [
  {
    name: 'About',
    link: '/about'
  }
]

function Layout({ children }) {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [login, { isLoading }] = useLoginMutation()
  const { data: marketplaceLinks = [] } = useGetUserCollectionsQuery({ parent: true, limit: 6 })
  const router = useRouter()
  const [walletOpened, setWalletOpened] = useState(false)
  const [addFundsOpened, setAddFundsOpened] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [buyOpened, setBuyOpened] = useState(false)
  const [connectOpened, setConnectOpened] = useState(false)
  const [showFooter, setShowFooter] = useState(true)

  function togglePopup() {
    setConnectOpened(prevState => !prevState)
  }

  function toggleWallet() {
    setWalletOpened(prevState => !prevState)
  }

  function toggleFooter() {
    setShowFooter(prevState => !prevState)
  }

  function handleLogin({ walletId }) {
    togglePopup()
    login(walletId).unwrap()
      .then(({ token, user }) => {
        const credentials = { user, token }

        dispatch(setCredentials(credentials))
      })
  }

  function handleLogout() {
    dispatch(logout())
    if (isPrivateRoute(router.pathname))
      router.push('/')
  }

  function handleCreate() {
    auth.token ? router.push('/photos/create') : togglePopup()
  }

  function toggleAddFunds() {
    setAddFundsOpened(prevState => !prevState)
  }

  function toggleDeposit() {
    toggleAddFunds()
    setDepositOpened(prevState => !prevState)
  }

  function toggleBuy() {
    toggleAddFunds()
    setBuyOpened(prevState => !prevState)
  }

  const handleNotifications = useCallback((evenName, data) => {
    switch (evenName) {
      case 'priceChange':
      case 'successfulPurchase':
      case 'itemSold': {
        dispatch(pushNotification({
          id: Date.now(),
          event: evenName,
          ...data
        }))
        break;
      }
      default:
        break;
    }
  }, [dispatch])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (router.pathname !== url && router.pathname === '/marketplace') {
        setShowFooter(true)
        document.body.style.position = 'static'
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  useEffect(function checkAuth() {
    //if (localStorage) {
      const auth = JSON.parse(localStorage.getItem('auth'))

      if (auth?.token) {
        if (isTokenExpired(auth.token)) {
          dispatch(logout())
          isPrivateRoute(router.pathname) && router.push('/')
          console.log('expired token')
          return;
        }
          if (window.ethereum) {
            if (!window?.web3App) {
              window.web3App = new Web3(window.ethereum);
            }
            window.web3App.eth.getAccounts().then(accounts => {
              if (accounts.length !== 0) {
                dispatch(setCredentials(auth))
              } else {
                isPrivateRoute(router.pathname) && router.push('/')
                dispatch(logout())
                console.log('no linked metamask account')
              }
            });
          } else {
            isPrivateRoute(router.pathname) && router.push('/')
            dispatch(logout())
            console.log('no metamask installed')
          }

      } else if (isPrivateRoute(router.pathname)) {
        router.push('/')
        console.log('no localStorage token')
      }
    //}
  }, [dispatch, router])

  useEffect(function checkNotifications() {
    if (auth.token && !window.socket) {
      window.socket = initSocket({
        token: auth.token,
        onEvent: handleNotifications
      })
      console.log('mount')
    }
  }, [auth, dispatch, handleNotifications])

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.wideContainer}>
          <Link href="/" passHref>
            <a className={styles.homeLink}>
              <Image
                src="/logo.svg"
                width={94}
                height={16}
                alt="HOMEJAB logo" />
            </a>
          </Link>
          <div className={styles.content}>
            <ul className={styles.links}>
              <li>
                <NavLink href="/about">About</NavLink>
              </li>
              <li>
                <NavLink href="/marketplace">Marketplace</NavLink>
              </li>
              <li>
                <NavLink href="/faq">FAQ</NavLink>
              </li>
            </ul>
            <div className={styles.actions}>
              <Button onClick={handleCreate} type="outlined">
                Create
              </Button>
              {
                auth.token ?
                  <button
                    onClick={toggleWallet}
                    className={cn(styles.btnCircle, { [styles.btnCircleActive]: walletOpened })}>
                    <WalletIcon />
                  </button>
                  :
                  <Button onClick={togglePopup} type="accent">
                    Connect Wallet
                  </Button>
              }
            </div>
          </div>
        </div>
      </header>
      {
        auth.token &&
        <>
          <WalletMenu
            user={auth.user}
            opened={walletOpened}
            onLogOut={handleLogout}
            onAddFunds={toggleAddFunds}
            onClose={toggleWallet} />
          <AddFunds
            opened={addFundsOpened}
            onExchange={toggleDeposit}
            onBuy={toggleBuy}
            onClose={toggleAddFunds} />
          <DepositFromExchange
            opened={depositOpened}
            onClose={toggleDeposit} />
          <BuyWithCard opened={buyOpened} onClose={toggleBuy} />
          <Notifications />
        </>
      }
      {
        React.cloneElement(children, { toggleFooter, openLogin: togglePopup })
      }
      <ConnectWallet
        opened={connectOpened}
        onClose={togglePopup}
        onLogin={handleLogin} />
      {
        showFooter &&
        <footer className={styles.footer}>
          <div className={styles.navContainer}>
            <div className={styles.wideContainer}>
              <div className={styles.navContent}>
                <div className={styles.navInfo}>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        src="/logo.svg"
                        width={94}
                        height={16}
                        alt="HOMEJAB logo" />
                    </a>
                  </Link>
                  <Typography
                    fontSize={12}
                    lHeight={24}
                    maxWidth={373}
                    margin="24px 0 0"
                    color={`rgba(55, 65, 81, 0.6)`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras. Sollicitudin nulla orci vitae ut turpis vitae neque.
                  </Typography>
                </div>
                <div className={styles.navLinks}>
                  <div className={cn(styles.navCol, styles.colMarketplace)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      Marketplace
                    </Typography>
                    <ul className={styles.list}>
                      {
                        marketplaceLinks.map(({ name, _id }) => (
                          <li key={name}>
                            <Link href={`/marketplace?city=${_id}`}>
                              { name }
                            </Link>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                  <div className={cn(styles.navCol, styles.colAccount)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      My account
                    </Typography>
                    <ul className={styles.list}>
                      {
                        accountLinks.map(({ name, link }) => (
                          <li key={name}>
                            <Link href={link}>
                              { name }
                            </Link>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                  <div className={cn(styles.navCol, styles.colCompany)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      Company
                    </Typography>
                    <ul className={styles.list}>
                      {
                        companyLinks.map(({ name, link }) => (
                          <li key={name}>
                            <Link href={link}>
                              { name }
                            </Link>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightsContainer}>
            <div className={styles.wideContainer}>
              <Typography fontSize={12} color="rgba(255, 255, 255, 0.5)">
                © {new Date().getFullYear()} Homejab.LCC. All rights reserved.
              </Typography>
              <div className={styles.terms}>
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      }
    </div>
  )
}

export default Layout