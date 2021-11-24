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
import Select from "../../../components/select/Select";
import Switcher from "../../../components/switcher/Switcher";
import cn from "classnames";
import DoneCongratulation from "../../../components/dialogs/done-congratulation/DoneCongratulation";
import {useGetListingByIdQuery, usePublishListingMutation} from "../../../services/listings";
import SellSteps from "../../../components/dialogs/sell-steps/SellSteps";
import {clamp, getUser} from "../../../utils";
import FullscreenLoader from "../../../components/fullscreen-loader/FullscreenLoader";
import {useSelector} from "react-redux";
import Error from "../../../components/error/Error";
import DollarIcon from '/public/icons/dollar.svg'
import HistoryIcon from '/public/icons/history.svg'
import MediaFile from "../../../components/media-file/MediaFile";

const scheduleOptions = [
  {
    label: 'In 1 day',
    value: '1'
  },
  {
    label: 'In 2 days',
    value: '2'
  },
  {
    label: 'In 3 days',
    value: '3'
  },
  {
    label: 'In 4 days',
    value: '4'
  },
]

const validationSchema = Yup.object({
  price: Yup.number().required('Price is required').positive('Price should be more than zero'),
  copies: Yup.number().positive().integer(),
  royalties: Yup.number().min(0).max(10).integer(),
  scheduleFrequency: Yup.string(),
  scheduleTime: Yup.string(),
  buyerAddress: Yup.string()
})

function SellItem() {
  const router = useRouter()
  const { id } = router.query
  const user = useSelector(state => state.auth.user)
  const { data: listing, isFetching, error } = useGetListingByIdQuery(id, { skip: !id })
  const [publishListing] = usePublishListingMutation()
  const [isDone, setIsDone] = useState(false)
  const [lowBalance, setLowBalance] = useState(false)
  const [sellType, setSellType] = useState('fixed')
  const [marketplaceFee, setMarketplaceFee] = useState(2.5)
  const [switchers, setSwitchers] = useState({
    schedule: false,
    private: false
  })
  const { setValues, errors, touched, ...formik } = useFormik({
    initialValues: {
      price: 1,
      copies: 1,
      royalties: 0,
      scheduleFrequency: '',
      scheduleTime: '',
      buyerAddress: ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  const mounted = useRef(false)
  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id

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

  function handleSubmit(values, { setSubmitting }) {
    const contractApi = require('/services/contract')
    const user = getUser();
    const data = {
      price: values.price,
      copies: values.copies || 1,
      royalties: values.royalties || 0,
      tokenID: listing?.tokenID,
      id
    }

    let promise;

    if (listing?.tokenID === undefined) {
      promise = contractApi.mintAndList(+values.royalties, values.price, user.walletAddress)
      console.log('mint')
    } else if (listing.isPublished) {
      promise = contractApi.editPrice(data.tokenID, data.price, user.walletAddress)
      console.log('update price')
    } else {
      console.log('set on sell')
      promise = contractApi.listForSell(data.tokenID, data.price, user.walletAddress)
    }

    promise
      .then((tokenID) => {
        if (data.tokenID === undefined) {
          data.tokenID = tokenID
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
        setSubmitting(false)
      })
  }

  const handleInitFee = useCallback(() => {
    const contractApi = require('/services/contract')

    contractApi.getMarketplaceFee()
      .then(fee => {
        setMarketplaceFee(+fee)
      })

  }, [])

  useEffect(function initListing() {
    if (listing !== undefined && listing.tokenID !== undefined) {
      setValues(prevState => ({
        ...prevState,
        price: listing.price,
        copies: listing.copies,
        royalties: listing.royalties || 0
      }))
    }
  }, [listing, setValues])

  useEffect(function initFee() {
    if (!mounted.current && user) {
      handleInitFee()
      mounted.current = true
    }
  }, [handleInitFee, user])

  if (error)
    return <Error errorCode={'Listing' + error?.data?.message || 'Deleted' } />
  if (!ownItem && !isFetching)
    return <Error errorCode={'ListingNoAccess' } />

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
                <div className={styles.sellTypes}>
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
                <Input
                  type="number"
                  className={styles.field}
                  name="copies"
                  value={formik.values.copies}
                  onChange={handleCopiesChange}
                  placeholder="e.g. 5"
                  label="Number of copies" />
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
                      <Select
                        className={styles.selectFrequency}
                        name="scheduleFrequency"
                        value={formik.values.scheduleFrequency}
                        onChange={formik.handleChange}
                        options={scheduleOptions}
                        placeholder="In 3 days" />
                      <Typography fontSize={14} color={'rgba(55, 65, 81, 0.8)'} margin={'0 16px 0 30px'}>
                        at
                      </Typography>
                      <Input
                        className={styles.selectFrequency}
                        name="scheduleTime"
                        value={formik.values.scheduleTime}
                        onChange={formik.handleChange}
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
              </div>
              <div className={styles.summaryContainer}>
                <Summary
                  loading={formik.isSubmitting}
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
        imageUrl={listing?.resource === 'Video' ? listing.rawFilePath : listing?.thumbnail}
        message={`Great! You just set on sale - ${listing?.name}`}
        opened={isDone}
        listing={listing}
        onClose={handleCloseCongratulations} />
      <FullscreenLoader opened={isFetching} />
    </main>
  )
}

export default SellItem