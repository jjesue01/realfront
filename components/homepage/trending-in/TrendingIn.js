import React, {useCallback, useEffect, useState} from 'react'
import styles from './TrendingIn.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Link from "next/link";
import ArrowShort from '/public/icons/arrow-short.svg'
import Slider from "react-slick";
import Image from "next/image";
import Typography from "../../Typography";
import cn from "classnames";
import CityPicker from "../city-picker/CityPicker";
import {collectionsApi} from "../../../services/collections";
import {useDispatch} from "react-redux";

const items = [
  {
    img: '/trending-1.jpg',
  },
  {
    img: '/trending-2.jpg',
  },
  {
    img: '/trending-1.jpg',
  },
  {
    img: '/trending-2.jpg',
  },
  {
    img: '/trending-2.jpg',
  },
]

const options = [
  {
    label: 'New York',
    value: 'New York'
  },
  {
    label: 'Los Angeles',
    value: 'Los Angeles'
  },
  {
    label: 'Chicago',
    value: 'Chicago'
  },
  {
    label: 'Houston',
    value: 'Houston'
  },
  {
    label: 'Philadelphia',
    value: 'Philadelphia'
  },
  {
    label: 'Phoenix',
    value: 'Phoenix'
  },
  {
    label: 'Washington',
    value: 'Washington'
  },
  {
    label: 'Miami',
    value: 'Miami'
  },
]

function NextArrow({ onClick }) {
  return (
    <button
      className={cn(styles.arrow, styles.nextArrow)}
      onClick={onClick}>
      <ArrowShort />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      className={cn(styles.arrow, styles.prevArrow)}
      onClick={onClick}>
      <ArrowShort />
    </button>
  );
}

function TrendingIn() {
  const dispatch = useDispatch()
  const [city, setCity] = useState({
    label: 'New York',
    value: ''
  })
  const [cities, setCities] = useState([])

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          arrows: false
        }
      },
      {
        breakpoint: 900,
        settings: {
          arrows: false,
          infinite: false,
          slidesToShow: 1
        }
      }
    ]
  }

  function handleChange(value) {
    setCity({ ...value, label: value.label.split(', ')[0] })
  }

  const getCities = useCallback((value) => {
    dispatch(collectionsApi.endpoints.getAutocompleteCollections.initiate({ search: value }))
      .then(({data}) => {
        setCities(data)
      })
  }, [dispatch])

  useEffect(function initCities() {
    getCities('')
  }, [getCities])

  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <SectionTitle>
              Trending in
            </SectionTitle>
            <CityPicker
              value={city}
              onChange={handleChange}
              options={cities}
              fetchOptions={getCities} />
          </div>
          <Link href="/marketplace">
            See all
          </Link>
        </div>
      </div>
        <div className={styles.sliderContainer}>
          <Slider {...sliderSettings}>
            {
              items.map(({ img }, index) => (
                <div key={index+img} className={styles.collectionWrapper}>
                  <div className={styles.collection}>
                    <div className={styles.mainImageWrapper}>
                      <Image src={img} layout="fill" objectFit="cover" alt="apartments" />
                    </div>
                    <div className={styles.collectionContent}>
                      <div className={styles.collectionInfo}>
                        <div className={styles.collectionInfoImage}>
                          <Image src="/hero-aparts-small.jpg" width={50} height={50} alt="logo apartments" />
                        </div>
                        <div className={styles.infoContent}>
                          <Typography
                            fontSize={16}
                            fontWeight={600}
                            lHeight={20}
                            color={'#111'}>
                            Collection name
                          </Typography>
                          <Typography
                            fontSize={12}
                            fontWeight={600}
                            lHeight={12}
                            margin="8px 0 0"
                            color={'rgba(55, 65, 81, 0.5)'}>
                            by <span>John Doe</span>
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        fontFamily={'Lato'}
                        fontSize={14}
                        lHeight={22}
                        margin={'14px 0 0'}
                        color={'rgba(55, 65, 81, 0.8)'}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ligula risus sed lacus nec, pellentesque at maecenas. Nisi, odio risus nunc cras. Sollicitudin nulla orci vitae ut turpis vitae neque.
                      </Typography>
                    </div>
                  </div>
                </div>
              ))
            }
          </Slider>
        </div>
    </section>
  )
}

export default TrendingIn