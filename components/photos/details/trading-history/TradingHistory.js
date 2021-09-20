import React, { useState } from "react";
import styles from './TradingHistory.module.sass'
import Typography from "../../../Typography";
import ArrowShort from '/public/icons/arrow-short.svg'
import cn from "classnames";

const tableData = [
  {
    event: 'List',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
  {
    event: 'Sale',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
  {
    event: 'Transfer',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
  {
    event: 'List',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
  {
    event: 'List',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
  {
    event: 'List',
    price: 0.79,
    from: 'xetic456',
    to: 'sdf47',
    date: '2 days ago'
  },
]

function TradingHistory() {
  const [opened, setOpened] = useState(false);

  const rowsList = tableData.map((item, index) => (
    <div key={index} className={styles.tableItem}>
      <div className={cn(styles.col, styles.colEvent)}>
        <p>{ item.event }</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ item.price }</p>
      </div>
      <div className={cn(styles.col, styles.colFrom)}>
        <p>{ item.from }</p>
      </div>
      <div className={cn(styles.col, styles.colTo)}>
        <p>{ item.to }</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{ item.date }</p>
      </div>
    </div>
  ))

  function toggleTable() {
    setOpened(prevState => !prevState)
  }

  return (
    <section className={styles.root}>
      <div className="container">
        <div className={cn(styles.tableWrapper, { [styles.opened]: opened })}>
          <button onClick={toggleTable} className={styles.btnShowTable}>
            <Typography tag="h3" fontSize={20} fontWeight={600}>
              Trading history
            </Typography>
            <ArrowShort />
          </button>
          <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={cn(styles.col, styles.colEvent)}>
                  <p>Event</p>
                </div>
                <div className={cn(styles.col, styles.colPrice)}>
                  <p>Price</p>
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
        </div>
      </div>
    </section>
  )
}

export default TradingHistory