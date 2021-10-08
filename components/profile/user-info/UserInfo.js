import React from "react";
import styles from './UserInfo.module.sass'
import Image from "next/image";
import Typography from "../../Typography";
import CopyIcon from '/public/icons/copy.svg'
import SettingsIcon from '/public/icons/settings.svg'
import PenIcon from '/public/icons/pen.svg'
import cn from "classnames";
import {useRouter} from "next/router";
import {getShortWalletAddress} from "../../../utils";
import ButtonCopy from "../../button-copy/ButtonCopy";
import BannerBackground from "../../banner-background/BannerBackground";


function UserInfo({ user }) {
  const router = useRouter()

  function goTo(path) {
    return function () {
      router.push(path)
    }
  }

  return (
    <section className={styles.root}>
      <div className={styles.bg}>
        <BannerBackground />
        <button className={cn(styles.btnSettings, styles.btnEdit)}>
          <PenIcon />
        </button>
      </div>
      <div className="container">
        <div className={styles.info}>
          <button className={styles.userLogo}>
            <Image src="/icons/user.svg" width={50} height={50} alt="User" />
            <span className={styles.editWrapper}>
              <PenIcon /> Edit
            </span>
          </button>
          <div className={styles.userNameContainer}>
            <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
              { user?.username || 'John Doe' }
            </Typography>
            <button onClick={goTo('/settings')} className={styles.btnSettings}>
              <SettingsIcon />
            </button>
          </div>
          <div className={styles.walletIdContainer}>
            <Typography fontSize={16} lHeight={20} color={'#5F6774'}>
              { getShortWalletAddress(user?.walletAddress) }
            </Typography>
            <ButtonCopy
              className={styles.btnCopy}
              value={user?.walletAddress} />
          </div>
          <Typography
            fontSize={16}
            lHeight={20}
            color={'#5F6774'}
            margin={'16px 0 0'}
            maxWidth={555}
            align="center">
            { user?.bio }
          </Typography>
        </div>
      </div>
    </section>
  )
}

export default UserInfo