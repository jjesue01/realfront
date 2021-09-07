import React from 'react'
import styles from './BrowseByCity.module.sass'
import Image from "next/image";
import SectionTitle from "../../section-title/SectionTitle";
import Typography from "../../Typography";
import Button from "../../button/Button";

const cities = [
  {
    img: '/images/bc-ny.jpg',
    name: 'New York, NY'
  },
  {
    img: '/images/bc-la.jpg',
    name: 'Los Angeles, CA'
  },
  {
    img: '/images/bc-ch.jpg',
    name: 'Chicago, IL'
  },
  {
    img: '/images/bc-ho.jpg',
    name: 'Houston, TX'
  },
  {
    img: '/images/bc-ph.jpg',
    name: 'Phoenix, AZ'
  },
  {
    img: '/images/bc-phi.jpg',
    name: 'Philadelphia, PA'
  },
]

function BrowseByCity() {
  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle>
          Browse by city
        </SectionTitle>
        <div className={styles.cities}>
          {
            cities.map(({ img, name }) => (
              <div key={name} className={styles.city}>
                <div className={styles.cityImage}>
                  <Image
                    src={img}
                    layout="fill"
                    alt={name}
                    objectFit="cover" />
                </div>
                <Typography
                  fontSize={20}
                  fontWeight={600}
                  lHeight={24}
                  margin={'24px 0 0'}
                  color={'#111111'}>
                  { name }
                </Typography>
              </div>
            ))
          }
        </div>
        <div className={styles.actions}>
          <Button>
            Explore More
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BrowseByCity