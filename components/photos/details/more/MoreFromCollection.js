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
      isOwn={item?.owner ? item.owner === user?._id : item?.creator?.ID === user?._id}
      type="full" />
  ))

  return (
    <section className={styles.root}>
      <div className="container">
        <Typography fontSize={18} fontWeight={600} lHeight={22} color={'#000000'}>
          More from this city
        </Typography>
        <div className={styles.items}>
          { itemsList }
        </div>
        <div className={styles.actions}>
          <Button onClick={onViewCollection} className={styles.btnCollection} type="outlined">
            View City
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MoreFromCollection