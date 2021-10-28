import React, {useEffect, useRef, useState} from "react";
import styles from './TradingHistory.module.sass'
import Typography from "../../../Typography";
import ArrowShort from '/public/icons/arrow-short.svg'
import cn from "classnames";
import {getMoneyView, getSortedArray, timeAgo} from "../../../../utils";

function TradingHistory({ data = [] }) {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef()
  const contentRef = useRef()

  const rowsList = getSortedArray(data, 'date_high').map((item, index) => (
    <div key={index} className={styles.tableItem}>
      <div className={cn(styles.col, styles.colEvent)}>
        <p>{ item.event }</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ getMoneyView(item.price) }</p>
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
  }, [opened])

  if (!data.length)
    return (
      <section className={styles.root}>
        <div className="container">
          <Typography tag="h3" fontSize={20} fontWeight={600}>
            No transactions
          </Typography>
        </div>
      </section>
    )

  return (
    <section className={styles.root}>
      <div className="container">
        <div className={cn(styles.tableWrapper)}>
          <button onClick={toggleTable} className={styles.btnShowTable}>
            <Typography tag="h3" fontSize={20} fontWeight={600}>
              Trading history
            </Typography>
            <ArrowShort />
          </button>
          <div ref={containerRef} className={styles.tableContainer}>
            <div ref={contentRef} className={styles.table}>
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