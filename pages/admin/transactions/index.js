import React, { useState } from 'react'
import styles from '../../../styles/Transactions.module.sass'
import cn from 'classnames'
import Image from "next/image";
import { dateToString, DAY_TIME, getMoneyView, timeAgo } from '../../../utils';
import Typography from '../../../components/Typography';
import Input from '../../../components/input/Input';

const mockData = [
  {
    _id : "6225e6df6f76e2a85962beef",
    from: "61ead2759e08d4543c81142b",
    to: "61e7fe4386b62ed8f5fdde88",
    date : "2022-03-07T11:05:03.219Z",
    price: 10,
    quantity: 1,
    event: "Purchasing",
    listingID : "6225e64f6f76e2a85962bdae",
    tokenId : 95,
  },
  {
    _id : "6225e6df6f76e2a85962beff",
    from: "61ead2759e08d4543c81142b",
    to: "61e7fe4386b62ed8f5fdde88",
    date : "2022-03-07T11:05:03.219Z",
    price: 10,
    quantity: 1,
    event: "Purchasing",
    listingID : "6225e64f6f76e2a85962bdae",
    tokenId : 95,
  },
  {
    _id : "6225e6df6f76e2a85962besf",
    from: "61ead2759e08d4543c81142b",
    to: "61e7fe4386b62ed8f5fdde88",
    date : "2022-03-07T11:05:03.219Z",
    price: 10,
    quantity: 1,
    event: "Purchasing",
    listingID : "6225e64f6f76e2a85962bdae",
    tokenId : 95,
  },
]

function TransactionRow ({item = {}}) {
  return (<>
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colEvent)}>
        <p>{item.event}</p>
      </div>
      <div className={cn(styles.col, styles.colItem)}>
        {/* <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {
              item?.listingID?.thumnail &&
              <Image src={item.listingID.thumnail} layout="fill" objectFit='cover' alt={item?.listingID?.name}/>
            }
          </div>
        </div> */}
        <p>{item?.listingID}</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{getMoneyView(item.price)}</p>
      </div>
      <div className={cn(styles.col, styles.colQuantity)}>
        <p>{item.quantity}</p>
      </div>
      <div className={cn(styles.col, styles.colFrom)}>
        <p>{item.from}</p>
      </div>
      <div className={cn(styles.col, styles.colTo)}>
        <p>{item.to}</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{ timeAgo(item.date) }</p>
      </div>
    </div>
  </>)
}

function Transaction () {
  const [filters, setFilters] = useState({
    firstDate : dateToString(new Date(new Date().getTime() - DAY_TIME * 7)),
    secondDate : new Date().toISOString().substring(0,10),
  });

  const rowsList = mockData?.map(item => <TransactionRow item={item} key={item._id}/>)
  
  const handleChangeFirstDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      firstDate : e.target.value
    }))
  }

  const handleChangeSecondDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      secondDate : e.target.value
    }))
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography tag="h3" fontSize={20} lHeight={24} fontWeight={600}>
          Trading history
        </Typography>
        <div className = {styles.filtersBlock}>
          <Input type="date" value={filters.firstDate} onChange={handleChangeFirstDate} noPast={false} className={styles.dateInput}/>
          <Input type="date" value={filters.secondDate} onChange={handleChangeSecondDate} noPast={false} className={styles.dateInput}/>
        </div>
      </div>
      
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={cn(styles.col, styles.colEvent)}>
              <p>Event</p>
          </div>
          <div className={cn(styles.col, styles.colItem)}>
            <p>Item</p>
          </div>
          <div className={cn(styles.col, styles.colPrice)}>
            <p>Price</p>
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

export default Transaction