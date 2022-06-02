import React from "react";
import styles from './BannerBackground.module.sass'
import Image from "next/image";

function BannerBackground() {
  return (
    <>
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
    </>
  )
}

export default BannerBackground