import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from './ConfirmCheckout.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import {getMoneyView} from "../../../utils";
import Checkbox from "../../checkbox/Checkbox";
import Button from "../../button/Button";
import {useSelector} from "react-redux";
import MediaFile from "../../media-file/MediaFile";

function ConfirmCheckout({ opened, listing, onClose, onCheckout, maxBid, onFinishAuction }) {
  const user = useSelector(state => state.auth.user)
  const [marketplaceFee, setMarketplaceFee] = useState(2.5)
  const [checked, setChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const mounted = useRef(false)

  const total = !maxBid ? listing?.price : maxBid * (1 - marketplaceFee / 100)

  function toggleCheckbox() {
    setChecked(prevState => !prevState)
  }

  function handleCheckout() {
    setLoading(true)

    if (!!maxBid) {
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

  const handleInitFee = useCallback(() => {
    const contractApi = require('/services/contract')

    contractApi.getMarketplaceFee()
      .then(fee => {
        setMarketplaceFee(+fee)
      })
  }, [])

  useEffect(function initFee() {
    if (!mounted.current && user) {
      handleInitFee()
      mounted.current = true
    }
  }, [handleInitFee, user])

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={handleClose}>
      <div className={styles.dialog}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          { !!maxBid ? 'Finish auction': 'Complete checkout' }
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
                    { getMoneyView(!maxBid ? listing?.price : maxBid) }
                  </Typography>
                </div>
              </div>
            </div>
            {
              !!maxBid &&
              <div className={styles.feeItem}>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  Fees
                </Typography>
                <div className={styles.fee}>
                  <p>Home Jab Fee</p>
                  <div className={styles.feeLine} />
                  <span>{marketplaceFee}%</span>
                </div>
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
          !maxBid &&
          <Checkbox
            className={styles.checkbox}
            checked={checked}
            label={<>By checking this box, I agree to Home Jab&apos;s <span>Terms of Service</span></>}
            onChange={toggleCheckbox} />
        }
        <div className={styles.actions}>
          <Button onClick={handleCheckout} disabled={!checked && !maxBid} loading={isLoading}>
            { !!maxBid ? 'Finish': 'Checkout' }
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmCheckout