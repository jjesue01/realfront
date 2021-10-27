import React, {useEffect, useState} from "react";
import Head from "next/head";
import CollectionInfo from "../../components/collections/details/collection-info/CollectionInfo";
import CollectionFilters from "../../components/collections/details/filters/CollectionFilters";
import CollectionItems from "../../components/collections/details/collection-items/CollectionItems";
import {getIdToken, getSortedArray} from "../../utils";
import {useRouter} from "next/router";
import {useGetListingsQuery, useGetPublishedListingsQuery} from "../../services/listings";
import {authApi} from "../../services/auth";
import FullscreenLoader from "../../components/fullscreen-loader/FullscreenLoader";
import {useDispatch, useSelector} from "react-redux";
import {useGetCitiesQuery} from "../../services/cities";

function MyCollections() {
  const dispatch = useDispatch()
  const { query: { id } } = useRouter()
  const { data, refetch: refetchCollection  } = useGetCitiesQuery({ url: id }, { skip: !id })
  const city = data && data[0]
  const user = useSelector(state => state.auth.user)
  const { data: listings } = useGetPublishedListingsQuery({ cityUrl: id }, { skip: !id })
  const isLoading = !city
  const [sourceData, setSourceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    searchValue: '',
    sortBy: 'price_low'
  })

  function handleChange({ target: { name, value } }) {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }))
  }

  useEffect(function filterData() {
    let items = [...sourceData]

    if (filters.searchValue !== '') {
      items = items.filter(({ name, address }) =>
        `${name.toLowerCase()}-${address.toLowerCase()}`.includes(filters.searchValue.toLowerCase()))
    }

    items = getSortedArray(items, filters.sortBy)
    setFilteredData([...items])
  }, [filters, sourceData])

  useEffect(function initListings() {
    if (listings?.docs?.length !== undefined) {
      setSourceData([...listings.docs])
    }
  }, [listings])

  useEffect(function () {
    if (getIdToken()) {
      dispatch(authApi.endpoints.getCurrentUser.initiate())
    }
    refetchCollection()
  }, [dispatch, refetchCollection])

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - Collection New York, Manhattan</title>
      </Head>
      <CollectionInfo city={city} itemsCount={sourceData.length} />
      <CollectionFilters filters={filters} onChange={handleChange} />
      <CollectionItems user={user} data={filteredData} />
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default MyCollections