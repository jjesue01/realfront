import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from '../styles/Leaderboard.module.sass'
import { useGetLeaderBoardQuery } from "../services/listings";
import cn from 'classnames'
import ArrowShortIcon from './../public/icons/arrow-sort.svg'
import Link from "next/link";
import Image from "next/image";
import Typography from "../components/Typography";
import Select from "../components/select/Select";
import { DAY_TIME } from "../utils";

const sortOptionsDay = [
  {
    label: "Last 24 hours",
    value: new Date(new Date().getTime() - DAY_TIME).toUTCString(),
  },
  {
    label: "Last 7 days",
    value: new Date(new Date().getTime() - DAY_TIME * 7).toUTCString(),
  },
  {
    label: "Last 30 days",
    value: new Date(new Date().getTime() - DAY_TIME * 30).toUTCString(),
  },
  {
    label: "All time",
    value: new Date(0).toUTCString(),
  },
]

const sortOptionsResource = [
  {
    label: "All resource",
    value: ""
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
    value: "",
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
    value: '13'
  },
  {
    label: 'Volume: High to Low',
    value: '14'
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
        <p>{item.owners}</p>
      </div>
      <div className={cn(styles.col, styles.colItems)}>
        <p>{ item.items }</p>
      </div>
    </div>
  </Link>
  )
}

const Leaderboard = () => {
  const [sortOrder, setSortOrder] = useState(false);
  const [activeSortTab, setActiveSortTab] = useState('');
  const [filters, setFilters] = useState({
    sort: '',
    resource: '',
    blockchain: '',
    startDate: new Date(0).toUTCString(),
    endDate: new Date().toUTCString(),
  })
  const {data : leaderboard} = useGetLeaderBoardQuery({...filters});

  const rowsList = leaderboard?.map((item, index) => (
    <RowDetails key={item._id} item={item} index={index}/>
  ))

  const onChangeActiveTab = (tab) => () => {
    setActiveSortTab(tab);
    if (activeSortTab === tab) setSortOrder(prev => !prev);
    else setSortOrder(false);
  }

  const handleChange = ({target : {value, name}}) => {
    console.log(value, name);
    setFilters(prevState => ({ ...prevState, [name]: value }))
  }

  React.useEffect(() => {
    setFilters(prevState => ({
      ...prevState,
      sort: `${activeSortTab}:${sortOrder ? 'desc' : 'asc'}`
    }))
  },[activeSortTab, sortOrder])

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
              name="sortByVolume"
              value={sortOptionsVolume[0]}
              onChange={handleChange}
              options={sortOptionsVolume}
              placeholder={'Sort By Volume'}
              />
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colNumber)}>
                    <p>#</p>
                  </div>
                  <div className={cn(styles.col, styles.colLogo)}>
                    <p>Logo</p>
                  </div>
                  <div className={cn(styles.col, styles.colUsername)} onClick={onChangeActiveTab('name')}>
                    <p>Username</p>
                    {
                    activeSortTab === 'name' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
                  <div className={cn(styles.col, styles.colVolume)}>
                    <p>Volume</p>
                  </div>
                  <div className={cn(styles.col, styles.colPrice)} onClick={onChangeActiveTab('price')}>
                    <p>Floor Price</p>
                    {
                    activeSortTab === 'price' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
                  <div className={cn(styles.col, styles.colOwners)}>
                    <p>Owners</p>
                  </div>
                  <div className={cn(styles.col, styles.colItems)} onClick={onChangeActiveTab('items')}>
                    <p>Items</p>
                    {
                    activeSortTab === 'items' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
              </div>
              
              <div className={styles.tableBody}>
                 { rowsList }
              </div>
            </div>
          </div>
      </section>
    </main>
  )
  
}

export default Leaderboard;