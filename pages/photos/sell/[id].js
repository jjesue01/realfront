import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from '../../../styles/Sell.module.sass'
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import ArrowShortIcon from '/public/icons/arrow-short.svg'
import Typography from "../../../components/Typography";
import * as Yup from "yup";
import {useFormik} from "formik";
import Summary from "../../../components/sell/summary/Summary";
import Input from "../../../components/input/Input";
import Switcher from "../../../components/switcher/Switcher";
import cn from "classnames";
import DoneCongratulation from "../../../components/dialogs/done-congratulation/DoneCongratulation";
import {useGetListingByIdQuery, usePublishListingMutation} from "../../../services/listings";
import SellSteps from "../../../components/dialogs/sell-steps/SellSteps";
import {
  clamp,
  dateFromESTtoISOString,
  dateToString, getBlockchain,
  getESTDateTimeFromISO, getFormattedDate,
  getFormattedEndTime,
  getUser,
} from "../../../utils";
import FullscreenLoader from "../../../components/fullscreen-loader/FullscreenLoader";
import {useDispatch, useSelector} from "react-redux";
import Error from "../../../components/error/Error";
import DollarIcon from '/public/icons/dollar.svg'
import HistoryIcon from '/public/icons/history.svg'
import MediaFile from "../../../components/media-file/MediaFile";
import {DAY} from "../../../fixtures";
import {pushToast} from "../../../features/toasts/toastsSlice";
import {getConfig} from "../../../app-config";

function SellItem() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const user = useSelector(state => state.auth.user)
  const { data: listing, isFetching, error } = useGetListingByIdQuery(id, { skip: !id })
  const [publishListing] = usePublishListingMutation()
  const [isDone, setIsDone] = useState(false)
  const [lowBalance, setLowBalance] = useState(false)
  const [sellType, setSellType] = useState('fixed')
  const [marketplaceFee, setMarketplaceFee] = useState(2.5)
  const [blockchain, setBlockchain] = useState('')
  const [switchers, setSwitchers] = useState({
    schedule: false,
    private: false
  })
  const { setValues, errors, touched, ...formik } = useFormik({
    initialValues: {
      price: 1,
      copies: 1,
      royalties: 0,
      scheduleFrequency: dateToString(new Date(Date.now() + DAY)),
      scheduleTime: '6:00 PM',
      buyerAddress: '',
      auctionEndDate: dateToString(new Date(Date.now() + 7 * DAY)),
      auctionEndTime: '6:00 PM'
    },
    validate: handleValidate,
    onSubmit: handleSubmit
  });

  const mounted = useRef(false)
  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id

  function handleValidate(values) {
    const errors = {}

    if (!values.price)
      errors.price = 'Price is required'
    else if (values.price < 0)
      error.price = 'Price should be more than zero'

    const currentDateStamp = new Date().getTime()
    const scheduledDateStamp = new Date(dateFromESTtoISOString(values.scheduleFrequency, values.scheduleTime)).getTime()

    if (sellType === 'fixed' && switchers.schedule && scheduledDateStamp <= currentDateStamp)
      errors.scheduleTime = 'Please, select future date'

    const auctionEndDateStamp = new Date(dateFromESTtoISOString(values.auctionEndDate, values.auctionEndTime)).getTime()

    if (sellType === 'auction' && auctionEndDateStamp <= currentDateStamp)
      errors.auctionEndTime = 'Please, select future date'

    return errors
  }

  function handleSwitcherChange({ target: { name, value } }) {
    setSwitchers(prevSwitchers => ({
      ...prevSwitchers,
      [name]: value
    }))
  }

  function handlePriceChange({ target: { value } }) {
    let result = Math.abs(+parseFloat(+value || 0).toFixed(2))
    if (parseFloat(value) === 0) result = 0
    if (value === '') result = ''

    setValues(prevState => ({
      ...prevState,
      price: result
    }))
  }

  function handleCopiesChange({ target: { value } }) {
    let result = clamp(parseInt(value), 1, 100) || 1
    if (parseInt(value) === 0) result = 1
    if (value === '') result = ''

    setValues(prevState => ({
      ...prevState,
      copies: result
    }))
  }

  function handleRoyaltiesChange({ target: { value } }) {
    let result = clamp(parseInt(value), 0, 10) || 0
    if (parseInt(value) === 0) result = 0
    if (value === '') result = ''

    setValues(prevState => ({
      ...prevState,
      royalties: result
    }))
  }

  function handleTypeChange(type) {
    return function () {
      if (listing?.activeDate) return;
      setSellType(type)
    }
  }

  function handleCloseCongratulations() {
    router.push(`/photos/${id}`)
  }

  function toggleSellSteps() {
    setLowBalance(prevState => !prevState)
  }

  function handleDone() {
    toggleSellSteps()
    setIsDone(true)
  }

  function getCongratulationMessage() {
    const dateStr = dateFromESTtoISOString(formik.values.scheduleFrequency, formik.values.scheduleTime)

    if (switchers.schedule)
      return `Your listing ${listing?.name} will be set for sale on\n${getFormattedEndTime(dateStr)}`

    return `Great! You just set on sale - ${listing?.name}`
  }

  function handleSubmit(values, { setSubmitting }) {
    const contractApi = require('/services/contract/index')[listing.blockchain]
    const user = getUser();

    console.log(contractApi)

    const data = {
      price: values.price,
      copies: values.copies || 1,
      tokenID: listing?.tokenID,
      id,
      sellMethod: 'Fixed Price'
    }

    const isoString = dateFromESTtoISOString(values.auctionEndDate, values.auctionEndTime)
    const endTime = sellType === 'auction' ? new Date(isoString).getTime() : 0

    if (sellType === 'auction') {
      data.sellMethod = 'Auction';
      data.endDate = isoString
    }

    if (switchers.schedule) {
      data.activeDate = dateFromESTtoISOString(values.scheduleFrequency, values.scheduleTime)
    }

    let promise;

    if (listing?.tokenID === undefined) {
      promise = contractApi.mintAndList(+values.royalties, values.price, endTime, user.walletAddress)
      console.log('mint')
    } else if (listing.isPublished || listing?.activeDate) {
      promise = data.price !== listing.price ?
        contractApi.editPrice(data.tokenID, data.price, user.walletAddress)
        :
        Promise.resolve()
      console.log('update price')
    } else if (sellType === 'fixed') {
      console.log('set on sell')
      promise = contractApi.listForSell(data.tokenID, data.price, user.walletAddress)
    } else {
      promise = contractApi.listForAuction(data.tokenID, data.price, endTime, user.walletAddress)
    }

    promise
      .then((tokenID) => {
        if (data.tokenID === undefined) {
          data.tokenID = tokenID
          data.royalties = values.royalties || 0
        }

        publishListing(data).unwrap()
          .then(result => {
            console.log(result)
            setIsDone(true)
          })
          .catch(error => {
            console.log(error)
            setSubmitting(false)
          })
      })
      .catch(error => {
        console.log(error)
        // let errorMessage = 'Error while executing contract method'
        //
        // if (error?.code === 4001)
        //   errorMessage = 'User cancelled sell flow'
        //
        // dispatch(pushToast())
        setSubmitting(false)
      })
  }

  const handleInitFee = useCallback(async () => {
    if (!listing) return;
    const blockchain = await getBlockchain();
    const contractApi = require('/services/contract/index')[blockchain]

    console.log('init fee')

    contractApi.getMarketplaceFee()
      .then(fee => {
        console.log(fee)
        setMarketplaceFee(+fee)
      })
      .catch(error => {
        dispatch(pushToast({ type: 'error', message: 'Error while getting marketplace fee' }))
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing])

  useEffect(function initListing() {
    if (listing !== undefined && listing.tokenID !== undefined) {
      setValues(prevState => {
        const initialValues = {
          ...prevState,
          price: listing.price,
          copies: listing.copies,
          royalties: listing.royalties || 0
        }

        if (listing?.activeDate) {
          const { date, time } = getESTDateTimeFromISO(listing.activeDate)
          initialValues.scheduleFrequency = date
          initialValues.scheduleTime = time
        }

        return initialValues
      })
      setSwitchers({
        schedule: !!listing?.activeDate,
        private: false
      })
    }
  }, [listing, setValues, setSwitchers])

  useEffect(function initFee() {
    if (!mounted.current && user && listing) {
      handleInitFee()
      getBlockchain().then(blockchain => {
        const currentNetwork = listing.blockchain === 'polygon' ?
          getConfig().POLYGON_NETWORK
          :
          getConfig().BSC_NETWORK

        if (listing?.blockchain !== blockchain) {
          dispatch(pushToast({
            type: 'info',
            message: `Please use ${currentNetwork.chainName} network for this NFT`
          }))
        }

        setBlockchain(blockchain)
      })
      mounted.current = true
    }
  }, [handleInitFee, user, listing, dispatch])

  if (error)
    return <Error errorCode={'Listing' + error?.data?.message || 'Deleted' } />

  if (!ownItem && !isFetching)
    return <Error errorCode={'ListingNoAccess'} />

  if (listing && listing.isPublished)
    return <Error errorCode={'PageNotFound'} />

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - Sell {listing?.name}</title>
      </Head>
      <div className="border-wrapper">
        <div className={styles.nav}>
          <div className="container">
            <Link href={`/photos/${id}`} passHref>
              <a className={styles.goBack}>
                <div className={styles.arrowContainer}>
                  <ArrowShortIcon />
                </div>
                <div className={styles.collectionImageContainer}>
                  <MediaFile
                    src={listing?.thumbnail}
                    alt={listing?.name} />
                </div>
                <div className={styles.collectionInfo}>
                  <Typography
                    fontSize={12}
                    fontWeight={600}
                    lHeight={15}
                    color={'#878D97'}>
                    Item
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    lHeight={17}
                    color={'#111111'}
                    margin={'5px 0 0'}>
                    { listing?.name }
                  </Typography>
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div className="container">
          <div className={styles.content}>
            <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
              Select your sell method
            </Typography>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
              <div className={styles.fieldsContainer}>
                <div className={cn(styles.sellTypes, { [styles.disabled]: listing?.activeDate })}>
                  <button
                    type="button"
                    onClick={handleTypeChange('fixed')}
                    className={cn(styles.sellType, { [styles.sellTypeActive]: sellType === 'fixed' })}>
                    <DollarIcon />
                    <Typography tag="span" fontSize={16} fontWeight={600} lHeight={20} margin={'13px 0 0'}>
                      Fixed Price
                    </Typography>
                  </button>
                  <button
                    type="button"
                    onClick={handleTypeChange('auction')}
                    className={cn(styles.sellType, { [styles.sellTypeActive]: sellType === 'auction' })}>
                    <HistoryIcon />
                    <Typography tag="span" fontSize={16} fontWeight={600} lHeight={20} margin={'13px 0 0'}>
                      Timed Auction
                    </Typography>
                  </button>
                </div>
                {
                  sellType === 'fixed' ?
                    <>
                      <Input
                        className={styles.field}
                        type="price"
                        name="price"
                        value={formik.values.price}
                        onChange={handlePriceChange}
                        placeholder="e.g. 1"
                        required
                        step={0.01}
                        subLabel="Will be on sale until you transfer this item or cancel it."
                        error={errors.price && touched.price}
                        errorText={errors.price}
                        label="Price*" />
                      {/*<Input*/}
                      {/*  type="number"*/}
                      {/*  className={styles.field}*/}
                      {/*  name="copies"*/}
                      {/*  value={formik.values.copies}*/}
                      {/*  onChange={handleCopiesChange}*/}
                      {/*  placeholder="e.g. 5"*/}
                      {/*  label="Number of copies" />*/}
                      {
                        !listing?.tokenID &&
                        <Input
                          type="number"
                          className={cn(styles.field)}
                          name="royalties"
                          value={formik.values.royalties}
                          onChange={handleRoyaltiesChange}
                          placeholder="e.g. 10"
                          iconRight={<span className={styles.percentIcon}>%</span>}
                          subLabel="Suggested: 0%, 3%, 5%, 7%. Maximum is 10%"
                          label="Royalties" />
                      }
                      <div className={styles.additionalFields}>
                        <div className={styles.addField}>
                          <Switcher
                            className={styles.switcher}
                            name="schedule"
                            value={switchers.schedule}
                            onChange={handleSwitcherChange} />
                          <p className={styles.fieldLabel}>
                            Schedule for a future time
                          </p>
                          <p className={styles.fieldSubLabel}>
                            You can schedule this listing to only be buyable at a future date.
                          </p>
                          <div className={cn(styles.scheduleRow, { [styles.disabled]: !switchers.schedule })}>
                            <Input
                              type="date"
                              className={styles.selectFrequency}
                              name="scheduleFrequency"
                              value={formik.values.scheduleFrequency}
                              onChange={formik.handleChange}
                              placeholder="Date" />
                            <Typography fontSize={14} color={'rgba(55, 65, 81, 0.8)'} margin={'0 16px 16px 30px'}>
                              at
                            </Typography>
                            {/*{ /(((0[1-9])|(1[0-2])):([0-5])(0|5)\s(A|P)M)/g }*/}
                            <Input
                              type="time"
                              className={styles.selectTime}
                              name="scheduleTime"
                              value={formik.values.scheduleTime}
                              onChange={formik.handleChange}
                              error={errors.scheduleTime && touched.scheduleTime}
                              errorText={errors.scheduleTime}
                              placeholder="6:00 PM" />
                          </div>
                        </div>
                        <div className={styles.addField}>
                          <Switcher
                            className={styles.switcher}
                            name="private"
                            value={switchers.private}
                            onChange={handleSwitcherChange} />
                          <Input
                            className={cn(styles.input, { [styles.disabledInput]: !switchers.private })}
                            name="buyerAddress"
                            value={formik.values.buyerAddress}
                            onChange={formik.handleChange}
                            placeholder="Buyer address, e.g. 0x489423..."
                            subLabel="You can keep your listing public, or your can specify one address that's allowed to buy it."
                            label="Privacy" />
                        </div>
                      </div>
                    </>
                    :
                    <>
                      <Input
                        className={styles.field}
                        type="price"
                        name="price"
                        value={formik.values.price}
                        onChange={handlePriceChange}
                        placeholder="Amount"
                        required
                        step={0.01}
                        error={errors.price && touched.price}
                        errorText={errors.price}
                        label="Starting price*" />
                      <div className={cn(styles.scheduleRow)}>
                        <Input
                          type="date"
                          className={styles.selectFrequency}
                          name="auctionEndDate"
                          label="Auction ends"
                          value={formik.values.auctionEndDate}
                          onChange={formik.handleChange}
                          placeholder="Date" />
                        <Typography fontSize={14} color={'rgba(55, 65, 81, 0.8)'} margin={'0 16px 16px 30px'}>
                          at
                        </Typography>
                        {/*{ /(((0[1-9])|(1[0-2])):([0-5])(0|5)\s(A|P)M)/g }*/}
                        <Input
                          type="time"
                          className={styles.selectTime}
                          name="auctionEndTime"
                          value={formik.values.auctionEndTime}
                          onChange={formik.handleChange}
                          error={errors.auctionEndTime && touched.auctionEndTime}
                          errorText={errors.auctionEndTime}
                          placeholder="6:00 PM" />
                      </div>
                      {
                        !listing?.tokenID &&
                          <Input
                            type="number"
                            className={cn(styles.field)}
                            name="royalties"
                            value={formik.values.royalties}
                            onChange={handleRoyaltiesChange}
                            placeholder="e.g. 10"
                            iconRight={<span className={styles.percentIcon}>%</span>}
                            subLabel="Suggested: 0%, 3%, 5%, 7%. Maximum is 10%"
                            label="Royalties" />
                      }
                    </>
                }
              </div>
              <div className={styles.summaryContainer}>
                <Summary
                  loading={formik.isSubmitting}
                  listing={listing}
                  blockchain={blockchain}
                  marketplaceFee={marketplaceFee}
                  royalty={listing?.tokenID && listing?.creator?.ID !== user?._id ? formik.values.royalties : 0} />
              </div>
            </form>
          </div>
        </div>
      </div>
      <SellSteps
        opened={lowBalance}
        onClose={toggleSellSteps}
        onDone={handleDone} />
      <DoneCongratulation
        imageUrl={listing?.resource === 'Video' ? listing?.assets?.[0]?.path : listing?.thumbnail}
        message={getCongratulationMessage()}
        opened={isDone}
        listing={listing}
        onClose={handleCloseCongratulations} />
      <FullscreenLoader opened={isFetching} />
    </main>
  )
}

export default SellItem