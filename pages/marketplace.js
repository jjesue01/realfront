import React, {useState, useEffect, useRef, useCallback} from 'react'
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
import {buildFilterOptions, getIdToken, getSortedArray, scrollToTop} from "../utils";
import {useRouter} from "next/router";
import {listingsApi, useGetPublishedListingsQuery, useGetTagsQuery} from "../services/listings";
import {authApi} from "../services/auth";
import FullscreenLoader from "../components/fullscreen-loader/FullscreenLoader";
import {useDispatch, useSelector} from "react-redux";
import {citiesApi} from "../services/cities";

const sortOptions = [
  {
    label: 'Price: Low to High',
    value: 'price:desc'
  },
  {
    label: 'Price: High to Low',
    value: 'price:asc'
  },
]

const initialFilters = {
  bounds: '',
  page: 1,
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

function Marketplace({ toggleFooter, openLogin }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [citiesOptions, setCitiesOptions] = useState([])
  const { data: tagsOptions = [] } = useGetTagsQuery();
  const [isLoading, setLoading] = useState(true)
  const [listings, setListings] = useState([])
  const [isMapHidden, setIsMapHidden] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [filters, setFilters] = useState({
    ...initialFilters,
    sortBy: 'price:desc'
  })
  const [pagination, setPagination] = useState({})

  const itemsPerPage = 3

  const mounted = useRef(false)
  const mapMounted = useRef(false)

  function handleNextPage() {
    if (pagination.nextPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: pagination.nextPage
      }))
      scrollToTop()
    }
  }

  function handlePrevPage() {
    if (pagination.prevPage) {
      setFilters(prevFilters => ({
        ...prevFilters,
        page: pagination.prevPage
      }))
      scrollToTop()
    }
  }

  function handleChange({ target: { name, value } }) {
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  function toggleMap() {
    document.body.style.position = !isMapHidden ? 'static' : 'fixed'
    mapMounted.current = false
    setIsMapHidden(prevState => !prevState)
    toggleFooter()
  }

  function handleResetFilters() {
    setFilters(prevState => ({
      ...prevState,
      ...initialFilters
    }))
  }

  function handleMapChange(bounds) {
    mapMounted.current = true
    setFilters(prevFilters => ({
      ...prevFilters,
      bounds
    }))
  }

  const getCities = useCallback((value) => {
    dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value }))
      .then(({ data }) => {
        setCitiesOptions(data)
      })
  }, [dispatch])

  useEffect(function hideFooter() {
    if (!mounted.current) {
      toggleFooter()
      mounted.current = true
      document.body.style.position = 'fixed'
    }
  }, [toggleFooter])

  useEffect(function filterData() {
    if (mapMounted.current) {
      const { sortBy, ...currentFilters } = filters

      setShowReset(JSON.stringify({ ...currentFilters, bounds: '', page: 1 }) !== JSON.stringify(initialFilters))

      const params =  {
        bounds: filters.bounds,
        search: filters.searchValue,
        city: filters.cities.map(({ value }) => value).join(),
        price: [+filters.price.from || '', +filters.price.to || ''].join(),
        tags: filters.more.types.join(),
        sort: filters.sortBy
      }

      if (isMapHidden) {
        params.bounds = ''
        params.limit = itemsPerPage
        params.page = filters.page
      }

      setLoading(true)

      dispatch(listingsApi.endpoints.getPublishedListings.initiate({...params}))
        .then(({ data, isLoading }) => {
          if (!isLoading) {
            const { docs, ...paginationInfo } = data
            // const sortedListings = getSortedArray(data?.docs || [], filters.sortBy)
            setListings(data?.docs || [])
            setPagination(paginationInfo)
            setLoading(false)
          }
        })
    }
  }, [dispatch, filters, isMapHidden])

  useEffect(function initSearch() {
    const { search, city } = router.query;

    if (search)
      setFilters(prevFilters => ({ ...prevFilters, searchValue: search }))
    if (city)
      setFilters(prevFilters => ({ ...prevFilters, cities: [{ value: city }] }))
  }, [router.query])

  useEffect(function () {
    if (getIdToken()) {
      dispatch(authApi.endpoints.getCurrentUser.initiate({}, { forceRefetch: true }))
    }
    getCities('')
  }, [dispatch, getCities])

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
              name="cities"
              value={filters.cities}
              options={citiesOptions}
              refetchOptions={getCities}
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
              options={tagsOptions}
              onChange={handleChange} />
          </div>
          <div className={cn(styles.resetFilters, { [styles.resetFiltersShown]: showReset })}>
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
            <Map items={listings} onBoundsChange={handleMapChange} />
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
                    {pagination.totalDocs || 'No'} results
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
                        {listings.length || 'No'} results
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
                      listings.map(item => (
                        <PhotoItem
                          imageClassName={styles.imageWrapper}
                          key={item._id}
                          favorite={user?.favorites?.includes(item._id)}
                          isOwn={item?.owner ? item.owner === user?._id : item?.creator?.ID === user?._id}
                          onLogin={openLogin}
                          data={item} />
                      ))
                    }
                  </div>
                  {
                    isMapHidden &&
                      <div className={styles.paginationContainer}>
                        <Pagination
                          className={styles.pagination}
                          currentPage={pagination?.page}
                          count={pagination?.totalPages}
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
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}
export default Marketplace