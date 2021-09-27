import React, { useState, useEffect } from "react";
import styles from '../styles/Profile.module.sass'
import Head from "next/head";
import UserInfo from "../components/profile/user-info/UserInfo";
import cn from "classnames";
import Typography from "../components/Typography";
import PhotoItem from "../components/photo-item/PhotoItem";
import TradingHistory from "../components/profile/trading-history/TradingHistory";
import SearchIcon from "../public/icons/search-icon.svg";
import Input from "../components/input/Input";
import Select from "../components/select/Select";
import Button from "../components/button/Button";
import SideFilter from "../components/profile/filter/SideFilter";
import {sortOptions, data} from "../components/profile/fixtures";
import {getSortedArray} from "../utils";

const tabs = ['collected', 'created', 'favorited', 'activity']
const favoritedIds = [1,3,6]
const boughtItems = [2,9,7]
const userId = 1

function MyProfile() {
  const [sourceData, setSourceData] = useState(data)
  const [filteredData, setFilteredData] = useState(data)
  const [currentTab, setCurrentTab] = useState('collected')
  const [filterOpened, setFilterOpened] = useState(false)
  const [filtersCount, setFiltersCount] = useState(0)
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

  const tabsList = tabs.map(tab => (
    <button
      key={tab}
      onClick={handleTabChange(tab)}
      className={cn(styles.tab, { [styles.tabActive]: tab === currentTab })}>
      { tab }
    </button>
  ))

  const itemsList = filteredData.map((item) => (
    <PhotoItem
      key={item.name}
      data={item}
      favorite={currentTab === 'favorited'}
      type="full" />
  ))

  function handleChange({ target: { name, value } }) {
    setFilters(prevState => ({ ...prevState, [name]: value  }))
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

  function handleTabChange(value) {
    return function () {
      setCurrentTab(value)
    }
  }

  function toggleFilter() {
    setFilterOpened(prevState => !prevState)
  }

  useEffect(function filterData() {
    let items = [...sourceData]
    let updatedFiltersCount = 0

    if (currentTab === 'activity') return;

    if (currentTab === 'favorited') {
      items = items.filter(item => favoritedIds.some(id => item.id === id))
      setFilteredData(items)
      return;
    }

    if (currentTab === 'collected')
      items = items.filter(item => boughtItems.some(id => item.id === id))

    if (currentTab === 'created')
      items = items.filter(item => item.user_id === userId)

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
      updatedFiltersCount += 1
    }
    if (!!filters.price.from) {
      items = items.filter(({ price }) => price >= filters.price.from)
      updatedFiltersCount += 1
    } else if (!!filters.price.to) {
      items = items.filter(({ price }) => price <= filters.price.to)
      if (!filters.price.from) updatedFiltersCount += 1
    }

    if (filters.resources.length !== 0) {
      items = items.filter(({ resources }) => {
        let result = false
        filters.resources.forEach(resource => {
          if (resources.includes(resource)) result = true
        })
        return result
      })
      updatedFiltersCount += 1
    }

    if (filters.more.types.length !== 0) {
      items = items.filter(({ types }) => {
        let result = false
        filters.more.types.forEach(type => {
          if (types.includes(type)) result = true
        })
        return result
      })
      updatedFiltersCount += 1
    }

    items = getSortedArray(items, filters.sortBy)

    setFiltersCount(updatedFiltersCount)
    setFilteredData([...items])
  }, [filters, sourceData, currentTab])

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - My Profile</title>
      </Head>
      <UserInfo />
      <div className={styles.content}>
        <div className="container">
          <div className={styles.tabs}>
            { tabsList }
          </div>
          {
            ['collected', 'created'].includes(currentTab) &&
            <div className={styles.filterControls}>
              <div className={styles.row}>
                <Input
                  className={cn(styles.inputSearch, { [styles.inputSearchActive]: filters.searchValue !== '' } )}
                  type="search"
                  name="searchValue"
                  value={filters.searchValue}
                  onChange={handleChange}
                  iconRight={<SearchIcon />}
                  placeholder="Search" />
                <Select
                  className={styles.selectSort}
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                  options={sortOptions}
                  placeholder={'Sort By'} />
                  <Button onClick={toggleFilter} className={styles.btnFilter} type="outlined">
                    Filter
                    {
                      filtersCount !== 0 &&
                      <span>{filtersCount}</span>
                    }
                  </Button>
              </div>
              <div className={styles.row}>
                <div className={styles.tags}>
                  <div className={styles.tag}>
                    <p>New York</p>
                    <button className={styles.btnDelete} />
                  </div>
                </div>
                <div className={styles.resetFilters}>
                  <button onClick={handleResetFilters} className={styles.btnReset} />
                  <Typography fontSize={14} color={'#111'}>
                    Reset all filters
                  </Typography>
                </div>
              </div>
            </div>
          }
          <div className={styles.tabContent}>
            {
              currentTab !== 'activity' ?
                <div className={styles.itemsContainer}>
                  <Typography fontSize={16} lHeight={20}>
                    { filteredData.length > 0 ? filteredData.length : 'No' } items
                  </Typography>
                  <div className={styles.items}>
                    { itemsList }
                  </div>
                </div>
                :
                <TradingHistory />
            }
          </div>
        </div>
      </div>
      <SideFilter
        opened={filterOpened}
        onClose={toggleFilter}
        filters={filters}
        onChange={handleChange} />
    </main>
  )
}

export default MyProfile