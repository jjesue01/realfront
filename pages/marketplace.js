import React, {useState, useEffect, useRef, useCallback} from 'react'
import styles from '../styles/Marketplace.module.sass'
import Head from "next/head";
import Input from "../components/input/Input";
import SearchIcon from "../public/icons/search-icon.svg";
import ArrowLongIcon from '/public/icons/arrow-long.svg'
import cn from "classnames";
import Button from "../components/button/Button"
import CollectionFilter from "../components/marketplace/filters/collection-filter/CollectionFilter";
import PriceFilter from "../components/marketplace/filters/price-filter/PriceFilter";
import ResourcesFilter from "../components/marketplace/filters/resources-filter/ResourcesFilter";
import MoreFilter from "../components/marketplace/filters/more-filter/MoreFilter";
import Typography from "../components/Typography";
import PhotoItem from "../components/photo-item/PhotoItem";
import Select from "../components/select/Select";
import Map from "../components/marketplace/map/Map";
import Pagination from "../components/pagination/Pagination";
import { getIdToken, scrollToTop} from "../utils";
import {useRouter} from "next/router";
import {listingsApi, useGetTagsQuery} from "../services/listings";
import {authApi} from "../services/auth";
import FullscreenLoader from "../components/fullscreen-loader/FullscreenLoader";
import {useDispatch, useSelector} from "react-redux";
import {citiesApi} from "../services/cities";
import {HOST_NAME} from "../fixtures";

