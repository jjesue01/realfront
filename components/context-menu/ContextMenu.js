import React, { useState } from "react";
import styles from './ContextMenu.module.sass'
import MenuIcon from "../../public/icons/menu-ellipsis.svg";
import cn from "classnames";
import Link from "next/link";
import {copyValue, getHost} from "../../utils";

function ContextMenu({ className, href, hasEdit = false }) {
  const [opened, setOpened] = useState(false)

  function toggleMenu() {
    setOpened(prevState => !prevState)
  }

  function handleCopy() {
    copyValue(getHost() + href.replace(/\/edit/g, ''))
      .then(() => {
        toggleMenu()
      })
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
          {
            hasEdit &&
              <>
                <Link href={href} passHref>
                  Edit
                </Link>
                <div className={styles.hr} />
              </>
          }
          <button onClick={handleCopy}>
            Copy link
          </button>
        </div>
      </div>
    </>
  )
}

export default ContextMenu