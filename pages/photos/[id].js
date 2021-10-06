import React from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {useGetListingByIdQuery, useGetListingsQuery} from "../../services/listings";
import {useGetTransactionsByListingIdQuery} from "../../services/transactions";

function PhotoDetails() {
  const { query: { id }, ...router } = useRouter()
  const { data: listing } = useGetListingByIdQuery(id)
  const collectionId = listing?.collections?.ID;
  const { data: transactions } = useGetTransactionsByListingIdQuery(id)
  const { data: listings } = useGetListingsQuery({ collection: collectionId })

  function handleViewCollection() {
    router.push(`/collections/${collectionId}`)
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - {listing?.name}</title>
      </Head>
      <div className={styles.content}>
        <PhotoInfo listing={listing} />
        <TradingHistory data={transactions?.docs} />
        <MoreFromCollection data={listings?.docs} onViewCollection={handleViewCollection} />
      </div>
    </main>
  )
}

export default PhotoDetails