import React from 'react'
import styles from './CityInfo.module.sass'
import Image from "next/image";
import Typography from "../../../Typography";
import ButtonCircle from "../../../button-circle/ButtonCircle";
import PenIcon from '/public/icons/pen.svg'
import {useRouter} from "next/router";
import BannerBackground from "../../../banner-background/BannerBackground";

function CityInfo({ itemsCount, city }) {
  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        {
          !!city?.bannerImage ?
            <Image src={city?.bannerImage} layout="fill" objectFit="cover" alt={collection.name} />
            :
            <BannerBackground />
        }
      </div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.logoWrapper}>
            {
              city?.logo &&
              <Image
                src={city.logo}
                layout="fill"
                objectFit="cover"
                alt={city?.name} />
            }
          </div>
          <div className={styles.collectionName}>
            <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
              { city?.name }
            </Typography>
            {/*{*/}
            {/*  isOwner &&*/}
            {/*  <ButtonCircle onClick={handleEdit} className={styles.btnEdit}>*/}
            {/*    <PenIcon />*/}
            {/*  </ButtonCircle>*/}
            {/*}*/}
          </div>
          <div className={styles.count}>
            <div className={styles.countItem}>
              <p>{ itemsCount }</p>
              <span>item{ (itemsCount > 1 || !itemsCount) && 's'}</span>
            </div>
            {/*<div className={styles.vl} />*/}
            {/*<div className={styles.countItem}>*/}
            {/*  <p>2</p>*/}
            {/*  <span>owners</span>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CityInfo