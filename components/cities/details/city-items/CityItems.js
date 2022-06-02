import React from "react";
import styles from './CityItems.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";

function CityItems({ data, user, onLogin }) {

  const itemsList = data.map((item) => (
    <PhotoItem
      favorite={user?.favorites?.includes(item._id)}
      key={item._id}
      data={item}
      onLogin={onLogin}
      isOwn={item?.owner ? item.owner === user?._id : item?.creator?.ID === user?._id}
      type="full" />
  ))

  return (
    <div className={styles.root}>
      <div className="container">
        <Typography fontSize={16} lHeight={20}>
          { data.length > 0 ? data.length : 'No' } results
        </Typography>
        <div className={styles.items}>
          { itemsList }
        </div>
      </div>
    </div>
  )
}

export default CityItems