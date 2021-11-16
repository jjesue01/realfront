import React, {useEffect, useMemo, useRef, useState} from "react";
import styles from './Offers.module.sass'
import ArrowShort from '/public/icons/arrow-short.svg'
import cn from "classnames";
import {getMoneyView, getSortedArray, timeAgo} from "../../../../utils";
import Typography from "../../../Typography";
import Image from "next/image";
import {useSelector} from "react-redux";
import Button from "../../../button/Button";

function Offers({ className, data = [], isOwner, onCancel, onFinish }) {
  const user = useSelector(state => state.auth.user)
  const [opened, setOpened] = useState(true);
  const hasBid = useMemo(() => {
    let result = false;

    if (data.length && user) {
      const bid = data.find(({ bidder: { id } }) => id === user._id)
      if (bid) result = true
    }

    return result
  }, [data, user])

  const containerRef = useRef()
  const contentRef = useRef()

  const rowsList = data.map((item, index) => (
    <div key={index} className={styles.tableItem}>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ getMoneyView(item.price) }</p>
      </div>
      <div className={cn(styles.col, styles.colDiff)}>
        <p>98,1% below</p>
      </div>
      <div className={cn(styles.col, styles.colExpiration)}>
        <p>in 5 days</p>
      </div>
      <div className={cn(styles.col, styles.colFrom)}>
        <p>{ item.bidder.name }</p>
      </div>
    </div>
  ))

  function toggleTable() {
    setOpened(prevState => !prevState)
  }

  useEffect(function toggleTable() {
    if (containerRef.current) {
      const contentHeight = contentRef.current.clientHeight;

      if (opened) {
        containerRef.current.style.height = contentHeight + 'px'
      } else {
        containerRef.current.style.height = 0
      }
    }
  }, [opened, data, isOwner])


  return (
    <div className={cn(className, styles.root)}>
      <div className={cn(styles.tableWrapper)}>
        <button onClick={toggleTable} className={styles.btnShowTable}>
          <Typography tag="h3" fontSize={20} fontWeight={600}>
            Offers
          </Typography>
          <ArrowShort />
        </button>
        <div ref={containerRef} className={styles.tableContainer}>
          <div ref={contentRef} className={styles.table}>
            {
              !!data.length ?
              <>
                <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colPrice)}>
                    <p>Price</p>
                  </div>
                  <div className={cn(styles.col, styles.colDiff)}>
                    <p>Floor difference</p>
                  </div>
                  <div className={cn(styles.col, styles.colExpiration)}>
                    <p>Expiration</p>
                  </div>
                  <div className={cn(styles.col, styles.colFrom)}>
                    <p>From</p>
                  </div>
                </div>
                <div className={styles.tableBody}>
                  { rowsList }
                </div>
                {
                  hasBid && !isOwner &&
                    <Button onClick={onCancel} className={styles.btnOffer} type="outlined">
                      Cancel
                    </Button>
                }
                {
                  isOwner &&
                  <Button onClick={onFinish} className={styles.btnOffer} type="outlined">
                    Finish
                  </Button>
                }
              </>
              :
              <div className={styles.noOffers}>
                <div className={styles.imageWrapper}>
                  <Image
                    src="/images/hiw-1.png"
                    width={48}
                    height={41}
                    alt="Wallet" />
                </div>
                <Typography fontWeight={600} fontSize={14} lHeight={17} margin={'16px 0 0'}>
                  No offers yet
                </Typography>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offers