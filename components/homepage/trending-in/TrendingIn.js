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
import {collectionsApi, useGetUserCollectionsQuery} from "../../../services/collections";
import {useDispatch} from "react-redux";
import {useGetListingsQuery, useGetPublishedListingsQuery} from "../../../services/listings";
import PhotoItem from "../../photo-item/PhotoItem";

const items = [
  {
    img: '/trending-1.jpg',
  },

]

const NEW_YORK_ID = '61718d8ecf5a3badf5b3703c'

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
    value: NEW_YORK_ID
  })
  const { data } = useGetPublishedListingsQuery();
  const [cities, setCities] = useState([])

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

  // const collectionsList = data?.docs?.map(({ name, _id, logoImage, description }, index) => (
  //   <div key={_id} className={styles.collectionWrapper}>
  //     <div className={styles.collection}>
  //       <div className={styles.mainImageWrapper}>
  //         <Image src={logoImage} layout="fill" objectFit="cover" alt="apartments" />
  //       </div>
  //       <div className={styles.collectionContent}>
  //         <div className={styles.collectionInfo}>
  //           <div className={styles.collectionInfoImage}>
  //             <Image src={logoImage} width={50} height={50} alt="logo apartments" />
  //           </div>
  //           <div className={styles.infoContent}>
  //             <Typography
  //               fontSize={16}
  //               fontWeight={600}
  //               lHeight={20}
  //               color={'#111'}>
  //               { name }
  //             </Typography>
  //             <Typography
  //               fontSize={12}
  //               fontWeight={600}
  //               lHeight={12}
  //               margin="8px 0 0"
  //               color={'rgba(55, 65, 81, 0.5)'}>
  //               by <span>John Doe</span>
  //             </Typography>
  //           </div>
  //         </div>
  //         <Typography
  //           fontFamily={'Lato'}
  //           fontSize={14}
  //           lHeight={22}
  //           margin={'14px 0 0'}
  //           color={'rgba(55, 65, 81, 0.8)'}>
  //           { description }
  //         </Typography>
  //       </div>
  //     </div>
  //   </div>
  // ))

  const listingsList = data?.docs?.map(listing => (
    <div key={listing._id} className={styles.listingWrapper}>
      <PhotoItem data={listing} type="full" />
    </div>
  ))

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
                  Seems no collections here...
                </Typography>
              </div>
          }
        </div>
    </section>
  )
}

export default TrendingIn