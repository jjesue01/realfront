import React, {useState} from 'react'
import styles from './ConfirmCheckout.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import {getMoneyView} from "../../../utils";
import Checkbox from "../../checkbox/Checkbox";
import Button from "../../button/Button";

function ConfirmCheckout({ opened, listing, onClose, onCheckout }) {
  const [checked, setChecked] = useState(false)
  const [isLoading, setLoading] = useState(false)

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
          Complete checkout
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
          </div>
          <div className={styles.tableFooter}>
            <Typography fontWeight={600} fontSize={16} lHeight={20}>
              Total
            </Typography>
            <div className={styles.priceContainer}>
              <div className={styles.price}>
                <Typography fontWeight={600} fontSize={16} lHeight={20} margin={'0 8px 0 0'}>
                  { getMoneyView(listing?.price) }
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          label={<>By checking this box, I agree to Home Jab&apos;s <span>Terms of Service</span></>}
          onChange={toggleCheckbox} />
          <div className={styles.actions}>
            <Button onClick={handleCheckout} disabled={!checked} loading={isLoading}>
              Checkout
            </Button>
          </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmCheckout