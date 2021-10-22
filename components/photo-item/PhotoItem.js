import React, { useState, useEffect } from 'react'
import styles from './PhotoItem.module.sass'
import Link from "next/link";
import Image from "next/image";
import Typography from "../Typography";
import cn from "classnames";
import HeartIcon from '/public/icons/heart.svg'
import HeartFilledIcon from '/public/icons/heart-filled.svg'
import ContextMenu from "../context-menu/ContextMenu";
import {useLikeListingMutation} from "../../services/listings";
import {getMoneyView} from "../../utils";

function PhotoItem({ className, imageClassName, data, type, favorite = false, isOwn = false }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [likes, setLikes] = useState(0)
  const [likeListing] = useLikeListingMutation()

  function handleClick(e) {
    const { target: { tagName } } = e

    if (tagName === 'BUTTON') e.preventDefault()
  }

  function toggleFavorite() {
    likeListing(data._id)
    setLikes(prevState => {
      if (!isFavorite)
        return prevState + 1
      else
        return prevState - 1
    })
    setIsFavorite(prevState => !prevState)
  }

  useEffect(function () {
    setIsFavorite(favorite)
    setLikes(data.likes)
  }, [favorite, data])

  return (
    <div className={cn(className, styles.rootWrapper, { [styles.full]: type === 'full' })}>
      <ContextMenu href={`/photos/edit/${data._id}`}  className={styles.btnMenu} hasEdit={isOwn} />
      <Link href={`/photos/${data._id}`} passHref>
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
                  { likes }
                </Typography>
              </button>
            </div>
            <div className={cn(imageClassName, styles.imageWrapper)}>
              <Image
                src={data.filePath}
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
                  { data?.collections?.name }
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
                      <Typography fontWeight={600} fontSize={16}>
                        { getMoneyView(data.price) }
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