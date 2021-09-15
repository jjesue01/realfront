import React, { useState } from 'react'
import styles from '../styles/Marketplace.module.sass'
import Head from "next/head";
import Input from "../components/input/Input";
import SearchIcon from "../public/icons/search-icon.svg";
import cn from "classnames";
import CollectionFilter from "../components/marketplace/filters/collection-filter/CollectionFilter";
import PriceFilter from "../components/marketplace/filters/price-filter/PriceFilter";
import ResourcesFilter from "../components/marketplace/filters/resources-filter/ResourcesFilter";
import MoreFilter from "../components/marketplace/filters/more-filter/MoreFilter";
import Typography from "../components/Typography";
import PhotoItem from "../components/photo-item/PhotoItem";

function Marketplace() {
  const [filters, setFilters] = useState({
    searchValue: '',
    collections: [],
    price: {
      from: '',
      to: ''
    },
    resources: [],
    more: {
      types: [],
      keywords: ''
    }
  })

  function handleChange({ target: { name, value } }) {
    console.log(value)
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  function handleResetFilters() {
    setFilters({
      searchValue: '',
      collections: [],
      price: {
        from: '',
        to: ''
      },
      resources: [],
      more: {
        types: [],
        keywords: ''
      }
    })
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
            <CollectionFilter
              className={styles.filter}
              name="collections"
              value={filters.collections}
              onChange={handleChange} />
            <PriceFilter
              className={styles.filter}
              name="price"
              value={filters.price}
              onChange={handleChange} />
            <ResourcesFilter
              className={styles.filter}
              name="resources"
              value={filters.resources}
              onChange={handleChange} />
            <MoreFilter
              className={styles.filter}
              name="more"
              value={filters.more}
              onChange={handleChange} />
          </div>
          <div className={styles.resetFilters}>
            <button onClick={handleResetFilters} className={styles.btnReset} />
            <Typography fontSize={14} color={'#111'}>
              Reset all filters
            </Typography>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.mapContainer}>

        </div>
        <div className={styles.items}>
          <div className={styles.titleContainer}>
            <Typography tag="h1" fontWeight={600} fontSize={20} lHeight={24}>
              Real Estate Photos for Sale
            </Typography>
          </div>
          <div className={styles.itemsContainer}>
            <div className={styles.scrollContainer}>
              <div className={styles.itemsContent}>
                <div className={styles.itemsHeader}>
                  <Typography fontSize={16}>
                    58 results
                  </Typography>
                  <div style={{ width: 223, height: 40, border: '1px solid #D3D9E1' }} />
                </div>
                <div className={styles.itemsGrid}>
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                  <PhotoItem />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default Marketplace