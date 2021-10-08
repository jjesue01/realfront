import React from "react";
import styles from './CollectionItems.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";

function CollectionItems({ data, user }) {

  const itemsList = data.map((item) => (
    <PhotoItem
      favorite={user?.favorites?.includes(item._id)}
      key={item._id}
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