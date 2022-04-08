import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from '../styles/Leaderboard.module.sass'
import { useGetLeaderBoardQuery } from "../services/listings";
import cn from 'classnames'
import Link from "next/link";
import Image from "next/image";
import Typography from "../components/Typography";
import Select from "../components/select/Select";
import { dateToString, DAY_TIME } from "../utils";
import Pagination from "../components/pagination/Pagination";

const LIMIT_PER_PAGE = 50

const sortOptionsDay = [
  {
    label: "All time",
    value: dateToString(new Date(0)),
  },
  {
    label: "Last 24 hours",
    value: dateToString(new Date(new Date().getTime() - DAY_TIME)),
  },
  {
    label: "Last 7 days",
    value: dateToString(new Date(new Date().getTime() - DAY_TIME * 7)),
  },
  {
    label: "Last 30 days",
    value: dateToString(new Date(new Date().getTime() - DAY_TIME * 30)),
  },
]

const sortOptionsResource = [
  {
    label: "All resource",
    value: "all"
  },
  {
    label: "Photo",
    value: "Image",
  },
  {
    label: "Video",
    value: "Video",
  },
  {
    label: "360 Tour",
    value: "360 Tour",
  }
]

const sortOptionsChains = [
  {
    label: "All chains",
    value: "all",
  },
  {
    label: "Polygon",
    value: "polygon",
  },
  {
    label: "BSC",
    value: "binance_smart_chain",
  },
]

const sortOptionsVolume = [
  {
    label: 'Volume: Low to High',
    value: 'volume:asc'
  },
  {
    label: 'Volume: High to Low',
    value: 'volume:desc'
  },
  {
    label: 'Price: Low to High',
    value: 'price:asc'
  },
  {
    label: 'Price: High to Low',
    value: 'price:desc'
  },
  {
    label: 'Items: Low to High',
    value: 'items:asc'
  },
  {
    label: 'Items: High to Low',
    value: 'items:desc'
  },
  {
    label: 'Owners: Low to High',
    value: 'owner:asc'
  },
  {
    label: 'Owners: High to Low',
    value: 'owner:desc'
  },
]

const RowDetails = ({item, index}) => {

  return (
  <Link href={`/profile/${item.name}`} passHref>
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colNumber)}>
        <p>{index + 1}</p>
      </div>
      <div className={cn(styles.col, styles.colLogo)}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {
              item?.userLogo &&
              <Image src={item.userLogo} layout="fill" objectFit="cover" alt={item.name}/>
            }
          </div>
        </div>
        
      </div>
      <div className={cn(styles.col, styles.colUsername)}>
        <p>{item.name}</p>
      </div>
      <div className={cn(styles.col, styles.colVolume)}>
        <p>{item.volume}</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ item.floorPrice }</p>
      </div>
      <div className={cn(styles.col, styles.colOwners)}>
        <p>{item.owner}</p>
      </div>
      <div className={cn(styles.col, styles.colItems)}>
        <p>{ item.items }</p>
      </div>
    </div>
  </Link>
  )
}

const Leaderboard = () => {
  const [filters, setFilters] = useState({
    sort: 'volume:desc',
    resource: 'all',
    blockchain: 'all',
    startDate: dateToString(new Date(0)),
    endDate: dateToString(new Date()),
  })
  const {data : leaderboard} = useGetLeaderBoardQuery({...filters});
  const [currentPage, setCurrentPage] = useState(1);

  const rowsList = leaderboard?.map((item, index) => (
    <RowDetails key={item._id} item={item} index={index}/>
  )).slice(LIMIT_PER_PAGE * (currentPage - 1), LIMIT_PER_PAGE * currentPage )

  const countPage = Math.ceil(leaderboard?.length / LIMIT_PER_PAGE);

  const handleChange = ({target : {value, name}}) => {
    setCurrentPage(1)
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  const handleNextPage = () => {
    if (currentPage < countPage) setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  } 

  return (
    <main className={styles.root}>
      <Head>
        <title>Leaderboard - real NFT marketplace</title>
      </Head>
      <section className={styles.container}>
          <div className={styles.description}>
            <Typography 
              tag={"h1"} 
              margin={'0 0 24px 0'} 
              align="center"
              fontSize={36}
              fontWeight={600}
              lHeight={44}
              color={"#111111"}>
                Top NFTs
              </Typography>
            <Typography 
              tag={"p"} 
              align="center"
              color={"#374151"}
              fontSize={18}
              fontWeight={500}
              lHeight={32}>
                The top NFTs on real marketplace, ranked by volume, floor price and othen statistics
            </Typography>
          </div>
          <div className={styles.filtersBlock}>
          <Select
            className={cn(styles.selectSortDay, styles.filter)}
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            options={sortOptionsDay}
            placeholder={'Sort By Day'}
            />
            <Select
              className={cn(styles.selectSortResource, styles.filter)}
              name="resource"
              value={filters.resource}
              onChange={handleChange}
              options={sortOptionsResource}
              placeholder={'Sort By Resources'}
              />
            <Select
              className={cn(styles.selectSortChains, styles.filter)}
              name="blockchain"
              value={filters.blockchain}
              onChange={handleChange}
              options={sortOptionsChains}
              placeholder={'Sort By Chains'}
              />
            <Select
              className={cn(styles.selectSortVolume)}
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              options={sortOptionsVolume}
              placeholder={'Sort By Volume'}
              />
          </div>
          {
            rowsList && 
            <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colNumber)}>
                    <p>#</p>
                  </div>
                  <div className={cn(styles.col, styles.colLogo)}>
                    <p>Logo</p>
                  </div>
                  <div className={cn(styles.col, styles.colUsername)}>
                    <p>Username</p>
                  </div>
                  <div className={cn(styles.col, styles.colVolume)}>
                    <p>Volume</p>
                  </div>
                  <div className={cn(styles.col, styles.colPrice)}>
                    <p>Floor Price</p>
                  </div>
                  <div className={cn(styles.col, styles.colOwners)}>
                    <p>Owners</p>
                  </div>
                  <div className={cn(styles.col, styles.colItems)}>
                    <p>Items</p>
                  </div>
              </div>
              <div className={styles.tableBody}>
                 { rowsList }
              </div>
            </div>
            {
              countPage > 1 && 
              <div className={styles.pagination}>
              <Pagination currentPage={currentPage} count={countPage} onNext={handleNextPage} onPrev={handlePrevPage}/>
            </div>
            }
          </div>
          }
      </section>
    </main>
  )
  
}

export default Leaderboard;