import React from 'react'
import styles from './DoneCongratulation.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import Link from "next/link";
import ButtonCircle from "../../button-circle/ButtonCircle";
import {getHost, getShortWalletAddress} from "../../../utils";
import cn from "classnames";
import {FacebookShareButton, TelegramShareButton, TwitterShareButton} from "react-share";
import {useRouter} from "next/router";
import ButtonCopy from "../../button-copy/ButtonCopy";
import MediaFile from "../../media-file/MediaFile";
import {getConfig} from "../../../app-config";

const HOST_NAME = 'https://nft-homejab.netlify.app'

function DoneCongratulation({ opened, onClose, imageUrl, title = 'Done', message, transactionHash, listing, hasShare = true }) {
  const router = useRouter()
  const currentNetwork = listing?.blockchain === 'polygon' ?
    getConfig().POLYGON_NETWORK
    :
    getConfig().BSC_NETWORK
  const EXPLORER_LINK = currentNetwork.blockExplorerUrls[0] + '/tx/'

  function getShareMessage() {
    if (router.pathname.includes('/photos/create'))
      return `I've just created new NFT ${listing?.name} on HomeJab!`

    if (router.pathname.includes('/photos/[id]'))
      return `I've just bought NFT ${listing?.name} on HomeJab!`

    if (router.pathname.includes('/photos/sell'))
      return `I've started selling NFT ${listing?.name} on HomeJab!`
  }

  function getShareLink() {
    if (router.pathname.includes('/photos/[id]'))
      return HOST_NAME + '/marketplace'

    return HOST_NAME + '/photos/' + listing?._id
  }

  function getCopyLink() {
    const regex = new RegExp(HOST_NAME, 'g')

    return getShareLink().replace(regex, getHost())
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={cn(styles.dialog, { [styles.createDone]: !hasShare })}>
        <Typography
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          { title }
        </Typography>
        <Typography
          className={styles.message}
          fontSize={ transactionHash !== undefined ? 16 : 14}
          fontWeight={600}
          lHeight={transactionHash !== undefined ? 20 : 17}
          align="center"
          margin={'32px auto 0'}
          maxWidth={427}
          color={'#000000'}>
          { message }
        </Typography>
        <div className={styles.imageWrapper}>
          {
            imageUrl &&
              <MediaFile
                src={imageUrl}
                videoSrc={listing.resource === 'Video' && imageUrl}
                autoPlay
                alt="apartments" />
          }
        </div>
        {
          transactionHash !== undefined &&
            <div className={styles.buyInfo}>
              <div className={styles.buyInfoItem}>
                <div className={styles.buyInfoTitle}>
                  <p>Transaction Hash</p>
                </div>
                <div className={styles.buyInfoContent}>
                  {
                    !!transactionHash &&
                    <Link href={EXPLORER_LINK + transactionHash} passHref>
                      <a className={styles.transactionHash} target="_blank" rel="noreferrer">
                        { getShortWalletAddress(transactionHash) }
                      </a>
                    </Link>
                  }
                </div>
              </div>
            </div>
        }
        {
          hasShare &&
          <div className={cn(styles.share, { [styles.noMargin]: transactionHash !== undefined })}>
            <Typography
              fontSize={14}
              fontWeight={600}
              lHeight={17}
              align="center"
              color={'#000000'}>
              Share
            </Typography>
            <div className={styles.buttons}>
              <FacebookShareButton url={getShareLink()} quote={getShareMessage()} hashtag={'#NFT'}>
                <ButtonCircle tag="span">
                  <Image src="/icons/fb.svg" width={9} height={18} alt="facebook" />
                </ButtonCircle>
              </FacebookShareButton>
              <TwitterShareButton url={getShareLink()} title={getShareMessage()} via={'HomeJab'} hashtags={['NFT', 'HomeJab']}>
                <ButtonCircle tag="span">
                  <Image src="/icons/twitter.svg" width={20} height={20} alt="twitter" />
                </ButtonCircle>
              </TwitterShareButton>
              <TelegramShareButton url={getShareLink()} title={getShareMessage()}>
                <ButtonCircle tag="span">
                  <Image src="/icons/tg.svg" width={22} height={22} alt="telegram" />
                </ButtonCircle>
              </TelegramShareButton>
              <ButtonCopy className={styles.btnCircle} value={getCopyLink()}>
                <Image src="/icons/link.svg" width={22} height={22} alt="link" />
              </ButtonCopy>
            </div>
          </div>
        }
      </div>
    </PopupWrapper>
  )
}

export default DoneCongratulation