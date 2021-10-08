import React from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {useGetListingByIdQuery, useGetListingsQuery, useGetPublishedListingsQuery} from "../../services/listings";
import {useGetTransactionsByListingIdQuery} from "../../services/transactions";
import {useGetCurrentUserQuery} from "../../services/auth";

function PhotoDetails() {
  const { query: { id }, ...router } = useRouter()
  const { data: listing } = useGetListingByIdQuery(id)
  const collectionId = listing?.collections?.ID;
  const { data: user } = useGetCurrentUserQuery()
  const { data: transactions } = useGetTransactionsByListingIdQuery(id)
  const { data: listings } = useGetListingsQuery({ collection: collectionId, limit: 3 })
  //const { data: listings } = useGetPublishedListingsQuery({ collection: collectionId, limit: 3 })

  function handleViewCollection() {
    router.push(`/collections/${collectionId}`)
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - {listing?.name}</title>
      </Head>
      <div className={styles.content}>
        <PhotoInfo user={user} listing={listing} />
        <TradingHistory data={transactions?.docs} />
        <MoreFromCollection user={user} data={listings?.docs} onViewCollection={handleViewCollection} />
      </div>
    </main>
  )
}

export default PhotoDetails