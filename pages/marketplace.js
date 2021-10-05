import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/Marketplace.module.sass'
import Head from "next/head";
import Input from "../components/input/Input";
import SearchIcon from "../public/icons/search-icon.svg";
import ArrowLongIcon from '/public/icons/arrow-long.svg'
import cn from "classnames";
import CollectionFilter from "../components/marketplace/filters/collection-filter/CollectionFilter";
import PriceFilter from "../components/marketplace/filters/price-filter/PriceFilter";
import ResourcesFilter from "../components/marketplace/filters/resources-filter/ResourcesFilter";
import MoreFilter from "../components/marketplace/filters/more-filter/MoreFilter";
import Typography from "../components/Typography";
import PhotoItem from "../components/photo-item/PhotoItem";
import Select from "../components/select/Select";
import Map from "../components/marketplace/map/Map";
import Pagination from "../components/pagination/Pagination";
import {getSortedArray, scrollToTop} from "../utils";
import {data} from "../components/profile/fixtures";
import {useRouter} from "next/router";
import {useGetListingsQuery} from "../services/listings";

const sortOptions = [
  {
    label: 'Price: Low to High',
    value: 'price_low'
  },
  {
    label: 'Price: High to Low',
    value: 'price_high'
  },
]

const sourceItems = [...data]

function Marketplace({ toggleFooter }) {
  const router = useRouter()
  const { data: listings } = useGetListingsQuery()
  const [sourceData, setSourceData] = useState(sourceItems)
  const [viewportData, setViewportData] = useState(sourceItems)
  const [filteredData, setFilteredData] = useState(sourceItems)
  const [isMapHidden, setIsMapHidden] = useState(false)
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
    },
    sortBy: 'price_low'
  })
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6
  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const pageItems = isMapHidden ?
    filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    :
    filteredData

  const mounted = useRef(false)

  function handleNextPage() {

    if (currentPage < pageCount) {
      setCurrentPage(prevState => prevState + 1)
      scrollToTop()
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(prevState => prevState - 1)
      scrollToTop()
    }
  }

  function handleChange({ target: { name, value } }) {
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  function toggleMap() {
    setIsMapHidden(prevState => !prevState)
    toggleFooter()
    setViewportData(sourceItems)
  }

  function handleResetFilters() {
    setFilters(prevState => ({
      ...prevState,
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
    }))
  }

  function handleMapChange(items) {
    setViewportData([...items])
  }

  useEffect(function hideFooter() {
    if (!mounted.current) {
      toggleFooter()
      mounted.current = true
    }
  }, [toggleFooter])

  useEffect(function filterData() {
    let items = isMapHidden ? sourceData : viewportData

    if (filters.searchValue !== '') {
      items = items.filter(({ name, address }) =>
        `${name.toLowerCase()}-${address.toLowerCase()}`.includes(filters.searchValue.toLowerCase()))
    }

    if (filters.collections.length !== 0) {
      items = items.filter(({ collections }) => {
        let result = false
        filters.collections.forEach(collection => {
          if (collections.includes(collection)) result = true
        })
        return result
      })
    }

    if (!!filters.price.from) {
      items = items.filter(({ price }) => price >= filters.price.from)
    } else if (!!filters.price.to) {
      items = items.filter(({ price }) => price <= filters.price.to)
    }

    if (filters.resources.length !== 0) {
      items = items.filter(({ resources }) => {
        let result = false
        filters.resources.forEach(resource => {
          if (resources.includes(resource)) result = true
        })
        return result
      })
    }

    if (filters.more.types.length !== 0) {
      items = items.filter(({ types }) => {
        let result = false
        filters.more.types.forEach(type => {
          if (types.includes(type)) result = true
        })
        return result
      })
    }

    items = getSortedArray(items, filters.sortBy)

    setFilteredData([...items])
  }, [filters, viewportData, sourceData, isMapHidden])

  useEffect(function initSearch() {
    const { search } = router.query;

    if (search)
      setFilters(prevFilters => ({ ...prevFilters, searchValue: search }))
  }, [router])

  return (
    <main className={cn(styles.root, { [styles.rootFull]: isMapHidden })}>
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
        {
          !isMapHidden &&
          <div className={styles.mapContainer}>
            <Map items={sourceItems} onBoundsChange={handleMapChange} />
            <button onClick={toggleMap} className={styles.btnHideMap}>
              <ArrowLongIcon />
            </button>
          </div>
        }
        <div className={cn(styles.items, { [styles.itemsWide]: isMapHidden })}>
          <div className={cn(styles.itemsWrapper, { 'container': isMapHidden })}>
            {
              isMapHidden &&
              <button onClick={toggleMap} className={styles.btnShowMap}>
                <Typography tag="span" fontSize={14} color={'#000'}>
                  Show map
                </Typography>
                <ArrowLongIcon />
              </button>
            }
            <div className={styles.titleContainer}>
              <Typography tag="h1" fontWeight={600} fontSize={20} lHeight={24}>
                Real Estate Photos for Sale
              </Typography>
              {
                isMapHidden &&
                <div className={styles.itemsHeader}>
                  <Typography fontSize={16}>
                    {filteredData.length || 'No'} results
                  </Typography>
                  <Select
                    className={styles.selectSort}
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleChange}
                    options={sortOptions}
                    placeholder={'Sort By'}
                    size="small" />
                </div>
              }
            </div>
            <div className={styles.itemsContainer}>
              <div className={styles.scrollContainer}>
                <div className={styles.itemsContent}>
                  {
                    !isMapHidden &&
                    <div className={styles.itemsHeader}>
                      <Typography fontSize={16}>
                        {filteredData.length || 'No'} results
                      </Typography>
                      <Select
                        className={styles.selectSort}
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
                        options={sortOptions}
                        placeholder={'Sort By'}
                        size="small" />
                    </div>
                  }
                  <div className={styles.itemsGrid}>
                    {
                      pageItems.map(item => (
                        <PhotoItem imageClassName={styles.imageWrapper} key={item.name} data={item} />
                      ))
                    }
                  </div>
                  {
                    isMapHidden &&
                      <div className={styles.paginationContainer}>
                        <Pagination
                          className={styles.pagination}
                          currentPage={currentPage}
                          count={pageCount}
                          onNext={handleNextPage}
                          onPrev={handlePrevPage} />
                      </div>
                  }
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