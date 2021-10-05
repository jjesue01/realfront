import React from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {useGetListingByIdQuery} from "../../services/listings";

function PhotoDetails() {
  const { query: { id } } = useRouter()
  const { data: listing } = useGetListingByIdQuery(id)
  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - Item name</title>
      </Head>
      <div className={styles.content}>
        <PhotoInfo listing={listing} />
        <TradingHistory />
        <MoreFromCollection />
      </div>
    </main>
  )
}

export default PhotoDetails