import React from "react";
import styles from './CollectionItems.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";

function CollectionItems({ data }) {

  const itemsList = data.map((item) => (
    <PhotoItem
      key={item.name}
      data={item}
      type="full" />
  ))

  return (
    <div className={styles.root}>
      <div className="container">
        <Typography fontSize={16} lHeight={20}>
          { data.length > 1 ? data.length : 'No' } results
        </Typography>
        <div className={styles.items}>
          { itemsList }
        </div>
      </div>
    </div>
  )
}

export default CollectionItems