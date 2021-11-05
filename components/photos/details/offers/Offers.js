import React from "react";
import styles from './Offers.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";
import {getMoneyView, timeAgo} from "../../../../utils";

function Offers({ className }) {
  return (
    <div className={cn(className, styles.root)}>
      <Typography
        tag="h3"
        fontSize={16}
        fontWeight={600}
        lHeight={20}
        color={'#000'}>
        Offers
      </Typography>
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
          <div className={styles.tableItem}>
            <div className={cn(styles.col, styles.colPrice)}>
              <p>{getMoneyView(300)}</p>
            </div>
            <div className={cn(styles.col, styles.colFrom)}>
              <p>0xb2357933a57bec88a1E4aaC469eF9483306F4413</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>{timeAgo(Date.now() - 1000)}</p>
            </div>
          </div>
          <div className={styles.tableItem}>
            <div className={cn(styles.col, styles.colPrice)}>
              <p>{getMoneyView(300)}</p>
            </div>
            <div className={cn(styles.col, styles.colFrom)}>
              <p>0xb2357933a57bec88a1E4aaC469eF9483306F4413</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>{timeAgo(Date.now() - 1000)}</p>
            </div>
          </div>
          <div className={styles.tableItem}>
            <div className={cn(styles.col, styles.colPrice)}>
              <p>{getMoneyView(300)}</p>
            </div>
            <div className={cn(styles.col, styles.colFrom)}>
              <p>0xb2357933a57bec88a1E4aaC469eF9483306F4413</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>{timeAgo(Date.now() - 1000)}</p>
            </div>
          </div>
          <div className={styles.tableItem}>
            <div className={cn(styles.col, styles.colPrice)}>
              <p>{getMoneyView(300)}</p>
            </div>
            <div className={cn(styles.col, styles.colFrom)}>
              <p>0xb2357933a57bec88a1E4aaC469eF9483306F4413</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>{timeAgo(Date.now() - 1000)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offers