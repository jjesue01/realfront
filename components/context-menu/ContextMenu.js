import React, { useState } from "react";
import styles from './ContextMenu.module.sass'
import MenuIcon from "../../public/icons/menu-ellipsis.svg";
import cn from "classnames";
import Link from "next/link";
import Typography from "../Typography";

function ContextMenu({ className }) {
  const [opened, setOpened] = useState(false)

  function toggleMenu() {
    setOpened(prevState => !prevState)
  }

  return (
    <>
      {
        opened &&
        <div onClick={toggleMenu} className={styles.closeLayer} />
      }
      <div className={cn(className, styles.root, { [styles.opened]: opened })}>
        <button onClick={toggleMenu} className={styles.btnMenu}>
          <MenuIcon />
        </button>
        <div className={styles.menu}>
          <Link href={'/about'} passHref>
            Edit
          </Link>
          <div className={styles.hr} />
          <button>
            Copy link
          </button>
        </div>
      </div>
    </>
  )
}

export default ContextMenu