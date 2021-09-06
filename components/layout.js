import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './layout.module.sass'
import Button from "./button/Button";
import Typography from "./Typography";

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.wideContainer}>
          <Link href="/" passHref>
            <a>
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
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/marketplace">Marketplace</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
            <div className={styles.actions}>
              <Button type="outlined">
                Create
              </Button>
              <Button type="accent">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.navContainer}>
          <div className={styles.wideContainer}>

          </div>
        </div>
        <div className={styles.rightsContainer}>
          <div className={styles.wideContainer}>
            <Typography fontSize={12} color="rgba(255, 255, 255, 0.5)">
              © 2021 Homejab.LCC. All rights reserved.
            </Typography>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout