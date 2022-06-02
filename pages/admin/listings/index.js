import React, { useEffect, useState } from 'react';
import cn from "classnames";
import Image from "next/image";
import Head from 'next/head'
import styles from '../../../styles/ListingsManagement.module.sass';
import SearchIcon from "../../../public/icons/search-icon.svg";
import DownloadIcon from '/public/icons/download.svg'
import Input from '../../../components/input/Input';
import { useGetListingsQuery } from '../../../services/admin';
import { dateToString, DAY_TIME, download, scrollToTop } from '../../../utils';
import Pagination from '../../../components/pagination/Pagination';
import { useSelector } from 'react-redux';
import Loader from '../../../components/loader/Loader';
import { getConfig } from '../../../app-config';

const LIMIT_LISTINGS_PAGE = 10;

function ListingRow ({listing, token}) {
  function handleDownloadAssets() {
    const fileName = listing.assets[0].fileName

    download(`${getConfig().API_URL}admin/listings/${listing._id}/download`, fileName, token)
  }

  return (<>
      {listing &&
        <div className={styles.tableItem}>
        <div className={cn(styles.col, styles.colImage)}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              {listing.thumbnail && <Image src={listing.thumbnail} alt="logo" layout="fill" objectFit="cover" />}
            </div>
          </div>
          
        </div>
        <div className={cn(styles.col, styles.colName)}>
          <p>{listing.name}</p>
        </div>
        <div className={cn(styles.col, styles.colAdress)}>
          <p>{listing.address}</p>
        </div>
        <div className={cn(styles.col, styles.colTokenId)}>
          <p>{listing.tokenIds[0]}</p>
        </div>
        <button className={cn(styles.col, styles.colButton, styles.btnIcon)} onClick={handleDownloadAssets}>
          <DownloadIcon/>
        </button>
      </div>
      }
     </>
  )
}

function Listings() {
  const [filters, setFilters] = useState({
    search : '',
    page : 1,
    ipfsdate_from : dateToString(new Date(new Date().getTime() - DAY_TIME * 7)),
    ipfsdate_to : dateToString(new Date()),
    limit: LIMIT_LISTINGS_PAGE
  });

  const token = useSelector(state => state.auth.admin.token);

  const {data : listings = [], refetch, isLoading} = useGetListingsQuery({...filters});

  const rowsList = listings.docs && listings.docs.map((listing) => (
    <ListingRow key={listing._id} listing={listing} token={token}/>
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

  useEffect(function init() {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilters(prevState => ({
      ...prevState,
      page: 1,
    }))
  }, [filters.search, filters.ipfsdate_from, filters.ipfsdate_to])

  return <div>
    <Head>
      <title>real - Admin. Listings Management</title>
    </Head>
    <div className={styles.title}>
    <div className = {styles.filtersBlock}>
        <Input 
          type="date" 
          value={filters.ipfsdate_from} 
          onChange={handleChangeFirstDate} 
          noPast={false} 
          className={styles.dateInput}
        />
        <Input 
          type="date" 
          value={filters.ipfsdate_to} 
          onChange={handleChangeSecondDate} 
          noPast={false} 
          className={styles.dateInput}
        />
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
    {isLoading ? <Loader opened={isLoading}  color="accent" className={styles.loader}/> : listings.docs && listings.docs[0] ?
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
        <Pagination count={listings?.totalPages} currentPage={filters.page} onNext={handleNextPage} onPrev={handlePrevPage}/>
      </div> : 
      <div className={styles.noResultBlock}><p>No result</p></div>
    }
    
</div>
}

export default Listings;