import React, { useState } from "react";
import styles from './PhotoInfo.module.sass'
import Image from "next/image";
import Typography from "../../../Typography";
import MenuEllipsisSmall from '/public/icons/menu-ellipsis-small.svg'
import cn from "classnames";
import Button from "../../../button/Button";
import HeartIcon from "../../../../public/icons/heart.svg";
import HeartFilledIcon from "../../../../public/icons/heart-filled.svg";
import ContextMenuWrapper from "../../../context-menu/ContextMenuWrapper";

function PhotoInfo() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)

  const ownItem = false

  function toggleFavorite() {
    setIsFavorite(prevState => !prevState)
  }

  function toggleMenu() {
    setMenuOpened(prevState => !prevState)
  }

  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.imageWrapper}>
            <Image src={'/hero-aparts-big.jpg'} layout="fill" objectFit="cover" alt="Photo item" />
          </div>
          <div className={styles.content}>
            <div className={styles.mainInfo}>
              <div className={styles.header}>
                <div className={styles.collection}>
                  <Typography
                    fontWeight={600}
                    fontSize={12}
                    lHeight={15}
                    color={'#878D97'}>
                    Collection
                  </Typography>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    lHeight={17}
                    margin={'8px 0 0'}>
                    New York, Manhattan
                  </Typography>
                </div>
                <div className={styles.stats}>
                  <div className={styles.views}>
                    <Image src="/icons/eye.svg" width={24} height={24} alt="Eye icon" />
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      lHeight={15}
                      color={'#878D97'}
                      margin={'0 0 0 11px'}>
                      24 views
                    </Typography>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={toggleFavorite}
                      className={cn(styles.btnOutlined, styles.btnFavorite, { [styles.btnFavoriteActive]: isFavorite })}>
                      <span className={styles.iconWrapper}>
                        <HeartIcon />
                        <HeartFilledIcon className={styles.iconHeart} />
                      </span>
                      <Typography tag="span" fontWeight={600} fontSize={12}>
                        6
                      </Typography>
                    </button>
                    <ContextMenuWrapper
                      opened={menuOpened}
                      triggerEl={
                        <button
                          onClick={toggleMenu}
                          className={cn(styles.btnOutlined, styles.btnMenu, { [styles.btnMenuActive]: menuOpened })}>
                          <MenuEllipsisSmall />
                        </button>
                      }
                      onClose={toggleMenu}>
                      <button className={styles.btnMenuItem}>
                        Copy
                      </button>
                      <button className={styles.btnMenuItem}>
                        Share on Facebook
                      </button>
                      <button className={styles.btnMenuItem}>
                        Share to Twitter
                      </button>
                    </ContextMenuWrapper>
                  </div>
                </div>
              </div>
              <Typography
                tag="h1"
                fontWeight={600}
                fontSize={28}
                lHeight={34}>
                Item name
              </Typography>
              {
                !ownItem ?
                  <div className={styles.price}>
                    <div className={styles.priceContent}>
                      <Typography
                        fontWeight={600}
                        fontSize={12}
                        lHeight={15}
                        color={'#878D97'}>
                        Current price
                      </Typography>
                      <div className={styles.priceDetails}>
                        <Image src="/icons/ethereum.svg" width={24} height={24} alt="ethereum" />
                        <Typography
                          fontSize={28}
                          fontWeight={600}
                          lHeight={34}
                          margin={'0 0 0 12px'}>
                          2.59
                        </Typography>
                        <Typography fontSize={14} color={'#878D97'} margin={'0 0 0 16px'}>
                          ($3 166,41)
                        </Typography>
                      </div>
                    </div>
                    <Button>
                      Buy now
                    </Button>
                  </div>
                  :
                  <div className={styles.itemActions}>
                    <Button type="outlined">
                      Edit
                    </Button>
                    <Button>
                      Sell
                    </Button>
                  </div>
              }
              <div className={styles.description}>
                <Typography
                  tag="h3"
                  fontSize={16}
                  fontWeight={600}
                  lHeight={20}
                  color={'#000'}>
                  Description
                </Typography>
                <Typography
                  fontSize={14}
                  fontFamily={'Lato'}
                  lHeight={23}
                  margin={'10px 0 0'}
                  color={'rgba(55, 65, 81, 0.8)'}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras. Sollicitudin nulla orci vitae ut turpis vitae neque.
                </Typography>
              </div>
              <div className={styles.tags}>
                <span className={styles.tag}>
                  New York
                </span>
                <span className={styles.tag}>
                  Tag 1
                </span>
                <span className={styles.tag}>
                  Tag 2
                </span>
              </div>
            </div>
            <div className={styles.details}>
              <Typography
                tag="h3"
                fontSize={16}
                fontWeight={600}
                lHeight={20}
                color={'#000'}>
                Details
              </Typography>
              <div className={styles.detailsContent}>
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Location</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>New York, NY 10003, USA</p>
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Address</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>125 E 12th St</p>
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Contract Address</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>0x6d45...0751</p>
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Token ID</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>4352168</p>
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Blockchain</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>Ethereum</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhotoInfo