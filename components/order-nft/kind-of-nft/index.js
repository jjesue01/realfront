import React from "react";
import styles from './index.module.sass'
import Typography from "../../Typography";
import Card from "../card";

function KindOfNft() {
  return (
    <div className={styles.root}>
      <Card
        className={styles.card}
        checkmarkClassName={styles.checkmark}
        active={true}>
        <Typography
          fontWeight={600}
          fontSize={16}
          lHeight={20}>
          Photography
        </Typography>
      </Card>
      <Card
        className={styles.card}
        checkmarkClassName={styles.checkmark}>
        <Typography
          fontWeight={600}
          fontSize={16}
          lHeight={20}>
          Video
        </Typography>
      </Card>
      <Card
        className={styles.card}
        checkmarkClassName={styles.checkmark}>
        <Typography
          fontWeight={600}
          fontSize={16}
          lHeight={20}>
          3D Virtual Tour
        </Typography>
      </Card>
    </div>
  )
}

export default KindOfNft