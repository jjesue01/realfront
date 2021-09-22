import React from "react";
import styles from './UserInfo.module.sass'
import Image from "next/image";
import Typography from "../../Typography";
import CopyIcon from '/public/icons/copy.svg'
import SettingsIcon from '/public/icons/settings.svg'
import PenIcon from '/public/icons/pen.svg'
import cn from "classnames";


function UserInfo() {
  return (
    <section className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.circle1}>
          <Image
            src="/images/profile-c1.png"
            alt="circle"
            width={429}
            height={289} />
        </div>
        <div className={styles.circle2}>
          <Image
            className={styles.circle2}
            src="/images/profile-c2.png"
            alt="circle"
            width={169}
            height={144} />
        </div>
        <div className={styles.circle3}>
          <Image
            src="/images/profile-c3.png"
            alt="circle"
            width={128}
            height={91} />
        </div>
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
              John Doe
            </Typography>
            <button className={styles.btnSettings}>
              <SettingsIcon />
            </button>
          </div>
          <div className={styles.walletIdContainer}>
            <Typography fontSize={16} lHeight={20} color={'#5F6774'}>
              0xa364b0313...8815
            </Typography>
            <button className={styles.btnCopy}>
              <CopyIcon />
            </button>
          </div>
          <Typography
            fontSize={16}
            lHeight={20}
            color={'#5F6774'}
            margin={'16px 0 0'}
            maxWidth={555}
            align="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus mattis accumsan, diam sed.
          </Typography>
        </div>
      </div>
    </section>
  )
}

export default UserInfo