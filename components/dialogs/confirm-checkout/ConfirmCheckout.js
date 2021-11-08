import React, {useState} from 'react'
import styles from './ConfirmCheckout.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import {getMoneyView} from "../../../utils";
import Checkbox from "../../checkbox/Checkbox";
import Button from "../../button/Button";

const MARKETPLACE_FEE = 2.5

function ConfirmCheckout({ opened, listing, onClose, onCheckout, isBid = false }) {
  const [checked, setChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const total = !isBid ? listing?.price : listing?.price * (1 - MARKETPLACE_FEE / 100)

  function toggleCheckbox() {
    setChecked(prevState => !prevState)
  }

  function handleCheckout() {
    setLoading(true)
    onCheckout()
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          { isBid ? 'Finish auction': 'Complete checkout' }
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
                  {
                    listing &&
                      <Image
                        src={listing.filePath}
                        layout="fill"
                        objectFit="cover"
                        alt={listing.name} />
                  }
                </div>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  { listing?.name }
                </Typography>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.price}>
                  <Typography fontWeight={600} fontSize={16} lHeight={20} margin={'0 8px 0 0'}>
                    { getMoneyView(listing?.price) }
                  </Typography>
                </div>
              </div>
            </div>
            {
              isBid &&
              <div className={styles.feeItem}>
                <Typography fontWeight={600} fontSize={16} lHeight={20}>
                  Fees
                </Typography>
                <div className={styles.fee}>
                  <p>Home Jab Fee</p>
                  <div className={styles.feeLine} />
                  <span>{MARKETPLACE_FEE}%</span>
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
          !isBid &&
          <Checkbox
            className={styles.checkbox}
            checked={checked}
            label={<>By checking this box, I agree to Home Jab&apos;s <span>Terms of Service</span></>}
            onChange={toggleCheckbox} />
        }
        <div className={styles.actions}>
          <Button onClick={handleCheckout} disabled={!checked && !isBid} loading={isLoading}>
            { isBid ? 'Finish': 'Checkout' }
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmCheckout