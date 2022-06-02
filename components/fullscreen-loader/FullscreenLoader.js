import React from "react";
import styles from './FullscreenLoader.module.sass'
import Loader from "../loader/Loader";
import cn from "classnames";

function FullscreenLoader({ opened }) {
  return (
    <div className={cn(styles.root, { [styles.opened]: opened })}>
      <Loader opened={opened} color="accent" />
    </div>
  )
}

export default FullscreenLoader