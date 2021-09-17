import React, { useState } from 'react'
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
    link: '/favorites'
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
  const router = useRouter()
  const [user, setUser] = useState({})
  const [walletOpened, setWalletOpened] = useState(false)
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

  function handleLogin(user) {
    togglePopup()
    setUser({ ...user })
  }

  function handleLogout() {
    setUser({})
  }

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
              <Button type="outlined">
                Create
              </Button>
              {
                user.walletId ?
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
        user.walletId &&
        <WalletMenu
          user={user}
          opened={walletOpened}
          onLogOut={handleLogout}
          onClose={toggleWallet} />
      }
      {
        React.cloneElement(children, { toggleFooter })
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
                        marketplaceLinks.map(({ name, link }) => (
                          <li key={name}>
                            <Link href={link}>
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