import React from 'react'
import styles from './CollectionInfo.module.sass'
import Image from "next/image";
import Typography from "../../../Typography";
import ButtonCircle from "../../../button-circle/ButtonCircle";
import PenIcon from '/public/icons/pen.svg'
import {useRouter} from "next/router";

function CollectionInfo({ itemsCount, collection }) {
  const router = useRouter()

  function handleEdit() {
    router.push(`/collections/edit/${collection._id}`)
  }

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <Image src="/collection-bg.jpg" layout="fill" objectFit="cover" alt={'New York'} />
      </div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.logoWrapper}>
            <Image src="/collection-logo.jpg" layout="fill" objectFit="cover" alt={'New York'} />
          </div>
          <div className={styles.collectionName}>
            <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
              { collection?.name }
            </Typography>
            <ButtonCircle onClick={handleEdit} className={styles.btnEdit}>
              <PenIcon />
            </ButtonCircle>
          </div>
          <div className={styles.count}>
            <div className={styles.countItem}>
              <p>{ itemsCount }</p>
              <span>items</span>
            </div>
            <div className={styles.vl} />
            <div className={styles.countItem}>
              <p>2</p>
              <span>owners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionInfo