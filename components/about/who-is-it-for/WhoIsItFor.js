import React from "react";
import styles from './WhoIsItFor.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Image from "next/image";
import Typography from "../../Typography";

const items = [
  {
    iconUrl: '/images/about-who-1.png',
    title: 'Photographers',
    description: 'All of the artists ‘minting’ NFTs on the real marketplace are professional real estate photographers. It is the one and only marketplace for photographers, by photographers. Photographers worldwide can now be rewarded for their hard work.',
    iconWidth: 31,
    iconHeight: 34
  },
  {
    iconUrl: '/images/about-who-2.png',
    title: 'Business Owners',
    description: 'In addition to capturing images for business and residential needs, the real NFT marketplace will also be home to many national landmarks and institutions.  Digital art collectors can uniquely own Times Square, or the Hollywood Sign, or any other iconic landmark with first edition digital artwork.  And, if they don’t find what they want in our marketplace, they can always order their very own custom NFT, making it truly one of a kind.',
    iconWidth: 36,
    iconHeight: 36
  },
  {
    iconUrl: '/images/about-who-3.png',
    title: 'Journalists and Bloggers',
    description: 'Who tells the stories of these business owners?\n' +
      'Better yet, who tells all the stories and posts them online for all to enjoy?\n' +
      'Journalists and bloggers.\n' +
      'So, they most certainly have a need for true image ownership and usage when posting a story.  After all, a picture does tell a thousand words.',
    iconWidth: 34,
    iconHeight: 32
  },
  {
    iconUrl: '/images/about-who-4.png',
    title: 'Digital Art Collectors',
    description: 'In addition to capturing images for business and residential needs, the real NFT marketplace will also be home to many national landmarks and institutions. All one of a kind, single edition. Digital art collectors can uniquely own Times Square, or the Hollywood Sign, or any other iconic landmark with single issued digital artwork.',
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
              src="/images/who-for.jpeg"
              width={1000}
              height={1385}
              layout="responsive"
              alt="desert" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoIsItFor