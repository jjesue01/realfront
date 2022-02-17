import React, {useEffect, useMemo, useState} from 'react'
import styles from './Bids.module.sass'
import Typography from "../../Typography";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import {getBlockchain, getFormattedDate, getMoneyView} from "../../../utils";
import Button from "../../button/Button";
import {useSelector} from "react-redux";

function Bids({ className, data = [], title, onCancel, withTotal = false }) {
  const user = useSelector(state => state.auth.user)
  const [balance, setBalance] = useState(0)
  const [blockchain, setBlockchain] = useState('')

  const total = useMemo(() => {
    if (!withTotal)
      return 0

    return data.reduce((total, bid) => total + bid.price, 0)
  }, [withTotal, data])

  useEffect(function init() {
    if (user) {
      const initBalances = async () => {
        const blockchain = await getBlockchain()
        const contract = require('/services/contract/index')[blockchain]

        const balance = +await contract.balanceOf(user.walletAddress)

        setBalance(balance)
        setBlockchain(blockchain)
      }

      initBalances()
    }
  }, [data, user])

  const rowsList = data.map((item, index) => (
    <div key={item._id} className={styles.tableItem}>
      <Link href={`/photos/${item?.listing?._id}`} passHref>
        <a className={cn(styles.col, styles.colItem)}>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              {
                item?.listing?.thumbnail &&
                <Image
                  src={item.listing.thumbnail}
                  layout="fill"
                  objectFit="cover"
                  alt={item?.listing?.name} />
              }
            </div>
          </div>
          <p>{ item?.listing?.name }</p>
        </a>
      </Link>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ getMoneyView(item.price) }</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{ getFormattedDate(item.createdAt) }</p>
      </div>
      <div className={cn(styles.col, styles.colActions)}>
        {
          onCancel &&
            <Button
              onClick={onCancel(item)}
              type="outlined"
              disabled={item?.listing?.blockchain !== blockchain}>
              Cancel
            </Button>
        }
      </div>
    </div>
  ))

  return (
    <div className={cn(className, styles.root)}>
      <Typography tag="h3" fontSize={20} lHeight={24} fontWeight={600}>
        { (data.length === 0 ? 'No ' : '') + title }
      </Typography>
      {
        data.length !== 0 &&
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={cn(styles.col, styles.colItem)}>
              <p>Item</p>
            </div>
            <div className={cn(styles.col, styles.colPrice)}>
              <p>Price</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>Date</p>
            </div>
            <div className={cn(styles.col, styles.colActions)} />
          </div>
          <div className={styles.tableBody}>
            { rowsList }
            {
              withTotal &&
              <div className={cn(styles.tableItem, styles.total)}>
                <div className={cn(styles.col, styles.colItem)}>
                  <p>Total</p>
                </div>
                <div className={cn(styles.col, styles.colPrice)}>
                  <p>{ getMoneyView(total) }</p>
                </div>
                <div className={cn(styles.col, styles.colDate)} />
                <div className={cn(styles.col, styles.colActions)} />
                {
                  balance < total &&
                  <div className={styles.noMoney}>
                    <p>You need {getMoneyView(total - balance)} more to close all bids</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Bids