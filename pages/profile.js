import React, {useState, useEffect, useMemo} from "react";
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
import {sortOptions} from "../components/profile/fixtures";
import {buildFilterOptions, getSortedArray} from "../utils";
import Tabs from "../components/tabs/Tabs";
import {useRouter} from "next/router";
import {useGetCurrentUserQuery} from "../services/auth";
import {useGetListingsQuery} from "../services/listings";
import {
  useDeleteBidMutation,
  useGetMyBidsQuery,
  useGetProfileTransactionsQuery
} from "../services/transactions";
import FullscreenLoader from "../components/fullscreen-loader/FullscreenLoader";
import Bids from "../components/profile/bids/Bids";
import ConfirmationDialog from "../components/dialogs/confirmation-dialog/ConfirmationDialog";

const tabs = ['collected', 'created', 'sold', 'favorited', 'activity', 'my bids']

const initialFilters = {
  searchValue: '',
  cities: [],
  price: {
    from: '',
    to: ''
  },
  resources: [],
  more: {
    types: [],
    keywords: ''
  },
}

function MyProfile() {
  const router = useRouter()
  const [deleteBid] = useDeleteBidMutation()
  const { data: user, refetch: refetchUser } = useGetCurrentUserQuery()
  const { data: collectedListings, refetch: refetchCollected } = useGetListingsQuery({ owner: user?._id }, { skip: !user?._id })
  const { data: createdListings, refetch: refetchCreated } = useGetListingsQuery({ creator: user?._id }, { skip: !user?._id })
  const { data: soldListings, refetch: refetchSold } = useGetListingsQuery({ seller: user?._id }, { skip: !user?._id })
  const { data: favoriteListings, refetch: refetchFavorite } = useGetListingsQuery({ liked: true })
  const { data: transactions, refetch: refetchTransactions } = useGetProfileTransactionsQuery()
  const { data: bids, refetch: refetchBids, isFetching } = useGetMyBidsQuery()
  const [manualLoading, setManualLoading] = useState(false)
  const isLoading = !user || !collectedListings || !createdListings || !favoriteListings || isFetching || manualLoading
  const [filteredData, setFilteredData] = useState([])
  const [currentTab, setCurrentTab] = useState('collected')
  const [options, setOptions] = useState({
    collected: { cities: [], tags: [] },
    created: { cities: [], tags: [] },
  })
  const [filterOpened, setFilterOpened] = useState(false)
  const [filtersCount, setFiltersCount] = useState(0)
  const [filters, setFilters] = useState({
    ...initialFilters,
    sortBy: 'price_low'
  })
  const [filterValues, setFilterValues] = useState([])
  const [cancelBidOpened, setCancelBidOpened] = useState(false)
  const [bidForDelete, setBidForDelete] = useState(null)

  const pendingBids = useMemo(() => {
    return bids?.docs?.filter(bid => !bid.status.includes('Close'))
  }, [bids?.docs])

  const closedBids = useMemo(() => {
    return bids?.docs?.filter(bid => bid.status.includes('Close'))
  }, [bids?.docs])

  const itemsList = filteredData.map((item) => (
    <PhotoItem
      key={item._id}
      data={item}
      isOwn={item?.owner ? item.owner === user?._id : item?.creator?.ID === user?._id}
      favorite={currentTab === 'favorited'}
      type="full" />
  ))

  function handleChange({ target: { name, value } }) {
    setFilters(prevState => ({ ...prevState, [name]: value  }))
  }
  function handleResetFilters() {
    setFilters(prevState => ({
      ...prevState,
      ...initialFilters,
    }))
  }

  function handleTabChange({ target: { value } }) {
    setCurrentTab(value)
  }

  function toggleFilter() {
    setFilterOpened(prevState => !prevState)
  }

  function toggleCancelBidConfirmation() {
    setCancelBidOpened(prevState => !prevState)
  }

  function openCancelBid(bid) {
    return function () {
      setBidForDelete(bid)
      toggleCancelBidConfirmation()
    }
  }

  function handleCancelBid() {
    const contract = require('/services/contract/index')[bidForDelete.listing?.blockchain]

    if (bidForDelete) {
      setManualLoading(true)
      /**
       * TODO: update tokenID here
       */
      contract.revokeBid(bidForDelete.listing?.tokenID, bidForDelete.bidIndex , user.walletAddress)
        .then(() => {
          deleteBid({ id: bidForDelete._id }).unwrap()
            .then(() => {
              refetchBids()
              setManualLoading(false)
            })
            .catch(() => {
              setManualLoading(false)
            })
        })
        .catch(() => {
          setManualLoading(false)
        })
    }
  }

  function handleDeleteValue(item) {
    return function () {
      const updatedFilters = { ...filters }
      if (item.sub) {
        const subValue = updatedFilters[item.name][item.sub]
        if (Array.isArray(subValue)) {
          updatedFilters[item.name][item.sub] = subValue.filter(value => value !== item.value)
        } else {
          updatedFilters[item.name][item.sub] = ''
        }
      } else if (Array.isArray(updatedFilters[item.name])) {
        //updatedFilters[item.name] = updatedFilters[item.name].filter(({ value }) => value !== item.value)
        updatedFilters[item.name] = updatedFilters[item.name].filter((filterItem) => {
          if (filterItem?.value)
            return filterItem.value !== item.value
          return filterItem !== item.value
        })
      } else {
        updatedFilters[item.name] = ''
      }

      setFilters(prevState => ({
        ...prevState,
        ...updatedFilters
      }))
    }
  }

  useEffect(function filterData() {
    let items = []
    let updatedFilterValues = []
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

    if (currentTab === 'sold')
      items = [...soldListings.docs]

    if (filters.searchValue !== '') {
      items = items.filter(({ name, address }) =>
        `${name.toLowerCase()}-${address.toLowerCase()}`.includes(filters.searchValue.toLowerCase()))
    }

    if (filters.cities.length !== 0) {
      items = items.filter(({ city }) => filters.cities.some(({ value }) => value === city?.ID))
      updatedFiltersCount += 1
      updatedFilterValues = [
        ...filters.cities.map(item => ({ ...item, name: 'cities' }))
      ]
    }

    if (!!+filters.price.from) {
      items = items.filter(({ price }) => price >= +filters.price.from)
      updatedFiltersCount += 1
      updatedFilterValues = [
        ...updatedFilterValues,
        {
          name: 'price',
          sub: 'from',
          label: `From: ${+filters.price.from}`,
          value: +filters.price.from
        }
      ]
    }
    if (!!+filters.price.to) {
      items = items.filter(({ price }) => price <= +filters.price.to)
      updatedFilterValues = [
        ...updatedFilterValues,
        {
          name: 'price',
          sub: 'to',
          label: `To: ${+filters.price.to}`,
          value: +filters.price.to
        }
      ]
      if (!+filters.price.from) updatedFiltersCount += 1
    }

    if (filters.resources.length !== 0) {
      items = items.filter(({ resource }) => filters.resources.some((value) => value === resource))
      updatedFiltersCount += 1
      updatedFilterValues = [
        ...updatedFilterValues,
        ...filters.resources.map(resource => ({
          name: 'resources',
          label: resource,
          value: resource
        }))
      ]
    }

    if (filters.more.types.length !== 0) {
      items = items.filter(({ tags }) => {
        let result = false
        filters.more.types.forEach(type => {
          if (tags?.includes(type)) result = true
        })
        return result
      })
      updatedFiltersCount += 1
      updatedFilterValues = [
        ...updatedFilterValues,
        ...filters.more.types.map(tag => ({
          name: 'more',
          sub: 'types',
          label: tag,
          value: tag
        }))
      ]
    }

    if (!!filters.more.keywords) {
      updatedFiltersCount += 1
      updatedFilterValues = [
        ...updatedFilterValues,
        {
          name: 'more',
          sub: 'keywords',
          label: filters.more.keywords,
          value: 'keywordsField'
        }
      ]
    }

    items = getSortedArray(items, filters.sortBy)

    setFiltersCount(updatedFiltersCount)
    setFilteredData([...items])
    setFilterValues(updatedFilterValues)
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

  useEffect(function () {
    refetchUser()
    refetchCollected()
    refetchCreated()
    refetchSold()
    refetchFavorite()
    refetchTransactions()
    refetchBids()
  }, [refetchUser, refetchCollected, refetchCreated, refetchFavorite, refetchTransactions, refetchBids, refetchSold])

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
            ['collected', 'created', 'sold'].includes(currentTab) &&
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
              <div className={cn(styles.row, styles.tagsContainer)}>
                <div className={styles.tags}>
                  {
                    filterValues.map((item) => (
                      <div key={item.value} className={styles.tag}>
                        <p>{item.label}</p>
                        <button onClick={handleDeleteValue(item)} className={styles.btnDelete} />
                      </div>
                    ))
                  }
                </div>
                {
                  filterValues.length !== 0 &&
                  <div className={styles.resetFilters}>
                    <button onClick={handleResetFilters} className={styles.btnReset} />
                    <Typography fontSize={14} color={'#111'}>
                      Reset all filters
                    </Typography>
                  </div>
                }
              </div>
            </div>
          }
          <div className={cn(styles.tabContent, { [styles.contentMargin]: ['collected', 'created', 'sold'].includes(currentTab) })}>
            {
              ['collected', 'created', 'favorited', 'sold'].includes(currentTab) &&
                <div className={styles.itemsContainer}>
                  <Typography fontSize={16} lHeight={20}>
                    { filteredData.length > 0 ? filteredData.length : 'No' } items
                  </Typography>
                  <div className={styles.items}>
                    { itemsList }
                  </div>
                </div>
            }
            {
              currentTab === 'activity' &&
                <TradingHistory data={transactions} />
            }
            {
              currentTab === 'my bids' &&
                <>
                  <Bids
                    data={pendingBids}
                    title="Pending bids"
                    onCancel={openCancelBid}
                    withTotal />
                  <Bids
                    className={styles.closedBids}
                    data={closedBids}
                    title="Closed bids" />
                </>
            }
          </div>
        </div>
      </div>
      <ConfirmationDialog
        opened={cancelBidOpened}
        onClose={toggleCancelBidConfirmation}
        onSubmit={handleCancelBid}
        btnSubmitTitle={'Cancel'}
        title={'Cancel bid'}
        message={'Do you really want to cancel your bid?'} />
      <SideFilter
        options={currentTab === 'collected' ? options.collected : options.created}
        opened={filterOpened}
        onClose={toggleFilter}
        filters={filters}
        onChange={handleChange} />
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default MyProfile