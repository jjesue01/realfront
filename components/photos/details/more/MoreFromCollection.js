import React from "react";
import styles from './MoreFromCollection.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";
import Button from "../../../button/Button";
import {data} from "../../../profile/fixtures";

const items = [
  ...data.slice(0, 3)
]

function MoreFromCollection() {
  const itemsList = items.map((item) => (
    <PhotoItem
      className={styles.item}
      key={item.name}
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
          <Button className={styles.btnCollection} type="outlined">
            View Collection
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MoreFromCollection