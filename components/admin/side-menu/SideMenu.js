import React from "react";
import styles from './SideMenu.module.sass'
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import {useRouter} from "next/router";
import {adminLinks} from "../../../fixtures";

function SideMenu() {
  const router = useRouter()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link href="/" passHref>
          <a className={styles.homeLink}>
            <Image
              src="/logo.svg"
              width={94}
              height={16}
              alt="HOMEJAB logo" />
          </a>
        </Link>
      </div>
      <ul className={styles.links}>
        {
          adminLinks.map(link => (
            <li key={link.url} className={cn({ [styles.active]: link.url === router.pathname })}>
              <Link href={link.url}>
                { link.label }
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default SideMenu