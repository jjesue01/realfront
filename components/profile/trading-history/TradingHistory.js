import React from 'react'
import styles from './TradingHistory.module.sass'
import Typography from "../../Typography";
import cn from "classnames";
import Image from "next/image";
import {getMoneyView, getSortedArray, timeAgo} from "../../../utils";

function TradingHistory({ data = [] }) {

  const rowsList = getSortedArray(data, 'date_high').map((item, index) => (
    <div key={index} className={styles.tableItem}>
      <div className={cn(styles.col, styles.colEvent)}>
        <p>{ item.event }</p>
      </div>
      <div className={cn(styles.col, styles.colItem)}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {
              item?.listingID?.thumbnail &&
              <Image src={item.listingID.thumbnail} layout="fill" objectFit="cover" alt={item?.listingID?.name} />
            }
          </div>
        </div>
        <p>{ item?.listingID?.name }</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ getMoneyView(item.price) }</p>
      </div>
      <div className={cn(styles.col, styles.colQuantity)}>
        <p>{ item.quantity }</p>
      </div>
      <div className={cn(styles.col, styles.colFrom)}>
        <p>{ item.from }</p>
      </div>
      <div className={cn(styles.col, styles.colTo)}>
        <p>{ item.to }</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{ timeAgo(item.date) }</p>
      </div>
    </div>
  ))

  return (
    <div className={styles.root}>
      <Typography tag="h3" fontSize={20} lHeight={24} fontWeight={600}>
        Trading history
      </Typography>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={cn(styles.col, styles.colEvent)}>
            <p>Event</p>
          </div>
          <div className={cn(styles.col, styles.colItem)}>
            <p>Item</p>
          </div>
          <div className={cn(styles.col, styles.colPrice)}>
            <p>Unit price</p>
          </div>
          <div className={cn(styles.col, styles.colQuantity)}>
            <p>Quantity</p>
          </div>
          <div className={cn(styles.col, styles.colFrom)}>
            <p>From</p>
          </div>
          <div className={cn(styles.col, styles.colTo)}>
            <p>To</p>
          </div>
          <div className={cn(styles.col, styles.colDate)}>
            <p>Date</p>
          </div>
        </div>
        <div className={styles.tableBody}>
          { rowsList }
        </div>
      </div>
    </div>
  )
}

export default TradingHistory