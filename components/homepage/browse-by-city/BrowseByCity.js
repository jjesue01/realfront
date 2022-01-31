import React from 'react'
import styles from './BrowseByCity.module.sass'
import Image from "next/image";
import SectionTitle from "../../section-title/SectionTitle";
import Typography from "../../Typography";
import Button from "../../button/Button";
import {
  useGetCitiesQuery,
} from "../../../services/cities";
import Link from "next/link";

function BrowseByCity() {
  const { data = [] } = useGetCitiesQuery({ limit: 6 })

  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle>
          Browse by city
        </SectionTitle>
        <div className={styles.cities}>
          {
            data.map(({ name, logo, _id, url}) => (
              <Link key={_id} href={`/cities/${url}`}>
                <a>
                  <div className={styles.city}>
                    <div className={styles.cityImage}>
                      <Image
                        src={logo || '/images/bc-ny.jpg'}
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
                </a>
              </Link>
            ))
          }
        </div>
        <div className={styles.actions}>
          <Link href="/marketplace">
            <a href="">
              <Button>
                Explore More
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BrowseByCity