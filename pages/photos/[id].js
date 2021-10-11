import React, {useState} from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {
  useGetListingByIdQuery,
  useGetListingsQuery,
  useGetPublishedListingsQuery,
  usePurchaseListingMutation
} from "../../services/listings";
import {useGetTransactionsByListingIdQuery} from "../../services/transactions";
import {useGetCurrentUserQuery} from "../../services/auth";
import ConfirmCheckout from "../../components/dialogs/confirm-checkout/ConfirmCheckout";
import DoneCongratulation from "../../components/dialogs/done-congratulation/DoneCongratulation";

function PhotoDetails() {
  const { query: { id }, ...router } = useRouter()
  const { data: listing } = useGetListingByIdQuery(id)
  const collectionId = listing?.collections?.ID;
  const { data: user } = useGetCurrentUserQuery()
  const { data: transactions } = useGetTransactionsByListingIdQuery(id)
  const { data: listings } = useGetPublishedListingsQuery({ collection: collectionId, limit: 3 })
  const [purchaseListing] = usePurchaseListingMutation()
  const [confirmOpened, setConfirmOpened] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id


  function handleViewCollection() {
    router.push(`/collections/${collectionId}`)
  }

  function toggleConfirmDialog() {
    setConfirmOpened(prevState => !prevState)
  }

  function handleBuy() {
    return new Promise((resolve, reject) => {
      const contractApi = require('/services/contract')

      contractApi.buy(listing.tokenID, listing.price, user.walletAddress)
        .then(() => {
          purchaseListing(listing._id)
            .then(result => {
              resolve()
              toggleConfirmDialog()
              setIsDone(true)
            })
            .catch(error => {
              console.log(error)
              reject()
            })
        })
        .catch(error => {
          console.log(error)
          reject()
        })
    })
  }

  function handleCloseCongratulations() {
    router.push('/profile')
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - {listing?.name}</title>
      </Head>
      <div className={styles.content}>
        <PhotoInfo ownItem={ownItem} user={user} listing={listing} onBuy={toggleConfirmDialog} />
        <TradingHistory data={transactions?.docs} />
        <MoreFromCollection user={user} data={listings?.docs} onViewCollection={handleViewCollection} />
      </div>
      {
        !ownItem &&
        <>
          <ConfirmCheckout
            opened={confirmOpened}
            listing={listing}
            onClose={toggleConfirmDialog}
            onCheckout={handleBuy} />
          <DoneCongratulation
            imageUrl={listing?.filePath}
            message={`You just purchased ${listing?.name}. It should be confirmed on the blockhain shortly.`}
            opened={isDone}
            onClose={handleCloseCongratulations} />
        </>
      }
    </main>
  )
}

export default PhotoDetails