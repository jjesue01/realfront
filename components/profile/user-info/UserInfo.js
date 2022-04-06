import React, {useEffect, useState} from "react";
import styles from './UserInfo.module.sass'
import Image from "next/image";
import Typography from "../../Typography";
import SettingsIcon from '/public/icons/settings.svg'
import PenIcon from '/public/icons/pen.svg'
import cn from "classnames";
import {useRouter} from "next/router";
import {getImageUrl, getShortWalletAddress} from "../../../utils";
import ButtonCopy from "../../button-copy/ButtonCopy";
import BannerBackground from "../../banner-background/BannerBackground";
import FileUploader from "../../photos/form/file-uploader/FileUploader";
import {useUpdateUserImagesMutation} from "../../../services/auth";
import ButtonCircle from "../../button-circle/ButtonCircle";


function UserInfo({ user, isPublic = false }) {
  const router = useRouter()
  const [updateUserImages] = useUpdateUserImagesMutation()
  const [logo, setLogo] = useState(null)
  const [banner, setBanner] = useState(null)

  function goTo(path) {
    return function () {
      router.push(path)
    }
  }

  function handleLogoChange(files) {
    setLogo(files[0])
    updateUserImages({ logoImage: files[0] })
  }


  function handleBannerChange(files) {
    setBanner(files[0])
    updateUserImages({ bannerImage: files[0] })
  }

  useEffect(function initUserImages() {
    if (!user) return;
    if (user?.logoImage) setLogo(user.logoImage)
    if (user?.bannerImage) setBanner(user.bannerImage)
  }, [user])

  return (
    <section className={styles.root}>
      <div className={styles.bg}>
        {
          banner !== null ?
            <Image src={getImageUrl(banner)} layout="fill" objectFit="cover" alt="banner" />
            :
            <BannerBackground />
        }
        {
          !isPublic ? 
            <FileUploader
              className={styles.editBanner}
              onChange={handleBannerChange}
              accept=".jpg,.jpeg,.png">
              <ButtonCircle className={styles.btnEdit}>
                <PenIcon />
              </ButtonCircle>
            </FileUploader> : null
        }
      </div>
      <div className="container">
        <div className={styles.info}>
          <FileUploader
            className={styles.userLogo}
            onChange={handleLogoChange}
            accept=".jpg,.jpeg,.png"
            disabled={isPublic}>
            {
              logo === null ?
                <Image src="/icons/user.svg" width={50} height={50} alt="User" />
                :
                <div className={styles.imageWrapper}>
                  <Image src={getImageUrl(logo)} layout="fill" objectFit="cover" alt="logo" />
                </div>
            }
          </FileUploader>
          <div className={styles.userNameContainer}>
            <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
              { user?.username || 'John Doe' }
            </Typography>
            {
              !isPublic ? 
                <button onClick={goTo('/settings')} className={styles.btnSettings}>
                  <SettingsIcon />
                </button> : null
            }
            
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