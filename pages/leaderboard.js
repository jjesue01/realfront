import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from '../styles/Leaderboard.module.sass'
import { useGetLeaderBoardQuery } from "../services/listings";
import cn from 'classnames'
import ArrowShortIcon from './../public/icons/arrow-sort.svg'
import Link from "next/link";
import Typography from "../components/Typography";
import Select from "../components/select/Select";

const sortOptionsDay = [
  {
    label: "Last 24 hours",
    value: "1"
  },
  {
    label: "Last 7 days",
    value: "2",
  },
  {
    label: "Last 30 days",
    value: "3",
  },
  {
    label: "All time",
    value: "4",
  },
]

const sortOptionsResource = [
  {
    label: "All resource",
    value: "5"
  },
  {
    label: "Photo",
    value: "6",
  },
  {
    label: "Video",
    value: "7",
  },
  {
    label: "360 Tour",
    value: "8",
  }
]

const sortOptionsChains = [
  {
    label: "All chains",
    value: "9",
  },
  {
    label: "Etherium",
    value: "10",
  },
  {
    label: "Polygon",
    value: "11",
  },
  {
    label: "Bitcoin",
    value: "12",
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
      <div className={cn(styles.col, styles.colUsername)}>
        <span className={styles.index}>{index + 1}</span>
        <p>{item.name}</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ item.floorPrice }</p>
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
  const [sortItems, setSortItems] = useState();
  const {data : leaderboard} = useGetLeaderBoardQuery({sort : `${activeSortTab}:${sortOrder ? 'desc' : "asc"}`});

  const rowsList = sortItems?.map((item, index) => (
    <RowDetails key={item._id} item={item} index={index}/>
  ))

  const onChangeActiveTab = (tab) => () => {
    setActiveSortTab(tab);
    if (activeSortTab === tab) setSortOrder(prev => !prev);
    else setSortOrder(false);
  }

  const handleChange = ({target : {value, name}}) => {
    console.log("заглушка", value, name);
  }

  useEffect(() => {
    setSortItems(leaderboard);
  }, [leaderboard])

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
            <div className={styles.filtersBlockLeft}>
              <Select
                className={cn(styles.selectSortDay, styles.filter)}
                name="sortByDay"
                value={sortOptionsDay[0]}
                onChange={handleChange}
                options={sortOptionsDay}
                placeholder={'Sort By Day'}
                />
                <Select
                  className={cn(styles.selectSortResource, styles.filter)}
                  name="sortByResources"
                  value={sortOptionsResource[0]}
                  onChange={handleChange}
                  options={sortOptionsResource}
                  placeholder={'Sort By Resources'}
                  />
                <Select
                  className={cn(styles.selectSortChains, styles.filter)}
                  name="sortByChain"
                  value={sortOptionsChains[0]}
                  onChange={handleChange}
                  options={sortOptionsChains}
                  placeholder={'Sort By Chains'}
                  />
            </div>
            <div className={styles.filtersBlockRight}>
            <Select
                className={cn(styles.selectSortVolume, styles.filter)}
                name="sortByVolume"
                value={sortOptionsVolume[0]}
                onChange={handleChange}
                options={sortOptionsVolume}
                placeholder={'Sort By Volume'}
                />
            </div>
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colUsername)} onClick={onChangeActiveTab('name')}>
                    <p>Username</p>
                    {
                    activeSortTab === 'name' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
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