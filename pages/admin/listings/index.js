import React, { useEffect, useState } from 'react';
import styles from '../../../styles/ListingsManagement.module.sass';
import cn from "classnames";
import { useGetListingsQuery } from '../../../services/admin';
import Image from "next/image";
import DownloadIcon from '/public/icons/download.svg'
import Head from 'next/head'
import Typography from '../../../components/Typography';
import Input from '../../../components/input/Input';
import SearchIcon from "../../../public/icons/search-icon.svg";

function ListingRow ({listing}) {
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
        <div className={cn(styles.col, styles.colButton, styles.btnIcon)}>
          <DownloadIcon/>
        </div>
      </div>
      }
     </>
  )
}

function Listings() {
  const [searchValue, setSearchValue] = useState('')
  const {data : listings = [], refetch } = useGetListingsQuery({search : searchValue});

  useEffect(function init() {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rowsList = listings.docs && listings.docs.map((listing, index) => (
    <ListingRow key={listing._id} listing={listing} />
  ))

  const handleChangeSearch = ({ target: { value } }) =>{
    setSearchValue(value)
  }

  return <div>
    <Head>
        <title>HOMEJAB - Admin. Listings Management</title>
      </Head>
      <div className={styles.title}>
        <Typography tag="h3" fontSize={20} fontWeight={600}>
          Users
        </Typography>
        <Input
          className={cn(styles.inputSearch, { [styles.inputSearchActive]: searchValue !== '' } )}
          type="search"
          name="searchValue"
          value={searchValue}
          onChange={handleChangeSearch}
          size="small"
          iconRight={<SearchIcon />}
          placeholder="Search" />
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
  </div>
</div>
}

export default Listings;