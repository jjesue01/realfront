import React, {useEffect, useState} from "react";
import styles from './Offers.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";
import {getMoneyView, timeAgo} from "../../../../utils";
import {useSelector} from "react-redux";

function Offers({ className, data, isOwner, onFinish, onCancel }) {
  const user = useSelector(state => state.auth.user)
  const [hasBid, setHasBid] = useState(false)

  const tableRows = data.map(item => (
    <div key={item._id} className={styles.tableItem}>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{getMoneyView(item.price)}</p>
      </div>
      <div className={cn(styles.col, styles.colFrom)}>
        <p>{ item.bidder.address }</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{timeAgo(item.createdAt)}</p>
      </div>
    </div>
  ))

  useEffect(function init() {
    if (user) {
      const bid = data.find(({ bidder: { id } }) => id === user?._id)
      if (bid) setHasBid(true)
    }
  }, [data, user])

  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.header}>
        <Typography
          tag="h3"
          fontSize={16}
          fontWeight={600}
          lHeight={20}
          color={'#000'}>
          Offers
        </Typography>
        {
          isOwner &&
          <button onClick={onFinish} className={styles.btnFlat}>
            Finish
          </button>
        }
        {
          hasBid && user && !isOwner &&
          <button onClick={onCancel} className={cn(styles.btnFlat, styles.danger)}>
            Cancel
          </button>
        }
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={cn(styles.col, styles.colPrice)}>
            <p>Price</p>
          </div>
          <div className={cn(styles.col, styles.colFrom)}>
            <p>From</p>
          </div>
          <div className={cn(styles.col, styles.colDate)}>
            <p>Date</p>
          </div>
        </div>
        <div className={styles.tableBody}>
          { tableRows }
        </div>
      </div>
    </div>
  )
}

export default Offers