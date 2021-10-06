import React, { useState, useEffect } from 'react'
import styles from './PhotoItem.module.sass'
import Link from "next/link";
import Image from "next/image";
import Typography from "../Typography";
import cn from "classnames";
import HeartIcon from '/public/icons/heart.svg'
import HeartFilledIcon from '/public/icons/heart-filled.svg'
import ContextMenu from "../context-menu/ContextMenu";

function PhotoItem({ className, imageClassName, data, type, favorite = false }) {
  const [isFavorite, setIsFavorite] = useState(false)

  function handleClick(e) {
    const { target: { tagName } } = e

    if (tagName === 'BUTTON') e.preventDefault()
  }

  function toggleFavorite() {
    setIsFavorite(prevState => !prevState)
  }

  useEffect(function () {
    setIsFavorite(favorite)
  }, [favorite])

  return (
    <div className={cn(className, styles.rootWrapper, { [styles.full]: type === 'full' })}>
      <ContextMenu href={`/photos/edit/${data.id}`} className={styles.btnMenu} />
      <Link href={`/photos/${data.id}`} passHref>
        <a onClick={handleClick}>
          <div className={styles.root}>
            <div className={styles.header}>
              <button
                onClick={toggleFavorite}
                className={cn(styles.btnFavorite, { [styles.btnFavoriteActive]: isFavorite })}>
                <span className={styles.iconWrapper}>
                  <HeartIcon />
                  <HeartFilledIcon className={styles.iconHeart} />
                </span>
                <Typography
                  tag="span"
                  fontWeight={500}
                  fontSize={12}
                  color={'#878D97'}
                  margin={'0 0 0 9px'}>
                  5
                </Typography>
              </button>
            </div>
            <div className={cn(imageClassName, styles.imageWrapper)}>
              <Image
                src="/hero-aparts-big.jpg"
                layout="fill"
                objectFit="cover"
                alt="apartments" />
            </div>
            <div className={styles.itemData}>
              <div className={styles.content}>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  { data.name }
                </Typography>
                <Typography fontSize={12} lHeight={15} color={'#878D97'} margin="8px 0 0">
                  { data.address }
                </Typography>
              </div>
              <div className={styles.priceContainer}>
                {
                  data.price &&
                  <div className={styles.price}>
                    <Typography fontSize={12} color={'#878D97'} margin={'0 16px 0 0'}>
                      Price
                    </Typography>
                    <div className={styles.ethereum}>
                      <Image src="/icons/ethereum.svg" width={18} height={18} alt="ethereum.svg" />
                      <Typography fontWeight={600} fontSize={16} margin={'0 0 0 8px'}>
                        { data.price }
                      </Typography>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default PhotoItem