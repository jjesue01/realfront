import React from "react";
import styles from './AboutUs.module.sass'
import Image from "next/image";
import SectionTitle from "../../section-title/SectionTitle";
import Typography from "../../Typography";

function AboutUs() {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <Image src="/images/about-us.jpg" layout="fill" objectFit="cover" alt="About us" />
          </div>
          <div className={styles.info}>
            <SectionTitle>
              About Us
            </SectionTitle>
            <Typography
              fontFamily={'Lato'}
              fontSize={16}
              lHeight={32}
              margin={'24px 0 0'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Online image theft is rampant, especially in the real estate community.  And, while it seems harmless on the surface, it’s actually quite damaging for the artist who creates the image.  Photographers are forced to put their work out there with zero protections, at very little pay.  The HomeJab Real marketplace is designed to protect the ownership of an artist’s digital portfolio, while rewarding them for their hard work.
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={16}
              lHeight={32}
              margin={'32px 0 0'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Each HomeJab Real NFT is a unique portrayal of a real world landmark, landscape, institution or home created by a local artist from your community.  And, each NFT is one of a kind, the only edition of these real world images. When you purchase an NFT from the HomeJab Real marketplace, you are not only owning a piece of real world history, you are supporting a real life artist that desperately needs your help.  Most photographers work as independent contractors, with no employee protections, unions, pensions or any security for their services.  Once the work is published, the possession is out of the artist’s control.  HomeJab Real is the only place, real or digital, that secures their efforts and the ongoing value they provide.
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={16}
              lHeight={32}
              margin={'32px 0 0'}
              color={'rgba(55, 65, 81, 0.8)'}>
              As society becomes more virtual in its daily routine, actually seeing the world has suddenly become more of a chore for many.  Photographers are our lens to the real world, we cannot afford to lose them now, or ever.  We need to protect and support our artists, if we don’t, who will?
            </Typography>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs