import React, { useState } from 'react'
import styles from '../styles/Marketplace.module.sass'
import Head from "next/head";
import Input from "../components/input/Input";
import SearchIcon from "../public/icons/search-icon.svg";
import cn from "classnames";

function Marketplace() {
  const [filters, setFilters] = useState({
    searchValue: '',
    collection: [],
    price: {
      from: '',
      to: ''
    },
    resources: [],
    type: [],
    keywords: ''
  })

  function handleChange({ target: { name, value } }) {
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - Marketplace</title>
      </Head>
      <div className={styles.filters}>
        <div className={styles.filtersContainer}>
          <div className={styles.filtersContent}>
            <Input
              className={cn(styles.inputSearch, { [styles.inputSearchActive]: filters.searchValue !== '' } )}
              type="search"
              name="searchValue"
              value={filters.searchValue}
              onChange={handleChange}
              size="small"
              iconRight={<SearchIcon />}
              placeholder="Enter an address" />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.mapContainer}>

        </div>
        <div className={styles.items}>

        </div>
      </div>
    </main>
  )
}
export default Marketplace