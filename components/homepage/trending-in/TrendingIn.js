import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from './TrendingIn.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Link from "next/link";
import ArrowShort from '/public/icons/arrow-short.svg'
import Slider from "react-slick";
import Typography from "../../Typography";
import cn from "classnames";
import CityPicker from "../city-picker/CityPicker";
import {citiesApi} from "../../../services/cities";
import {useDispatch} from "react-redux";
import {useGetPublishedListingsQuery} from "../../../services/listings";
import PhotoItem from "../../photo-item/PhotoItem";

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
  const [city, setCity] = useState({})
  const { data } = useGetPublishedListingsQuery({ city: city.value, limit: 10 }, { skip: !city.value });
  const [cities, setCities] = useState([])
  const mounted = useRef(false)

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: false,
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1100,
        settings: {
          arrows: false,
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 900,
        settings: {
          arrows: false,
          infinite: false,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          arrows: false,
          infinite: false,
          slidesToShow: 1
        }
      }
    ]
  }

  const listingsList = data?.docs?.map(listing => (
    <div key={listing._id} className={styles.listingWrapper}>
      <PhotoItem data={listing} type="full" />
    </div>
  ))

  function handleChange(value) {
    setCity({ ...value, label: value.label.split(', ')[0] })
  }

  const getCities = useCallback((value) => {
    dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value }))
      .then(({data}) => {
        setCities(data)
        if (!mounted.current) {
          setCity({
            label: data[0].label.split(', ')[0],
            value: data[0].value
          })
          mounted.current = true
        }
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
          <Link href={`/marketplace?city=${city.value}`}>
            See all
          </Link>
        </div>
      </div>
        <div className={styles.sliderContainer}>
          {
            listingsList?.length ?
              <Slider {...sliderSettings}>
                { listingsList }
              </Slider>
              :
              <div className={styles.noCollections}>
                <Typography fontWeight={600} fontSize={24} align="center">
                  Seems no listings here...
                </Typography>
              </div>
          }
        </div>
    </section>
  )
}

export default TrendingIn