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
import Toasts from "./toasts/Toasts";
import SignUp from "./dialogs/sign-up/SignUp";
import useBreakpoint from "../hooks/useBreakpoint";
import MobileMenu from "./mobile-menu/MobileMenu";
import FacebookIcon from '/public/icons/fb.svg'
import InstagramIcon from '/public/icons/instagram.svg'
import TwitterIcon from '/public/icons/twitter.svg'
import YoutubeIcon from '/public/icons/youtube.svg'
import PinterestIcon from '/public/icons/pinterest.svg'

const companyLinks = [
  {
    name: 'Our Story',
    link: '/about'
  },
  {
    name: 'Newsroom',
    link: 'https://homejab.com/newsroom/',
    newTab: true
  },
  {
    name: 'Become a Creator',
    link: 'https://homejab.com/real-estate-photographer-jobs/',
    newTab: true
  }
]

function Layout({ children }) {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const [walletOpened, setWalletOpened] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const [addFundsOpened, setAddFundsOpened] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [signUpOpened, setSignUpOpened] = useState(false)
  const [buyOpened, setBuyOpened] = useState(false)
  const [connectOpened, setConnectOpened] = useState(false)
  const [showFooter, setShowFooter] = useState(true)

  const tempWalletAddress = useRef(null)

  const isMobile = useBreakpoint(850)

  function togglePopup() {
    setConnectOpened(prevState => !prevState)
  }

  function toggleWallet() {
    setWalletOpened(prevState => !prevState)
  }

  function toggleMenu() {
    setMenuOpened(prevState => !prevState)
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
        if (invite) router.push(`/profile/${auth.user.username}`)
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

  function handleOrderNFT() {
    router.push('/order-nft')
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
                width={67}
                height={25}
                alt="HOMEJAB logo" />
            </a>
          </Link>
          {
            !isMobile ?
            <div className={styles.content}>
              <ul className={styles.links}>
                <li>
                  <NavLink href="/about">Our Story</NavLink>
                </li>
                <li>
                  <NavLink href="/marketplace">Marketplace</NavLink>
                </li>
                <li>
                  <NavLink href="/why-buy">Why Buy?</NavLink>
                </li>
                <li>
                  <NavLink href="/faq">FAQ</NavLink>
                </li>
                <li>
                  <NavLink href="/leaderboard">Leaderboard</NavLink>
                </li>
              </ul>
              <div className={styles.actions}>
                <Button onClick={handleOrderNFT} type="outlined">
                  Order Custom NFT
                </Button>
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
              :
            <button
              onClick={toggleMenu}
              className={cn(styles.btnMenu, { [styles.btnMenu_opened]: menuOpened })}>
              <span />
            </button>
          }
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
        React.cloneElement(
          children,
          {
            toggleFooter,
            openLogin: togglePopup,
            openAddFunds: toggleAddFunds
          }
        )
      }
      {
        isMobile &&
        <MobileMenu
          opened={menuOpened}
          onClose={toggleMenu} />
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
                        width={67}
                        height={25}
                        alt="HOMEJAB logo" />
                    </a>
                  </Link>
                  <Typography
                    fontSize={12}
                    lHeight={24}
                    maxWidth={440}
                    margin="24px 0 0"
                    color={`rgba(55, 65, 81, 0.6)`}>
                    real is a marketplace where real estate photographers can showcase and promote their work, without fear of losing ownership of their efforts. Online image theft is rampant, especially in the real estate community. And, while it seems harmless on the surface, it’s actually quite damaging for the artist who creates the image. Photographers are forced to put their work out there with zero protections, at very little pay. The real NFT marketplace is designed to protect the ownership of an artist’s digital portfolio, while rewarding them for their hard work.
                  </Typography>
                </div>
                <div className={styles.navLinks}>
                  {auth?.user ? 
                    <div className={cn(styles.navCol, styles.colAccount)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      My account
                    </Typography>
                    <ul className={styles.list}>
                        <li>
                          <Link href={`/profile/${auth.user.username}`}>My Profile</Link>
                        </li>
                        <li>
                          <Link href={`/profile/${auth.user.username}?tab=favorited`}>My Favorites</Link>
                        </li>
                        <li>
                          <Link href={`/settings`}>My Account Settings</Link>
                        </li>
                    </ul>
                    </div> : null
                  }
                  
                  <div className={cn(styles.navCol, styles.colCompany)}>
                    <Typography fontSize={14} fontWeight={600} color={'#000'} lHeight={20}>
                      Company
                    </Typography>
                    <ul className={styles.list}>
                      {
                        companyLinks.map((item) => (
                          <li key={item.name}>
                            {
                              item?.newTab ?
                                <a href={item.link} target="_blank" rel="noreferrer noopener">{item.name}</a>
                                :
                                <Link href={item.link}>
                                  { item.name }
                                </Link>
                            }
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                  <ul className={styles.socials}>
                    <li>
                      <a href="https://www.facebook.com/homejab" target="_blank" rel="noreferrer noopener">
                        <FacebookIcon />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/homejab/" target="_blank" rel="noreferrer noopener">
                        <InstagramIcon />
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/HomeJab" target="_blank" rel="noreferrer noopener">
                        <TwitterIcon />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/channel/UC8GOaTipjEzi4W2kVjO1-ig" target="_blank" rel="noreferrer noopener">
                        <YoutubeIcon />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.pinterest.com/homejab" target="_blank" rel="noreferrer noopener">
                        <PinterestIcon />
                      </a>
                    </li>
                  </ul>
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