import React, {useEffect, useState} from "react";
import Head from "next/head";
import CollectionInfo from "../../components/collections/details/collection-info/CollectionInfo";
import CollectionFilters from "../../components/collections/details/filters/CollectionFilters";
import CollectionItems from "../../components/collections/details/collection-items/CollectionItems";
import {getSortedArray} from "../../utils";
import {useGetCollectionByIdQuery} from "../../services/collections";
import {useRouter} from "next/router";
import {useGetListingsQuery} from "../../services/listings";
import {useGetCurrentUserQuery} from "../../services/auth";
import FullscreenLoader from "../../components/fullscreen-loader/FullscreenLoader";

function MyCollections() {
  const { query: { id } } = useRouter()
  const { data: collection  } = useGetCollectionByIdQuery(id)
  const { data: user } = useGetCurrentUserQuery()
  const { data: listings } = useGetListingsQuery({ collection: id })
  const isLoading = !collection || !user || !listings
  const [sourceData, setSourceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    searchValue: '',
    sortBy: 'price_low'
  })
  const isOwner = collection?.owner === user?._id

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

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - Collection New York, Manhattan</title>
      </Head>
      <CollectionInfo isOwner={isOwner} collection={collection} itemsCount={sourceData.length} />
      <CollectionFilters isOwner={isOwner} filters={filters} onChange={handleChange} />
      <CollectionItems user={user} data={filteredData} />
      <FullscreenLoader opened={isLoading} />
    </main>
  )
}

export default MyCollections