import React from "react";
import styles from './WhoIsItFor.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Image from "next/image";
import Typography from "../../Typography";

const items = [
  {
    iconUrl: '/images/about-who-1.svg',
    title: 'Photographers',
    description: '',
    iconWidth: 31,
    iconHeight: 34
  },
  {
    iconUrl: '/images/about-who-2.svg',
    title: 'Real estate agents',
    description: '',
    iconWidth: 36,
    iconHeight: 36
  },
  {
    iconUrl: '/images/about-who-3.svg',
    title: 'Developers',
    description: '',
    iconWidth: 34,
    iconHeight: 32
  },
  {
    iconUrl: '/images/about-who-4.svg',
    title: 'Businesses',
    description: '',
    iconWidth: 39,
    iconHeight: 30
  },
]

function Item({ iconUrl, iconWidth, iconHeight, title, description }) {
  return (
    <div className={styles.item}>
      <div className={styles.iconWrapper}>
        <Image src={iconUrl} width={iconWidth} height={iconHeight} alt={title} />
      </div>
      <div className={styles.itemContent}>
        <Typography
          fontSize={20}
          fontWeight={600}
          lHeight={24}
          color={'#111'}>
          { title }
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={14}
          lHeight={22}
          margin={'18px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras.
        </Typography>
      </div>
    </div>
  )
}

function WhoIsItFor() {
  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle center>
          Who is it for?
        </SectionTitle>
        <div className={styles.content}>
          <div className={styles.items}>
            {
              items.map(item => (
                <Item key={item.title} {...item} />
              ))
            }
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/man.jpg"
              width={457}
              height={545}
              layout="responsive"
              alt="Man and laptop" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoIsItFor