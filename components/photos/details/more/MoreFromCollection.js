import React from "react";
import styles from './MoreFromCollection.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";
import Button from "../../../button/Button";

function MoreFromCollection({ data = [], onViewCollection, user }) {
  const itemsList = data.map((item) => (
    <PhotoItem
      favorite={user?.favorites?.includes(item._id)}
      className={styles.item}
      key={item._id}
      data={item}
      type="full" />
  ))

  return (
    <section className={styles.root}>
      <div className="container">
        <Typography fontSize={18} fontWeight={600} lHeight={22} color={'#000000'}>
          More from this collection
        </Typography>
        <div className={styles.items}>
          { itemsList }
        </div>
        <div className={styles.actions}>
          <Button onClick={onViewCollection} className={styles.btnCollection} type="outlined">
            View Collection
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MoreFromCollection