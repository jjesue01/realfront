import React, {useEffect, useState} from "react";
import styles from './admin-layout.module.sass'
import SideMenu from "./admin/side-menu/SideMenu";
import {useRouter} from "next/router";
import cn from "classnames";

function AdminLayout({ children }) {
  const router = useRouter()
  const [hasAccess, setAccess] = useState(true)

  // useEffect(function init() {
  //   console.log('admin rerender')
  //   if (router.pathname === '/admin') router.push('/admin/invites')
  //   // eslint-disable-next-line
  // }, [router.pathname])

  if (router.pathname === '/admin')
    return (
      <main className={cn(styles.root, styles.center)}>
        { children }
      </main>
    )

  return (
    <main className={styles.root}>
      <div className="container">
        <SideMenu />
        <div className={styles.content}>
          <h1>Invites</h1>
          <div className={styles.pageContainer}>
            { children }
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminLayout