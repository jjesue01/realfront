import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from './ConfirmCheckout.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import {getBlockchain, getMoneyView} from "../../../utils";
import Checkbox from "../../checkbox/Checkbox";
import Button from "../../button/Button";
import {useDispatch, useSelector} from "react-redux";
import MediaFile from "../../media-file/MediaFile";
import {pushToast} from "../../../features/toasts/toastsSlice";

function ConfirmCheckout({ opened, listing, maxBid, availableBid, onClose, onCheckout, onFinishAuction }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [marketplaceFee, setMarketplaceFee] = useState(2.5)
  const [checked, setChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const mounted = useRef(false)

  const isAuction = listing?.sellMethod === 'Auction'
  const actualBid = availableBid ? availableBid.price : maxBid
  const isReseller = listing?.creator?.ID !== user?._id && listing?.owner === user?._id
  let total = isAuction ?
    actualBid * (1 - marketplaceFee / 100)
    :
    listing?.price

  if (isAuction && isReseller) {
    total -= actualBid * (listing.royalties / 100)
  }

  function toggleCheckbox() {
    setChecked(prevState => !prevState)
  }

  function handleCheckout() {
    setLoading(true)

    if (isAuction) {
      onFinishAuction()
        .then(() => {
          onClose()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.log('buy')
      onCheckout()
        .then(onClose)
        .finally(() => {
          setLoading(false)
        })
    }
  }

  function handleClose() {
    if (isLoading) return;
    setChecked(false)
    onClose()
  }

  const handleInitFee = useCallback(async () => {
    if (!listing?._id) return;
    const blockchain = await getBlockchain();
    const contractApi = require('/services/contract/index')[blockchain]

    contractApi.getMarketplaceFee()
      .then(fee => {
        setMarketplaceFee(+fee)
      })
      .catch(error => {
        dispatch(pushToast({ type: 'error', message: 'Error while getting marketplace fee' }))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing])

  useEffect(function initFee() {
    if (!mounted.current && user && opened) {
      handleInitFee()
      mounted.current = true
    }
  }, [handleInitFee, user, opened])

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={handleClose}>
      <div className={styles.dialog}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          { isAuction ? 'Finish auction': 'Complete checkout' }
        </Typography>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <Typography fontWeight={600} fontSize={14} lHeight={17}>
              Item
            </Typography>
            <Typography fontWeight={600} fontSize={16} lHeight={20}>
              Subtotal
            </Typography>
          </div>
          <div className={styles.tableBody}>
            <div className={styles.tableItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImageWrapper}>
                  <MediaFile
                    src={listing?.thumbnail}
                    alt={listing?.name} />
                </div>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  { listing?.name }
                </Typography>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.price}>
                  <Typography fontWeight={600} fontSize={16} lHeight={20} margin={'0 8px 0 0'}>
                    { getMoneyView(!isAuction ? listing?.price : actualBid) }
                  </Typography>
                </div>
              </div>
            </div>
            {
              isAuction &&
              <div className={styles.feeItem}>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  Fees
                </Typography>
                <div className={styles.fee}>
                  <p>Home Jab Fee</p>
                  <div className={styles.feeLine} />
                  <span>{marketplaceFee}%</span>
                </div>
                {
                  isReseller &&
                  <div className={styles.fee}>
                    <p>Royalty</p>
                    <div className={styles.feeLine} />
                    <span>{listing.royalties}%</span>
                  </div>
                }
              </div>
            }
          </div>
          <div className={styles.tableFooter}>
            <Typography fontWeight={600} fontSize={16} lHeight={20}>
              Total
            </Typography>
            <div className={styles.priceContainer}>
              <div className={styles.price}>
                <Typography fontWeight={600} fontSize={16} lHeight={20} margin={'0 8px 0 0'}>
                  { getMoneyView(total) }
                </Typography>
              </div>
            </div>
          </div>
        </div>
        {
          !isAuction &&
          <Checkbox
            className={styles.checkbox}
            checked={checked}
            label={<>By checking this box, I agree to Home Jab&apos;s <a href="https://homejab.com/terms-and-conditions/" target="_blank" rel="noopener noreferrer">Terms of Service</a></>}
            onChange={toggleCheckbox} />
        }
        <div className={styles.actions}>
          <Button onClick={handleCheckout} disabled={!checked && !maxBid} loading={isLoading}>
            { isAuction ? 'Accept': 'Checkout' }
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmCheckout