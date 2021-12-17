import React, {useEffect, useMemo, useState} from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";
import Head from "next/head";
import {useRouter} from "next/router";
import {
  listingsApi, useDepublishListingMutation, useDownloadNFTMutation, useFinishAuctionMutation,
  useGetListingByIdQuery,
  useGetPublishedListingsQuery,
  usePurchaseListingMutation
} from "../../services/listings";
import {
  useDeleteBidMutation,
  useGetBidsQuery,
  useGetTransactionsByListingIdQuery,
  usePostBidMutation
} from "../../services/transactions";
import {authApi} from "../../services/auth";
import ConfirmCheckout from "../../components/dialogs/confirm-checkout/ConfirmCheckout";
import DoneCongratulation from "../../components/dialogs/done-congratulation/DoneCongratulation";
import FullscreenLoader from "../../components/fullscreen-loader/FullscreenLoader";
import {download, getIdToken} from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import Error from "../../components/error/Error";
import MakeOffer from "../../components/dialogs/make-offer/MakeOffer";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog/ConfirmationDialog";

function PhotoDetails({ openLogin }) {
  const dispatch = useDispatch()
  const { query: { id }, ...router } = useRouter()
  const user = useSelector(state => state.auth.user)
  const [postBid] = usePostBidMutation()
  const [deleteBid] = useDeleteBidMutation()
  const [purchaseListing] = usePurchaseListingMutation()
  const [finishAuction] = useFinishAuctionMutation()
  const [depublishListing] = useDepublishListingMutation()
  const { data: listing, error, refetch, isFetching } = useGetListingByIdQuery(id, { skip: !id })
  const { data: bidsData, refetch: refetchBids, isFetching: bidsFetching } = useGetBidsQuery(id, { skip: !id })
  const bids = bidsData?.docs || []
  const cityId = listing?.city?.ID;
  const { data: transactions } = useGetTransactionsByListingIdQuery(id, { skip: !id })
  const { data: listings, refetch: refetchListings } = useGetPublishedListingsQuery({
    city: cityId,
    exclude: id,
    limit: 3
  }, { skip: !cityId })
  const [manualLoading, setLoading] = useState(false)
  const isLoading = (!listing || !transactions || !listings) && !error || isFetching || bidsFetching || manualLoading
  const [confirmOpened, setConfirmOpened] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [makeOfferOpened, setMakeOfferOpened] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [listingError, setListingError] = useState(false)
  const [cancelConfirmationOpened, setCancelConfirmation] = useState(false)

  const maxBid = useMemo(() => {
    if (bidsData?.docs?.length) {
      return Math.max.apply(null, bidsData?.docs.map(({ price }) => price))
    }
    return 0
  }, [bidsData])
  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id

  function handleViewCollection() {
    router.push(`/cities/${listing?.city?.url}`)
  }

  function toggleConfirmDialog() {
    validatePublish()
      .then(() => {
        setConfirmOpened(prevState => !prevState)
      })
  }

  function validatePublish() {
    return new Promise(resolve => {
      user ?
        dispatch(listingsApi.endpoints.getListingById.initiate(id, { forceRefetch: true }))
          .then(({ data }) => {
            if (data?.isPublished) {
              resolve()
            }
          })
        :
        openLogin()
    })
  }

  function handleCloseConfirm() {
    setConfirmOpened(prevState => !prevState)
  }

  function toggleMakeOffer() {
    validatePublish()
      .then(() => {
        setMakeOfferOpened(prevState => !prevState)
      })
  }

  function handleCloseMakeOffer() {
    setMakeOfferOpened(prevState => !prevState)
  }

  function handleMakeOffer(price) {
    const contractApi = require('/services/contract')

    return new Promise((resolve, reject) => {
      contractApi.bidOnAuction(listing.tokenID, price, user.walletAddress)
        .then((bidIndex) => {
          postBid({ id, price, bidIndex: bids.length.toString() }).unwrap()
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

  function toggleCancelConfirmation() {
    setCancelConfirmation(prevState => !prevState)
  }

  function handleCancelBid() {
    const contract = require('/services/contract')
    const bid = bids.find(({ bidder: { id } }) => id === user._id)

    if (bid) {
      setLoading(true)
      contract.disapprove(user.walletAddress)
        .then(() => {
          deleteBid({ id: bid._id }).unwrap()
            .then(() => {
              refetchBids()
              setLoading(false)
            })
            .catch(() => {

            })
        })
        .catch(() => {

        })
    }
  }

  function handleCancelListing() {
    const contract = require('/services/contract')

    setLoading(true)
    contract.revokeSell(listing.tokenID, user.walletAddress)
      .then(() => depublishListing(id).unwrap())
      .then(() => {
        refetch()
        setLoading(false)
      })

  }

  function validateSell() {
    const contract = require('/services/contract')

    return new Promise((resolve, reject) => {
      contract.getSellData(listing.tokenID, user.walletAddress)
        .then(({ forSell }) => {
          if (forSell) {
            resolve()
          }
        })
    })
  }

  async function getAvailableBid() {
    const contract = require('/services/contract')
    for (const bid of bids) {
      const bidderWalletAddress = bid.bidder.address;

      const bidderBalance = +await contract.balanceOf(bidderWalletAddress)
      const allowance = +await contract.allowance(bidderWalletAddress)

      if (bidderBalance >= listing.bid.highest && allowance <= bidderBalance && allowance >= listing.bid.highest) {
        return bid
      }
    }
    return null
  }

  function handleFinishAuction() {
    return new Promise(async (resolve, reject) => {
      const contract = require('/services/contract')

      const bid = await getAvailableBid();

      if (bid) {
        contract.acceptBid(listing.tokenID, bid.bidIndex, user.walletAddress)
          .then(({ transactionHash: hash }) => {
            finishAuction(id).unwrap()
              .then(() => {
                console.log(hash)
                setTransactionHash(hash)
                resolve()
                setIsDone(true)
              })
              .catch(() => {
                reject()
              })
          })
          .catch(() => {
            reject()
          })
      } else {
        console.error('No available bids')
      }
    })
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

                    let fileName = listing.nfts[0].ipfs.file.originalName

                    if (listing.resource.includes('360'))
                      fileName = listing.name + '.zip'

                    download(process.env.NEXT_PUBLIC_API_URL + `listings/${id}/download`, fileName)

                    // downloadNFT(listing.ipfs.cid, listing.rawFileName)
                    // listing.nfts.forEach(({ ipfs: { file: { originalName, path } } }) => {
                    //   download(path, originalName)
                    // })
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
          maxBid={listing?.bid?.highest}
          listing={listing}
          onCancelBid={toggleCancelConfirmation}
          onCancelListing={handleCancelListing}
          onFinishAuction={toggleConfirmDialog}
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
          <MakeOffer
            title={ listing?.bid?.endDate || bids?.length  ? 'Place a bid' : 'Make an offer' }
            btnTitle={ listing?.bid?.endDate || bids?.length  ? 'Place bid' : 'Make offer' }
            listing={listing}
            maxBidPrice={ listing?.bid?.highest }
            opened={makeOfferOpened}
            onOffer={handleMakeOffer}
            onClose={handleCloseMakeOffer} />
          <ConfirmationDialog
            opened={cancelConfirmationOpened}
            onClose={toggleCancelConfirmation}
            onSubmit={handleCancelBid}
            btnSubmitTitle={'Cancel'}
            title={'Cancel offer'}
            message={'Do you really what to cancel your offer?'} />
        </>
      }
      <DoneCongratulation
        imageUrl={listing?.resource === 'Video' ? listing?.nfts[0]?.ipfs?.file?.path : listing?.thumbnail}
        message={`You just ${ maxBid ? 'sold' :  'purchased' } ${listing?.name}. It should be confirmed on the blockhain shortly.`}
        opened={isDone}
        title={'Complete checkout'}
        transactionHash={transactionHash}
        listing={listing}
        onClose={handleCloseCongratulations} />
      <ConfirmCheckout
        opened={confirmOpened}
        maxBid={maxBid}
        listing={listing}
        onClose={handleCloseConfirm}
        onFinishAuction={handleFinishAuction}
        onCheckout={handleBuy} />
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default PhotoDetails