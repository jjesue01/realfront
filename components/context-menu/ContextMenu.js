import React, {useRef, useState} from "react";
import styles from './ContextMenu.module.sass'
import MenuIcon from "../../public/icons/menu-ellipsis.svg";
import cn from "classnames";
import Link from "next/link";
import {getHost} from "../../utils";
import ButtonCopy from "../button-copy/ButtonCopy";

function ContextMenu({ className, href, hasEdit = false }) {
  const [opened, setOpened] = useState(false)
  const copyRef = useRef()

  function toggleMenu() {
    setOpened(prevState => !prevState)
  }

  function handleCopy() {
    copyRef.current.click();
  }

  function getCopyValue() {
    return getHost() + href.replace(/\/edit/g, '')
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
          <div onClick={handleCopy}  className={styles.copyWrapper}>
            <ButtonCopy ref={copyRef} className={styles.btnCopy} value={getCopyValue()} onCopied={toggleMenu}>
              Copy link
            </ButtonCopy>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContextMenu