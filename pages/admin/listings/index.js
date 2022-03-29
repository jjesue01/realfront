import React, { useEffect, useState } from 'react';
import cn from "classnames";
import Image from "next/image";
import Head from 'next/head'
import styles from '../../../styles/ListingsManagement.module.sass';
import SearchIcon from "../../../public/icons/search-icon.svg";
import DownloadIcon from '/public/icons/download.svg'
import Typography from '../../../components/Typography';
import Input from '../../../components/input/Input';
import { useGetListingsQuery } from '../../../services/admin';
import { download, scrollToTop } from '../../../utils';
import Pagination from '../../../components/pagination/Pagination';


const LIMIT_LISTINGS_PAGE = 10;

function ListingRow ({listing}) {
  function handleDownloadAssets() {
    const fileName = listing.name.replace(/\s/g, '-') + '_assets.zip'

    download(`https://nft-api-dev.homejab.com/admin/listings/${listing.id}/download`, fileName)
  }

  return (<>
      {listing &&
        <div className={styles.tableItem}>
        <div className={cn(styles.col, styles.colImage)}>
          <div className={styles.logoWrapper}>
            {listing.thumbnail && <Image src={listing.thumbnail} alt="logo" layout="fill" objectFit="cover" />}
          </div>
        </div>
        <div className={cn(styles.col, styles.colName)}>
          <p>{listing.name}</p>
        </div>
        <div className={cn(styles.col, styles.colAdress)}>
          <p>{listing.city.name}</p>
        </div>
        <div className={cn(styles.col, styles.colTokenId)}>
          <p>{listing.tokenIds[0]}</p>
        </div>
        <div className={cn(styles.col, styles.colButton, styles.btnIcon)} onClick={handleDownloadAssets}>
          <DownloadIcon/>
        </div>
      </div>
      }
     </>
  )
}

function Listings() {
  const [filters, setFilters] = useState({
    search : '',
    page : 1,
    firstDate : '2021-11-01',
    secondDate : new Date().toISOString().substring(0,10),
  });

  const {data : listings = [], refetch } = useGetListingsQuery({search : filters.search, limit: LIMIT_LISTINGS_PAGE, page: filters.page, ipfsdate_from : filters.firstDate, ipfsdate_to : filters.secondDate});

  const [visibleDateFilter, setVisibleDateFilter] = useState(false);
  const popupRef = React.useRef(null);

  useEffect(function init() {
    refetch()

    const onClick = e => !popupRef.current || popupRef.current.contains(e.target) || setVisibleDateFilter(false);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rowsList = listings.docs && listings.docs.map((listing) => (
    <ListingRow key={listing._id} listing={listing}/>
  ))

  const handleChangeSearch = ({ target: { value } }) =>{
    setFilters(prevFilters => ({
      ...prevFilters,
      search : value,
    }))
  }

  const handleNextPage = () => {
    if (listings.nextPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: listings.nextPage
      }))
      scrollToTop()
    }
  }

  const handlePrevPage = () => {
    if (listings.prevPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: listings.prevPage
      }))
      scrollToTop()
    }
  }

  const handleViewDateFilter = () => {
    setVisibleDateFilter(prevState => !prevState);
  }

  const handleChangeFirstDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      firstDate : e.target.value
    }))
  }

  const handleChangeSecondDate = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      firstDate : e.target.value
    }))
  }

  return <div>
    <Head>
      <title>real - Admin. Listings Management</title>
    </Head>
    <div className={styles.title}>
      <Typography tag="h3" fontSize={20} fontWeight={600}>
        Listings
      </Typography>
      <div className = {styles.filtersBlock}>
        <div ref={popupRef}>
          <div className={styles.button} onClick={handleViewDateFilter}>filter date</div>
          <div className={cn(styles.dateInputWrapper, {[styles.dataInputWrapperActive] : visibleDateFilter})} >
            <Input type="date" value={filters.firstDate} onChange={handleChangeFirstDate} noPast={false} className={styles.dateInput}/>
            <Input type="date" value={filters.secondDate} onChange={handleChangeSecondDate} noPast={false} className={styles.dateInput}/>
          </div>
        </div>
        <Input
          className={cn(styles.inputSearch, { [styles.inputSearchActive]: filters.search !== '' } )}
          type="search"
          name="searchValue"
          value={filters.search}
          onChange={handleChangeSearch}
          size="small"
          iconRight={<SearchIcon />}
          placeholder="Search"/>
      </div>
      
    </div>
    <div className={styles.tableContainer}>
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div className={cn(styles.col, styles.colImage)}>
          <p>Image</p>
        </div>
        <div className={cn(styles.col, styles.colName)}>
          <p>Name</p>
        </div>
        <div className={cn(styles.col, styles.colAdress)}>
          <p>Address</p>
        </div>
        <div className={cn(styles.col, styles.colTokenId)}>
          <p>TokenId</p>
        </div>
        <div className={cn(styles.col, styles.colButton)}>
          
        </div>
      </div>
      <div className={styles.tableBody}>
        { rowsList }
      </div>
    </div>
    <Pagination count={LIMIT_LISTINGS_PAGE} currentPage={filters.page} onNext={handleNextPage} onPrev={handlePrevPage}/>
    
  </div>
</div>
}

export default Listings;