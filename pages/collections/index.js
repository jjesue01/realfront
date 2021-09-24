import React, { useState } from "react";
import styles from '../../styles/Collections.module.sass'
import Head from "next/head";
import Typography from "../../components/Typography";
import Button from "../../components/button/Button";
import Image from "next/image";
import Link from "next/link";
import ContextMenu from "../../components/context-menu/ContextMenu";
import CreateCollection from "../../components/dialogs/create-collection/CreateCollection";

const data = [
  {
    name: 'New York, Manhattan'
  },
  {
    name: 'Collection name'
  },
]

function Collection({ data }) {
  return (
    <div className={styles.collectionWrapper}>
      <Link href={'/collections/1'} passHref>
        <a>
          <div className={styles.collection}>
            <div className={styles.mainImageWrapper}>
              <Image src="/hero-aparts-big.jpg" layout="fill" objectFit="cover" alt={data.name} />
            </div>
            <div className={styles.collectionContent}>
              <div className={styles.logoWrapper}>
                <Image src="/hero-aparts-small.jpg" layout="fill" objectFit="cover" alt={data.name} />
              </div>
              <div className={styles.collectionName}>
                <Typography fontSize={16} fontWeight={600} lHeight={20}>
                  {data.name}
                </Typography>
                <Typography tag="span" fontSize={10} fontWeight={600} lHeight={12} color={'#5F6774'} margin={'8px 0 0'}>
                  1 item
                </Typography>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <ContextMenu className={styles.btnMenu} />
    </div>
  )
}

function MyCollections() {
  const [collections, setCollections] = useState(data)
  const [createOpened, setCreateOpened] = useState(false)

  const collectionsList = collections.map((collection, index) => (
    <Collection key={index} data={collection} />
  ))

  function toggleCreate() {
    setCreateOpened(prevState => !prevState)
  }

  function handleCreate(collection) {
    setCollections(prevCollections => ([
      ...prevCollections,
      collection
    ]))
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - MyCollections</title>
      </Head>
      <div className={styles.content}>
        <div className="container">
          <div className={styles.info}>
            <Typography
              tag="h1"
              fontWeight={600}
              fontSize={36}
              lHeight={44}>
              My collections
            </Typography>
            <Typography
              fontFamily={'Lato'}
              fontSize={14}
              lHeight={22}
              color={'rgba(55, 65, 81, 0.8)'}
              margin={'24px 0 0'}>
              Create, curate, and manage collections of unique NFTs to share and sell.
            </Typography>
            <Button onClick={toggleCreate} className={styles.btnCreate}>
              Create a collection
            </Button>
          </div>
          <div className={styles.collections}>
            { collectionsList }
          </div>
        </div>
      </div>
      <CreateCollection
        opened={createOpened}
        onClose={toggleCreate}
        onCreate={handleCreate} />
    </main>
  )
}

export default MyCollections