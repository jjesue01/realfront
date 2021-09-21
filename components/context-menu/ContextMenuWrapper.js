import React from "react";
import styles from './ContextMenu.module.sass'
import cn from "classnames";

function ContextMenuWrapper({ className, opened, triggerEl, onClose, children }) {

  return (
    <>
      {
        opened &&
        <div onClick={onClose} className={styles.closeLayer} />
      }
      <div className={cn(className, styles.root, { [styles.opened]: opened })}>
        { triggerEl }
        <div className={styles.defaultMenu}>
          { children }
        </div>
      </div>
    </>
  )
}

export default ContextMenuWrapper