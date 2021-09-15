import React from 'react'
import styles from './PhotoItem.module.sass'
import Link from "next/link";
import Image from "next/image";
import Typography from "../Typography";
import cn from "classnames";
import HeartIcon from '/public/icons/heart.svg'
import MenuIcon from '/public/icons/menu-ellipsis.svg'

function PhotoItem() {

  function handleClick(e) {
    const { target: { tagName } } = e
    if (tagName === 'BUTTON')
      e.preventDefault()
  }

  return (
    <Link href="/" passHref>
      <a onClick={handleClick}>
        <div className={styles.root}>
          <div className={styles.header}>
            <button className={cn(styles.btnFavorite, { [styles.btnFavoriteActive]: false })}>
              <HeartIcon />
              <Typography
                tag="span"
                fontWeight={500}
                fontSize={12}
                color={'#878D97'}
                margin={'0 0 0 9px'}>
                5
              </Typography>
            </button>
            <button className={styles.btnMenu}>
              <MenuIcon />
            </button>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/hero-aparts-big.jpg"
              layout="fill"
              objectFit="cover"
              alt="apartments" />
          </div>
          <div className={styles.content}>
            <Typography fontWeight={600} fontSize={16} lHeight={20}>
              Item Name
            </Typography>
            <Typography fontSize={12} lHeight={15} color={'#878D97'} margin="8px 0 0">
              New York, Manhattan
            </Typography>
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <Typography fontSize={12} color={'#878D97'} margin={'0 16px 0 0'}>
                Price
              </Typography>
              <Image src="/icons/ethereum.svg" width={18} height={18} alt="ethereum.svg" />
              <Typography fontWeight={600} fontSize={16} margin={'0 0 0 8px'}>
                2.59
              </Typography>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default PhotoItem