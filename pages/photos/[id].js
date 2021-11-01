import React, {useEffect, useState} from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {
  listingsApi,
  useGetListingByIdQuery,
  useGetPublishedListingsQuery,
  usePurchaseListingMutation
} from "../../services/listings";
import {useGetTransactionsByListingIdQuery} from "../../services/transactions";
import {authApi} from "../../services/auth";
import ConfirmCheckout from "../../components/dialogs/confirm-checkout/ConfirmCheckout";
import DoneCongratulation from "../../components/dialogs/done-congratulation/DoneCongratulation";
import FullscreenLoader from "../../components/fullscreen-loader/FullscreenLoader";
import {download, downloadNFT, getIdToken} from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import Error from "../../components/error/Error";

function PhotoDetails({ openLogin }) {
  const dispatch = useDispatch()
  const { query: { id }, ...router } = useRouter()
  const user = useSelector(state => state.auth.user)
  const { data: listing, error, refetch, isFetching } = useGetListingByIdQuery(id, { skip: !id })
  const cityId = listing?.city?.ID;
  const { data: transactions } = useGetTransactionsByListingIdQuery(id, { skip: !id })
  const { data: listings, refetch: refetchListings } = useGetPublishedListingsQuery({
    city: cityId,
    exclude: id,
    limit: 3
  }, { skip: !cityId })
  const isLoading = (!listing || !transactions || !listings) && !error || isFetching
  const [purchaseListing] = usePurchaseListingMutation()
  const [confirmOpened, setConfirmOpened] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id

  function handleViewCollection() {
    router.push(`/cities/${listing?.city?.url}`)
  }

  function toggleConfirmDialog() {
    user ?
      dispatch(listingsApi.endpoints.getListingById.initiate(id, { forceRefetch: true }))
        .then(({ data }) => {
          if (data?.isPublished) {
            setConfirmOpened(prevState => !prevState)
          }
        })
      :
      openLogin()
  }

  function handleCloseConfirm() {
    setConfirmOpened(prevState => !prevState)
  }

  function handleBuy() {
    if (!confirmOpened) return;

    return new Promise((resolve, reject) => {
      const contractApi = require('/services/contract')

      contractApi.getSellData(listing.tokenID, user.walletAddress)
        .then(({ forSell }) => {
          if (forSell) {
            contractApi.buy(listing.tokenID, listing.price, user.walletAddress)
              .then(({ transactionHash: hash }) => {
                console.log(hash)
                setTransactionHash(hash)
                purchaseListing(listing._id)
                  .then(result => {
                    resolve()
                    setIsDone(true)
                    //downloadNFT(listing.ipfs.cid, listing.rawFileName)
                    download(listing.filePath, listing.fileOriginalName)
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
          }
        })
    })
  }

  function handleCloseCongratulations() {
    router.push('/profile')
  }

  useEffect(function () {
    if (getIdToken()) {
      dispatch(authApi.endpoints.getCurrentUser.initiate({}, { subscribe: false, forceRefetch: true }))
    }
    refetch()
    refetchListings()
  }, [dispatch, refetch, id, refetchListings])

  if (listing && !listing?.isPublished && !ownItem)
    return <Error errorCode="ListingDeleted" />

  if (error?.data?.message) {
    const message = error?.data?.message === 'Deleted' ? 'ListingDeleted' : 'ListingNotFound'
    return <Error errorCode={message} />
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - {listing?.name || 'NFT Marketplace'}</title>
      </Head>
      <div className={styles.content}>
        <PhotoInfo
          onLogin={openLogin}
          ownItem={ownItem}
          user={user}
          listing={listing}
          onBuy={toggleConfirmDialog} />
        <TradingHistory data={transactions?.docs} />
        {
          !!listings?.docs?.length &&
          <MoreFromCollection
            onLogin={openLogin}
            user={user}
            data={listings?.docs}
            onViewCollection={handleViewCollection} />
        }
      </div>
      {
        !ownItem &&
        <>
          <ConfirmCheckout
            opened={confirmOpened}
            listing={listing}
            onClose={handleCloseConfirm}
            onCheckout={handleBuy} />
          <DoneCongratulation
            imageUrl={listing?.filePath}
            message={`You just purchased ${listing?.name}. It should be confirmed on the blockhain shortly.`}
            opened={isDone}
            title={'Complete checkout'}
            transactionHash={transactionHash}
            listing={listing}
            onClose={handleCloseCongratulations} />
        </>
      }
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default PhotoDetails