import React from 'react'
import styles from './CollectionPicker.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";
import Image from "next/image";

function CollectionsPicker({ className, collections, onCreate, onChange }) {

  const collectionsList = collections.map((collection, index) => (
    <div
      role="button"
      key={collection._id}
      className={cn(styles.collection, { [styles.active]: collection.checked })}
      onClick={handleClick(index)}>
      <div className={styles.imageWrapper}>
        <Image
          //src={collection.logo}
          src={'/hero-aparts-big.jpg'}
          layout="fill"
          objectFit="cover"
          alt="collection" />
      </div>
      <Typography fontWeight={600} fontSize={14}>
        { collection.name }
      </Typography>
    </div>
  ))

  function handleClick(index) {
    return function () {
      const updatedCollections = [...collections];
      updatedCollections[index].checked = !updatedCollections[index].checked
      onChange(updatedCollections)
    }
  }

  return (
    <div className={cn(className, styles.root)}>
      <Typography
        fontWeight={600}
        fontSize={16}
        lHeight={20}>
        Collection
      </Typography>
      <Typography
        fontFamily={'Lato'}
        fontSize={14}
        lHeight={22}
        margin={'10px 0 0'}
        color={'rgba(55, 65, 81, 0.8)'}>
        This is the collection where your item will appear.
      </Typography>
      <div className={styles.collections}>
        { collectionsList }
        <button onClick={onCreate} className={styles.btnAdd} type="button">
          <span>Create collection</span>
        </button>
      </div>
    </div>
  )
}

export default CollectionsPicker