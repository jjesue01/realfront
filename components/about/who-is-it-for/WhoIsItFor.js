import React from "react";
import styles from './WhoIsItFor.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Image from "next/image";
import Typography from "../../Typography";

const items = [
  {
    iconUrl: '/images/about-who-1.png',
    title: 'Photographers',
    description: 'All of the artists ‘minting’ NFTs on HomeJab Real are professional real estate photographers. It is the one and only marketplace for photographers, by photographers. Photographers across the nation can now be rewarded for their hard work.',
    iconWidth: 31,
    iconHeight: 34
  },
  {
    iconUrl: '/images/about-who-2.png',
    title: 'Real Estate Agents',
    description: 'Real estate agents are the number one consumers of real estate photography. It’s literally a part of their marketing campaign for every property they sell. In addition to impressing their sellers with beautiful real estate images of their home, they can literally gift them the digital footprint with a one of a kind NFT of their home.',
    iconWidth: 36,
    iconHeight: 36
  },
  {
    iconUrl: '/images/about-who-3.png',
    title: 'Home Owners',
    description: 'Not everyone lists their home for sale with a real estate agent. Better yet, not everyone lists their home for sale at all. In addition to owning their home in the real world, owners can secure the property in the digital world with a custom one of a kind NFT of their home.',
    iconWidth: 34,
    iconHeight: 32
  },
  {
    iconUrl: '/images/about-who-4.png',
    title: 'Digital Art Collectors',
    description: 'In addition to residential homes, HomeJab Real will be home to many national landmarks and institutions. All one of a kind, single edition. We are the only real estate NFT marketplace offering real world images from real world photographers. Digital art collectors can uniquely own Times Square, or the Hollywood Sign, or any other iconic landmark with single issued digital footprints.',
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
          { description }
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
          Who it’s for
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