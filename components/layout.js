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
import {authApi, useLoginMutation} from "../services/auth";
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
import {
  useGetAutocompleteCitiesQuery,
} from "../services/cities";
import Toasts from "./toasts/Toasts";
import {pushToast} from "../features/toasts/toastsSlice";
import {BINANCE_TESTNET} from "../fixtures";
import SignUp from "./dialogs/sign-up/SignUp";
import {getConfig} from "../app-config";

const accountLinks = [
  {
    name: 'My Profile',
    link: '/profile'
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
    name: 'Our Story',
    link: '/about'
  }
]

function Layout({ children }) {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [login, { isLoading }] = useLoginMutation()
  const { data: marketplaceLinks = [] } = useGetAutocompleteCitiesQuery({ search: '' })
  const router = useRouter()
  const [walletOpened, setWalletOpened] = useState(false)
  const [addFundsOpened, setAddFundsOpened] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [signUpOpened, setSignUpOpened] = useState(false)
  const [buyOpened, setBuyOpened] = useState(false)
  const [connectOpened, setConnectOpened] = useState(false)
  const [showFooter, setShowFooter] = useState(true)

  const tempWalletAddress = useRef(null)

  function togglePopup() {
    setConnectOpened(prevState => !prevState)
  }

  function toggleWallet() {
    setWalletOpened(prevState => !prevState)
  }

  function toggleFooter() {
    setShowFooter(prevState => !prevState)
  }

  function toggleSignUp() {
    setSignUpOpened(prevState => !prevState)
  }

  function handleCheckRegistration({ walletId }) {
    tempWalletAddress.current = walletId

    dispatch(authApi.endpoints.checkRegistration.initiate(walletId, { forceRefetch: true }))
      .then(async ({ isError, isSuccess }) => {
        if (isError) {
          console.log('needs sign up')
          togglePopup()
          toggleSignUp();
        }
        if (isSuccess) {
          handleLogin({})
        }
      })
  }

  async function handleLogin({ username, email }) {
    let data = {
      walletId: tempWalletAddress.current
    }
    const invite = router.query?.invite
    const verify = router.query?.verify

    if (invite) data.invite = invite
    if (verify) data.verify = verify
    if (email) {
      data.username = username
      data.email = email
    }


    await login(data).unwrap()
      .then(({ token, user }) => {
        const credentials = { user, token }
        setConnectOpened(false)
        dispatch(setCredentials(credentials))
        if (invite) router.push('/profile')
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

  function handleCloseDeposit() {
    setDepositOpened(false)
  }

  function toggleBuy() {
    toggleAddFunds()
    setBuyOpened(prevState => !prevState)
  }

  function handleRemoveContextMenu(e) {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'prod')
      e.preventDefault();
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
            window.web3App.eth.getAccounts().then(async (accounts) => {
              if (accounts.length !== 0) {
                // const chainId = await ethereum.request({ method: 'eth_chainId' });
                // if (chainId !== getConfig().ETHEREUM_NETWORK.chainId)
                //   dispatch(pushToast({ type: 'info', message: `Please switch to ${getConfig().ETHEREUM_NETWORK.chainName} network to use marketplace` }))
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

  useEffect(function initEvents() {
    if (window?.ethereum) {
      window.ethereum.on('accountsChanged', (changedAccounts) => {
        if (changedAccounts.length !== 0)
          handleCheckRegistration({ walletId: changedAccounts[0] })
      });
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        console.log('network changed')
        window.location.reload();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(function verifyInvite() {
    if (router.query?.invite || router.query?.verify) {
      setConnectOpened(true)
    }
  }, [router.query])

  return (
    <div onContextMenu={ handleRemoveContextMenu } className={styles.wrapper}>
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
                <NavLink href="/about">Our Story</NavLink>
              </li>
              <li>
                <NavLink href="/marketplace">Marketplace</NavLink>
              </li>
              <li>
                <NavLink href="/faq">FAQ</NavLink>
              </li>
            </ul>
            <div className={styles.actions}>
              {
                auth.user?.invited &&
                <Button onClick={handleCreate} type="outlined">
                  Create
                </Button>
              }
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
            onDone={handleCloseDeposit}
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
        onLogin={handleCheckRegistration} />
      <SignUp
        opened={signUpOpened}
        onSignUp={handleLogin}
        onClose={toggleSignUp} />
      <Toasts />
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
                    maxWidth={440}
                    margin="24px 0 0"
                    color={`rgba(55, 65, 81, 0.6)`}>
                    HomeJab is a marketplace where real estate photographers can showcase and promote their work, without fear of losing ownership of their efforts. Online image theft is rampant, especially in the real estate community. And, while it seems harmless on the surface, it’s actually quite damaging for the artist who creates the image. Photographers are forced to put their work out there with zero protections, at very little pay. The HomeJab NFT Marketplace is designed to protect the ownership of an artist’s digital portfolio, while rewarding them for their hard work.
                  </Typography>
                </div>
                <div className={styles.navLinks}>
                  <div className={cn(styles.navCol, styles.colMarketplace)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      Marketplace
                    </Typography>
                    <ul className={styles.list}>
                      {
                        marketplaceLinks.slice(0, 6).map(({ label, value }) => (
                          <li key={value}>
                            <Link href={`/marketplace?city=${value}`}>
                              { label }
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
                <Link href="/privacy" passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </Link>
                <Link href="/terms" passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
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