import React from 'react'
import styles from './DoneCongratulation.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import ButtonCircle from "../../button-circle/ButtonCircle";
import Loader from "../../loader/Loader";
import {getHost, getShortWalletAddress} from "../../../utils";
import cn from "classnames";
import {FacebookShareButton, TelegramShareButton, TwitterShareButton} from "react-share";
import {useRouter} from "next/router";
import ButtonCopy from "../../button-copy/ButtonCopy";

const HOST_NAME = 'https://nft-homejab.netlify.app'

function DoneCongratulation({ opened, onClose, imageUrl, title = 'Done', message, transactionHash, listing }) {
  const router = useRouter()

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
      <div className={styles.dialog}>
        <Typography
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          { title }
        </Typography>
        <Typography
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
              <Image src={imageUrl} layout="fill" objectFit="cover" alt="apartments" />
          }
        </div>
        {
          transactionHash !== undefined &&
            <div className={styles.buyInfo}>
              <div className={styles.buyInfoItem}>
                <div className={styles.buyInfoTitle}>
                  <p>Status</p>
                </div>
                <div className={styles.buyInfoContent}>
                  <div className={styles.processing}>
                    <div className={styles.loaderContainer}>
                      <Loader className={styles.loader} opened={opened} color="accent" />
                    </div>
                    <Typography fontSize={14} fontWeight={600}>
                      Processing
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={styles.buyInfoItem}>
                <div className={styles.buyInfoTitle}>
                  <p>Transaction Hash</p>
                </div>
                <div className={styles.buyInfoContent}>
                  <p className={styles.transactionHash}>
                    { !!transactionHash && getShortWalletAddress(transactionHash) }
                  </p>
                </div>
              </div>
            </div>
        }
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
      </div>
    </PopupWrapper>
  )
}

export default DoneCongratulation