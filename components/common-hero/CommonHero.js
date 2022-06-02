import React from "react";
import styles from './CommonHero.module.sass'
import Typography from "../Typography";
import Image from "next/image";

function CommonHero({ title, description, imgUrl }) {
  return (
    <section className={styles.root}>
      <div className={styles.bgImage}>
        <Image src="/bg-circle.png" width={416} height={397} alt="circle" />
      </div>
      <div className={styles.heroContainer}>
        <div className={styles.content}>
          <Typography
            tag="h1"
            fontSize={42}
            fontWeight={600}
            lHeight={51}
            color={'#111111'}>
            { title }
          </Typography>
          <Typography
            className={styles.description}
            fontFamily={'Lato'}
            fontSize={18}
            lHeight={32}
            margin={'24px 0 0'}
            maxWidth={458}
            color={'rgba(55, 65, 81, 0.8)'}>
            { description }
          </Typography>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <Image src={imgUrl} layout="fill" objectFit="cover" alt={title} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommonHero