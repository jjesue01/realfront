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
import {buildFilterOptions, getSortedArray} from "../utils";
import Tabs from "../components/tabs/Tabs";
import {useRouter} from "next/router";
import {useGetCurrentUserQuery} from "../services/auth";
import {useGetListingsQuery} from "../services/listings";
import {useGetProfileTransactionsQuery} from "../services/transactions";

const tabs = ['collected', 'created', 'favorited', 'activity']
const favoritedIds = [1,3,6]
const boughtItems = [2,9,7]
const userId = 1

function MyProfile() {
  const router = useRouter()
  const { data: user } = useGetCurrentUserQuery()
  const { data: collectedListings } = useGetListingsQuery({ owner: user?._id })
  const { data: createdListings } = useGetListingsQuery({ creator: user?._id })
  const { data: favoriteListings } = useGetListingsQuery({ liked: true })
  const { data: transactions } = useGetProfileTransactionsQuery()
  const [filteredData, setFilteredData] = useState([])
  const [currentTab, setCurrentTab] = useState('collected')
  const [options, setOptions] = useState({
    collected: { collections: [], tags: [] },
    created: { collections: [], tags: [] },
  })
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

  const itemsList = filteredData.map((item) => (
    <PhotoItem
      key={item._id}
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

  function handleTabChange({ target: { value } }) {
    setCurrentTab(value)
  }

  function toggleFilter() {
    setFilterOpened(prevState => !prevState)
  }

  useEffect(function filterData() {
    let items = []
    let updatedFiltersCount = 0

    if (currentTab === 'activity' || !user || !collectedListings || !createdListings || !favoriteListings) return;

    if (currentTab === 'favorited') {
      items = [...favoriteListings.docs]
      setFilteredData(items)
      return;
    }

    if (currentTab === 'collected')
      items = [...collectedListings.docs]

    if (currentTab === 'created')
      items = [...createdListings.docs]

    if (filters.searchValue !== '') {
      items = items.filter(({ name, address }) =>
        `${name.toLowerCase()}-${address.toLowerCase()}`.includes(filters.searchValue.toLowerCase()))
    }

    if (filters.collections.length !== 0) {
      items = items.filter(({ collections }) => filters.collections.includes(collections.ID))
      updatedFiltersCount += 1
    }

    if (!!filters.price.from) {
      items = items.filter(({ price }) => price >= filters.price.from)
      updatedFiltersCount += 1
    } else if (!!filters.price.to) {
      items = items.filter(({ price }) => price <= filters.price.to)
      if (!filters.price.from) updatedFiltersCount += 1
    }

    // if (filters.resources.length !== 0) {
    //   items = items.filter(({ resources }) => {
    //     let result = false
    //     filters.resources.forEach(resource => {
    //       if (resources.includes(resource)) result = true
    //     })
    //     return result
    //   })
    //   updatedFiltersCount += 1
    // }

    if (filters.more.types.length !== 0) {
      items = items.filter(({ tags }) => {
        let result = false
        filters.more.types.forEach(type => {
          if (tags.includes(type)) result = true
        })
        return result
      })
      updatedFiltersCount += 1
    }

    items = getSortedArray(items, filters.sortBy)

    setFiltersCount(updatedFiltersCount)
    setFilteredData([...items])
  }, [filters, currentTab, user, createdListings, collectedListings, favoriteListings, options])

  useEffect(function initTab() {
    const { query } = router;

    if (query.tab)
      setCurrentTab(query.tab)
  }, [router])

  useEffect(function initOptions() {
    if (!collectedListings || !createdListings) return;

    setOptions({
      collected: buildFilterOptions(collectedListings.docs),
      created: buildFilterOptions(createdListings.docs),
    })
  }, [collectedListings, createdListings])

  useEffect(function resetFilters() {
    handleResetFilters()
  }, [currentTab])

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - My Profile</title>
      </Head>
      <UserInfo user={user} />
      <div className={styles.content}>
        <div className="container">
          <Tabs
            className={styles.tabs}
            name="currentTab"
            value={currentTab}
            onChange={handleTabChange}
            tabs={tabs} />
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
                <TradingHistory data={transactions} />
            }
          </div>
        </div>
      </div>
      <SideFilter
        options={currentTab === 'collected' ? options.collected : options.created}
        opened={filterOpened}
        onClose={toggleFilter}
        filters={filters}
        onChange={handleChange} />
    </main>
  )
}

export default MyProfile