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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat nulla scelerisque orci, enim morbi tellus mauris. Nam sit tincidunt at sagittis sem enim ut nunc maecenas. Elit morbi libero sem quam porttitor platea nunc eget. Morbi in imperdiet amet at et. Facilisis et, nisl, mattis tellus sapien sit placerat pulvinar fermentum.
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={16}
              lHeight={32}
              margin={'32px 0 0'}
              color={'rgba(55, 65, 81, 0.8)'}>
              Aliquam odio enim hendrerit neque eget. Id nunc consectetur enim lectus orci quisque sed. Massa ornare rutrum aliquet suspendisse tempor blandit nec. Tristique nunc, eget molestie tortor viverra aliquam. Nullam ac lectus interdum sapien non non ac sagittis pellentesque. Malesuada faucibus vestibulum egestas purus a vivamus scelerisque. Tellus quam lectus varius dui. Ut nec mattis pharetra pharetra tellus.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs