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
          How it works?
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat nulla scelerisque orci, enim morbi tellus mauris. Nam sit tincidunt at sagittis sem enim ut nunc maecenas.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
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
              Create your collection
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              maxWidth={231}
              align={'center'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
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