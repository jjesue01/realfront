import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Transactions.module.sass'
import cn from 'classnames'
import { dateToString, DAY_TIME, getMoneyView, scrollToTop, timeAgo } from '../../../utils';
import Typography from '../../../components/Typography';
import Input from '../../../components/input/Input';
import { useGetTransactionsQuery } from '../../../services/admin';
import Pagination from '../../../components/pagination/Pagination';
import Loader from '../../../components/loader/Loader';

function TransactionRow ({item = {}}) {
  console.log(item);
  return (<>
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colEvent)}>
        <p>{item.event}</p>
      </div>
      <div className={cn(styles.col, styles.colItem)}>
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
    ipfsdate_from : dateToString(new Date(new Date().getTime() - DAY_TIME * 7)),
    ipfsdate_to : dateToString(new Date()),
    page : 1
  });
  const {data : transactions = [], refetch, isLoading} = useGetTransactionsQuery({...filters});

  const rowsList = transactions.docs && transactions.docs.map(item => <TransactionRow item={item} key={item._id}/>)

  const handleChangeFirstDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ipfsdate_from : e.target.value
    }))
  }

  const handleChangeSecondDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ipfsdate_to : e.target.value
    }))
  }

  const handleNextPage = () => {
    if (transactions.nextPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: transactions.nextPage
      }))
      scrollToTop()
    }
  }

  const handlePrevPage = () => {
    if (transactions.prevPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: transactions.prevPage
      }))
      scrollToTop()
    }
  }

  useEffect(function init() {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilters(prevState => ({
      ...prevState,
      page: 1,
    }))
  }, [filters.ipfsdate_from, filters.ipfsdate_to])

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography tag="h3" fontSize={20} lHeight={24} fontWeight={600}>
          Trading history
        </Typography>
        <div className = {styles.filtersBlock}>
          <Input type="date" value={filters.ipfsdate_from} onChange={handleChangeFirstDate} noPast={false} className={styles.dateInput}/>
          <Input type="date" value={filters.ipfsdate_to} onChange={handleChangeSecondDate} noPast={false} className={styles.dateInput}/>
        </div>
      </div>
      
      {
        isLoading ? <Loader opened={isLoading}  color="accent" className={styles.loader}/> : transactions.docs && transactions.docs[0] ?
          <>
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
        <Pagination count={transactions?.totalPages} currentPage={filters.page} onNext={handleNextPage} onPrev={handlePrevPage}/>
          </> :
        <div className={styles.noResultBlock}><p>No result</p></div>
      }
      
    </div>
  )
}  

export default Transaction