const sortOptions = [
  {
    label: 'Price: Low to High',
    value: 'bid.highest:desc'
  },
  {
    label: 'Price: High to Low',
    value: 'bid.highest:asc'
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
  const [activeItem, setActiveItem] = useState(null)
  const [filters, setFilters] = useState({
    ...initialFilters,
    sortBy: 'bid.highest:desc'
  })
  const [pagination, setPagination] = useState({})
  const [searchInputValue, setSearchInputValue] = useState('');
  const [markers, setMarkers] = useState([]);
  const [scrollPage, setScrollPage] = useState(1);

  const itemsPerPage = 15

  const mounted = useRef(false)
  const mapMounted = useRef(false)
  const boundsChanged = useRef(false)

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
    scrollListingsToTop(); 
    setFilters(prevState => ({ ...prevState, [name]: value, page : 1 }))
  }

  function handleSubmit (e) {
    e.preventDefault();
    setFilters(prevState => ({ ...prevState, searchValue: searchInputValue, page : 1}))
  }

  function handleChangeInput ({target : {value}}){
    setSearchInputValue(value)
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
    setSearchInputValue('')
  }

  function handleMapChange(bounds) {
    mapMounted.current = true
    boundsChanged.current = true
    scrollListingsToTop();
    setFilters(prevFilters => ({...prevFilters,bounds}))
  }

  function handleMouseEnter(item) {
    return function () {
      setActiveItem(item)
    }
  }

  function handleMouseLeave() {
    setActiveItem(null)
  }

  const getCities = useCallback((value) => {
    dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value, listed: true }))
      .then(({ data }) => {
        setCitiesOptions(data)
      })
  }, [dispatch])

  function fetchData(){
    if (scrollPage !== null) {
      const params = {
        bounds: filters.bounds,
        search: filters.searchValue,
        city: filters.cities.map(({ value }) => value).join(),
        price: [+filters.price.from || '', +filters.price.to || ''].join(),
        tags: filters.more.types.join(),
        sort: filters.sortBy,
        keyword: filters.more.keywords.split(',').map(item => item.trim()).join(),
        page : scrollPage,
    }

    if (filters.resources.length !== 0)
      params.resource = filters.resources.join()

      dispatch(listingsApi.endpoints.getPublishedListings.initiate({...params}))
      .then(({ data, isLoading }) => {
        if (!isLoading && data?.docs && mounted.current) {
          const { docs, ...paginationInfo } = data
          // const sortedListings = getSortedArray(data?.docs || [], filters.sortBy)
          if (data.nextPage === null) setScrollPage(null);
          setListings((prevState) => ([...prevState, ...data?.docs]))
          setPagination(paginationInfo)
          setLoading(false)
        }
      })
    }
  }

  function scrollListingsToTop(top = 0) {
    const scroll = document.getElementById('scrollView')
    scroll.scrollTo({
      top,
    })
  }

  useEffect(() => {
    if (scrollPage == 1 || scrollPage == null) return;
    else fetchData(); 
  }, [scrollPage])

  useEffect(() => {
    function scrollInfinite (){
      let block = document.getElementById('scrollView');

      let heightScroll = block.scrollHeight;
      let heightBlock = block.clientHeight + block.scrollTop;

      if (heightBlock >= heightScroll) setScrollPage(prev => {
        if (prev === null) return prev;
        return prev + 1
      });
    };
    let block = document.getElementById('scrollView');
    
    block?.addEventListener("scroll", scrollInfinite);
    return () => {block?.removeEventListener("scroll", scrollInfinite);}
  }, [])

  useEffect(function mount() {
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(function hideFooter() {
      toggleFooter()
      mounted.current = true
      document.body.style.position = 'fixed'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(function filterData() {
    if (mapMounted.current || isMapHidden) {
      const { sortBy, ...currentFilters } = filters

      setShowReset(JSON.stringify({ ...currentFilters, bounds: '', page: 1 }) !== JSON.stringify(initialFilters))

      const params =  {
        bounds: filters.bounds,
        search: filters.searchValue,
        city: filters.cities.map(({ value }) => value).join(),
        price: [+filters.price.from || '', +filters.price.to || ''].join(),
        tags: filters.more.types.join(),
        sort: filters.sortBy,
        keyword: filters.more.keywords.split(',').map(item => item.trim()).join(),
      }

      if (filters.resources.length !== 0)
        params.resource = filters.resources.join()

      if (isMapHidden) {
        params.bounds = ''
        params.limit = itemsPerPage
        params.page = filters.page
      }

      if (boundsChanged.current) {
        boundsChanged.current = false
      } else {
        setLoading(true)
      }

      dispatch(listingsApi.endpoints.getMarkers.initiate({...params}))
        .then(({data, isLoading}) => {
          if (!isLoading && data.docs && mounted.current) {
            setMarkers(data?.docs || []);
          }
        });
      
      dispatch(listingsApi.endpoints.getPublishedListings.initiate({...params}))
        .then(({ data, isLoading }) => {
          if (!isLoading && data?.docs && mounted.current) {
            const { docs, ...paginationInfo } = data
            // const sortedListings = getSortedArray(data?.docs || [], filters.sortBy)
            setListings(data?.docs || [])
            setPagination(paginationInfo)
            setLoading(false);
            
            setScrollPage(1);
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

  useEffect(function init() {
    if (window.innerWidth < 950) {
      console.log('hide map')
      document.body.style.position = 'static'
      mapMounted.current = false
      setIsMapHidden(true)
      toggleFooter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={cn(styles.root, { [styles.rootFull]: isMapHidden })}>
      <Head>
        <title>Explore Real Estate NFTs For Sale - HomeJab</title>
        <meta name="description" content="Search for real estate photos and videos for sale from professional photographers around the world." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Explore Real Estate NFTs For Sale - HomeJab" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/marketplace'} />
        <meta property="og:image" content="/homejab-icon-512.png" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="Search for real estate photos and videos for sale from professional photographers around the world." />
      </Head>
      <div className={styles.filters}>
        <div className={styles.filtersContainer}>
          <div className={styles.filtersContent}>
            <form className = {styles.searchContainer} onSubmit={handleSubmit}>
              <Input
                className={cn(styles.inputSearch, { [styles.inputSearchActive]: filters.searchValue !== '' } )}
                type="search"
                name="searchValue"
                size="small"
                placeholder="Search for images"
                value={searchInputValue}
                onChange={handleChangeInput} />
              <Button className={styles.btnSearch} htmlType="submit"><SearchIcon/></Button>
            </form>
            <div className={styles.filterItems}>
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
            <Map
              items={markers}
              activeItem={activeItem}
              onActiveItemChange={setActiveItem}
              onBoundsChange={handleMapChange} />
            <button onClick={toggleMap} className={styles.btnHideMap}>
              <ArrowLongIcon />
              <Typography tag="span" fontSize={14} color={'#000'}>
                  Hide map
              </Typography>
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
            <div className={styles.itemsContainer} >
              <div className={styles.scrollContainer} id ={!isMapHidden ? "scrollView" : null}>
                <div className={styles.itemsContent}>
                  {
                    !isMapHidden &&
                    <div className={styles.itemsHeader}>
                      <Typography fontSize={16}>
                        {markers.length || 'No'} results
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
                  <div className={styles.itemsGrid} >
                    {
                      listings.map(item => (
                        <PhotoItem
                          //imageClassName={styles.imageWrapper}
                          key={item._id}
                          favorite={user?.favorites?.includes(item._id)}
                          active={ activeItem?._id === item._id }
                          isOwn={item?.owner ? item.owner === user?._id : item?.creator?.ID === user?._id}
                          onLogin={openLogin}
                          onMouseEnter={handleMouseEnter(item)}
                          onMouseLeave={handleMouseLeave}
                          data={item} />
                      ))
                    }
                  </div>
                  {
                    isMapHidden && !!pagination.totalDocs &&
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