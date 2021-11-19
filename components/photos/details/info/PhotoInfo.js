import React, {useEffect, useRef, useState} from "react";
import styles from './PhotoInfo.module.sass'
import Image from "next/image";
import Typography from "../../../Typography";
import MenuEllipsisSmall from '/public/icons/menu-ellipsis-small.svg'
import cn from "classnames";
import Button from "../../../button/Button";
import HeartIcon from "../../../../public/icons/heart.svg";
import HeartFilledIcon from "../../../../public/icons/heart-filled.svg";
import ContextMenuWrapper from "../../../context-menu/ContextMenuWrapper";
import {useRouter} from "next/router";
import {copyValue, getHost, getMoneyView, getShortWalletAddress} from "../../../../utils";
import {useLikeListingMutation} from "../../../../services/listings";
import {FacebookShareButton, TelegramShareButton, TwitterShareButton} from "react-share";
import ButtonCopy from "../../../button-copy/ButtonCopy";
import Offers from "../offers/Offers";
import Timer from "../timer/Timer";
import AspectRatioBox from "../../../aspect-ratio-box/AspectRatioBox";
import MediaFile from "../../../media-file/MediaFile";

const HOST_NAME = 'https://nft-homejab.netlify.app'

function PhotoInfo({ listing, user, onBuy, onOffer, ownItem, onLogin, bids, maxBid, onFinishAuction, onCancelBid }) {
  const router = useRouter()
  const { id } = router.query
  const [likeListing] = useLikeListingMutation()
  const [isFavorite, setIsFavorite] = useState(false)
  const [likes, setLikes] = useState(0)
  const [menuOpened, setMenuOpened] = useState(false)

  const copyRef = useRef()
  const fbRef = useRef()
  const twitterRef = useRef()

  function toggleFavorite() {
    if (user) {
      likeListing(listing._id)
      setLikes(prevState => {
        if (!isFavorite)
          return prevState + 1
        else
          return prevState - 1
      })
      setIsFavorite(prevState => !prevState)
    } else {
      onLogin()
    }
  }

  function toggleMenu() {
    setMenuOpened(prevState => !prevState)
  }

  function goTo(path) {
    return function () {
      router.push(path)
    }
  }

  function getShareMessage() {
    return `Check NFT ${listing?.name} on HomeJab!`
  }

  function getShareLink() {
    return HOST_NAME + '/photos/' + listing?._id
  }

  function handleCopy() {
    copyRef.current.click()
  }

  function handleShareFb() {
    fbRef.current.click()
    toggleMenu()
  }

  function handleShareTwitter() {
    twitterRef.current.click()
    toggleMenu()
  }

  function getCopyValue() {
    const regex = new RegExp(HOST_NAME, 'g')

    return getShareLink().replace(regex, getHost())
  }

  useEffect(function initLikes() {
    !!listing && setLikes(listing.likes)
    !!listing && !!user && setIsFavorite(user.favorites.includes(listing._id))
  }, [listing, user])

  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.column}>
            <MediaFile
              src={listing?.thumbnail}
              videoSrc={listing?.resource === 'Video' && listing?.rawFilePath}
              controls
              alt={listing?.name} />
            <Timer className={styles.timer} endDate={'2021-11-19 3:33'} />
            <Offers
              className={styles.offers}
              data={bids}
              isOwner={ownItem}
              onCancel={onCancelBid}
              onFinish={onFinishAuction} />
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
                    City
                  </Typography>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    lHeight={17}
                    margin={'8px 0 0'}>
                    { listing?.city?.name }
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
                      {listing?.views} views
                    </Typography>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={toggleFavorite}
                      className={cn(styles.btnOutlined, styles.btnFavorite, { [styles.btnFavoriteActive]: isFavorite && user })}>
                      <span className={styles.iconWrapper}>
                        <HeartIcon />
                        <HeartFilledIcon className={styles.iconHeart} />
                      </span>
                      <Typography tag="span" fontWeight={600} fontSize={12}>
                        { likes }
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
                      <FacebookShareButton
                        ref={fbRef}
                        url={getShareLink()}
                        quote={getShareMessage()}
                        hashtag={'#NFT'} />
                      <TwitterShareButton
                        ref={twitterRef}
                        url={getShareLink()}
                        title={getShareMessage()}
                        via={'HomeJab'}
                        hashtags={['NFT', 'HomeJab']} />
                      <div onClick={handleCopy} className={styles.btnMenuItem}>
                        <ButtonCopy ref={copyRef} value={getCopyValue()} onCopied={toggleMenu}>
                          Copy
                        </ButtonCopy>
                      </div>
                      {
                        listing?.isPublished &&
                          <>
                            <button onClick={handleShareFb} className={styles.btnMenuItem}>
                              Share on Facebook
                            </button>
                            <button onClick={handleShareTwitter} className={styles.btnMenuItem}>
                              Share to Twitter
                            </button>
                          </>
                      }
                    </ContextMenuWrapper>
                  </div>
                </div>
              </div>
              <Typography
                tag="h1"
                fontWeight={600}
                fontSize={28}
                lHeight={34}>
                { listing?.name }
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
                        { bids?.length ? 'Top bid': 'Current price' }
                      </Typography>
                      <div className={styles.priceDetails}>
                        <Typography
                          fontSize={28}
                          fontWeight={600}
                          lHeight={34}>
                          { getMoneyView(bids?.length ? maxBid : listing?.price) }
                        </Typography>
                      </div>
                    </div>
                    <div className={cn(styles.itemActions, styles.noMargin)}>
                      {
                        !bids?.length &&
                        <Button onClick={onBuy}>
                          Buy now
                        </Button>
                      }
                      <Button onClick={onOffer} type={ bids?.length ? 'accent': 'outlined' }>
                        { bids?.length ? 'Place bid': 'Make offer' }
                      </Button>
                    </div>
                  </div>
                  :
                  <div className={styles.itemActions}>
                    <Button onClick={goTo(`/photos/edit/${id}`)} type="outlined">
                      Edit
                    </Button>
                    <Button onClick={goTo(`/photos/sell/${id}`)}>
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
                  { listing?.description }
                </Typography>
              </div>
              <div className={styles.tags}>
                {
                  !!listing?.tags &&
                    listing?.tags?.split(',').map((tag, i) => (
                      <span key={tag + i} className={styles.tag}>
                        {tag}
                      </span>
                    ))
                }
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
                    <p>Address</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>{ listing?.address }</p>
                  </div>
                </div>
                {
                  listing?.contractAddress &&
                  <div className={styles.field}>
                    <div className={cn(styles.detailsCol, styles.colName)}>
                      <p>Contract Address</p>
                    </div>
                    <div className={cn(styles.detailsCol, styles.colContent)}>
                      <p>{getShortWalletAddress(listing.walletAddress)}</p>
                    </div>
                  </div>
                }
                {
                  listing?.tokenID &&
                  <div className={styles.field}>
                    <div className={cn(styles.detailsCol, styles.colName)}>
                      <p>Token ID</p>
                    </div>
                    <div className={cn(styles.detailsCol, styles.colContent)}>
                      <p>{listing?.tokenID}</p>
                    </div>
                  </div>
                }
                <div className={styles.field}>
                  <div className={cn(styles.detailsCol, styles.colName)}>
                    <p>Blockchain</p>
                  </div>
                  <div className={cn(styles.detailsCol, styles.colContent)}>
                    <p>{ listing?.blockchain }</p>
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