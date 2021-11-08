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
import {useGetBidsQuery, useGetTransactionsByListingIdQuery, usePostBidMutation} from "../../services/transactions";
import {authApi} from "../../services/auth";
import ConfirmCheckout from "../../components/dialogs/confirm-checkout/ConfirmCheckout";
import DoneCongratulation from "../../components/dialogs/done-congratulation/DoneCongratulation";
import FullscreenLoader from "../../components/fullscreen-loader/FullscreenLoader";
import {download, getIdToken} from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import Error from "../../components/error/Error";
import MakeOffer from "../../components/dialogs/make-offer/MakeOffer";

const SAMPLE_BIDS = [
  // {
  //   _id: '0',
  //   price: 50,
  //   bidder: { id: '615b21390289776fb92781f6' },
  //   from: '0xb2357933a57bec88a1E4aaC469eF9483306F4413',
  //   createdAt: Date.now() - 20000
  // },
  // {
  //   _id: '1',
  //   price: 40,
  //   bidder: { id: '615b21390289776fb92781f6' },
  //   from: '0xb2357933a57bec88a1E4aaC469eF9483306F4413',
  //   createdAt: Date.now() - 40000
  // },
]

function PhotoDetails({ openLogin }) {
  const dispatch = useDispatch()
  const { query: { id }, ...router } = useRouter()
  const user = useSelector(state => state.auth.user)
  const [postBid] = usePostBidMutation()
  const { data: listing, error, refetch, isFetching } = useGetListingByIdQuery(id, { skip: !id })
  const { data: bids = SAMPLE_BIDS, refetch: refetchBids, isFetching: bidsFetching } = useGetBidsQuery(id, { skip: !id })
  const cityId = listing?.city?.ID;
  const { data: transactions } = useGetTransactionsByListingIdQuery(id, { skip: !id })
  const { data: listings, refetch: refetchListings } = useGetPublishedListingsQuery({
    city: cityId,
    exclude: id,
    limit: 3
  }, { skip: !cityId })
  const isLoading = (!listing || !transactions || !listings) && !error || isFetching || bidsFetching
  const [purchaseListing] = usePurchaseListingMutation()
  const [confirmOpened, setConfirmOpened] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [makeOfferOpened, setMakeOfferOpened] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [listingError, setListingError] = useState(false)
  const [finishAuction, setFinishAuction] = useState(false)

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

  function toggleMakeOffer() {
    setMakeOfferOpened(prevState => !prevState)
  }

  function handleMakeOffer(price) {
    const contractApi = require('/services/contract')

    return new Promise((resolve, reject) => {
      contractApi.approve(price, user.walletAddress)
        .then(() => {
          postBid({ id, price }).unwrap()
            .then((result) => {
              toggleMakeOffer()
              refetchBids()
              resolve()
            })
            .catch(() => {
              reject()
            })
        })
        .catch(() => {
          reject()
        })
    })
  }

  function handleCancelBid() {

  }

  function handleFinishAuction() {
    console.log('yo')
    setFinishAuction(true)
    setConfirmOpened(true)
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
          } else {
            setListingError(true)
          }
        })
        .catch(() => {
          setListingError(true)
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

  if (listing && !listing?.isPublished && !ownItem || listingError)
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
          bids={bids}
          listing={listing}
          onFinishAuction={handleFinishAuction}
          onOffer={toggleMakeOffer}
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
          <DoneCongratulation
            imageUrl={listing?.filePath}
            message={`You just purchased ${listing?.name}. It should be confirmed on the blockhain shortly.`}
            opened={isDone}
            title={'Complete checkout'}
            transactionHash={transactionHash}
            listing={listing}
            onClose={handleCloseCongratulations} />
          <MakeOffer
            title={ bids?.length ? 'Place a bid' : 'Make an offer' }
            btnTitle={ bids?.length ? 'Place bid' : 'Make offer' }
            listing={listing}
            opened={makeOfferOpened}
            onOffer={handleMakeOffer}
            onClose={toggleMakeOffer} />
        </>
      }
      <ConfirmCheckout
        opened={confirmOpened}
        isBid={finishAuction}
        listing={listing}
        onClose={handleCloseConfirm}
        onCheckout={handleBuy} />
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default PhotoDetails