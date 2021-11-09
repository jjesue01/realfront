import React from 'react'
import styles from './HowItWorks.module.sass'
import SectionTitle from "../section-title/SectionTitle";
import Image from "next/image";
import Typography from "../Typography";
import Button from "../button/Button";
import Link from "next/link";
import {useSelector} from "react-redux";

function HowItWorks({ center = false, onConnect }) {
  const user = useSelector(state => state.auth.user)

  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle center={center}>
          How it works
        </SectionTitle>
        {
          center &&
            <Typography
              fontFamily={'Lato'}
              fontWeight={500}
              fontSize={18}
              lHeight={32}
              margin={'24px auto 0'}
              align={'center'}
              maxWidth={615}
              color={'rgba(55, 65, 81, 0.8)'}>
              Creating an NFT in HomeJab Real should be quick and easy (we want you happy). Just follow the steps below. Of course, if there are any issues, you can always email us at real@homejab.com.
            </Typography>
        }
      </div>
      <div className={styles.stepsContainer}>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepImage}>
              <Image
                src="/images/hiw-1.png"
                width={60}
                height={52}
                alt="Wallet" />
            </div>
            <Typography
              fontSize={20}
              fontWeight={600}
              lHeight={24}
              margin={'32px 0 18px'}
              color={'#111111'}>
              Set up your wallet
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              maxWidth={231}
              align={'center'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Once you’ve set up your MetaMask wallet, connect it to HomeJab Real by clicking Connect Wallet in the top right corner.
            </Typography>
          </div>
          <div className={styles.step}>
            <div className={styles.stepImage}>
              <Image
                src="/images/hiw-2.png"
                width={62}
                height={60}
                alt="Collection" />
            </div>
            <Typography
              fontSize={20}
              fontWeight={600}
              lHeight={24}
              margin={'32px 0 18px'}
              color={'#111111'}>
              Create your NFTs
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              maxWidth={231}
              align={'center'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Click Create to set up your NFTs.  Add social links, a description, profile & banner images, and set a secondary sales fee.
            </Typography>
          </div>
          <div className={styles.step}>
            <div className={styles.stepImage}>
              <Image
                src="/images/hiw-3.png"
                width={61}
                height={47}
                alt="Crown" />
            </div>
            <Typography
              fontSize={20}
              fontWeight={600}
              lHeight={24}
              margin={'32px 0 18px'}
              color={'#111111'}>
              Add your NFT’s
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              maxWidth={231}
              align={'center'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Upload your work, add a title and description, and customize your NFTs with properties, stats, and unlockable content.
            </Typography>
          </div>
          <div className={styles.step}>
            <div className={styles.stepImage}>
              <Image
                src="/images/hiw-4.png"
                width={72}
                height={69}
                alt="Sale" />
            </div>
            <Typography
              fontSize={20}
              fontWeight={600}
              lHeight={24}
              margin={'32px 0 18px'}
              color={'#111111'}>
              List them for sale
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              maxWidth={231}
              align={'center'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Choose between auctions, fixed price listings, and declining price listings. You choose how you want to sell your NFTs, and we help you sell them!
            </Typography>
          </div>
        </div>
        <div className={styles.actions}>
          <Link href="/marketplace">
            <a>
              <Button type="accent">
                Explore
              </Button>
            </a>
          </Link>
          {
            !user &&
            <Button onClick={onConnect} type="outlined">
              Connect Wallet
            </Button>
          }
        </div>
      </div>
    </section>
  )
}

export default HowItWorks