import React, {useEffect, useState} from "react";
import Head from "next/head";
import CollectionInfo from "../../components/collections/details/collection-info/CollectionInfo";
import CollectionFilters from "../../components/collections/details/filters/CollectionFilters";
import CollectionItems from "../../components/collections/details/collection-items/CollectionItems";
import {data} from "../../components/profile/fixtures";
import {getSortedArray} from "../../utils";

function MyCollections() {
  const [sourceData, setSourceData] = useState(data)
  const [filteredData, setFilteredData] = useState(data)
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

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - Collection New York, Manhattan</title>
      </Head>
      <CollectionInfo itemsCount={sourceData.length} />
      <CollectionFilters filters={filters} onChange={handleChange} />
      <CollectionItems data={filteredData} />
    </main>
  )
}

export default MyCollections