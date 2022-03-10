import React, {useEffect} from "react";
import styles from './admin-layout.module.sass'
import SideMenu from "./admin/side-menu/SideMenu";
import {useRouter} from "next/router";
import cn from "classnames";
import {useSelector} from "react-redux";
import {adminLinks} from "../fixtures";
import Toasts from "./toasts/Toasts";

function AdminLayout({ children }) {
  const router = useRouter()
  const admin = useSelector(state => state.auth.admin)
  const pageName = adminLinks.find(({ url }) => router?.pathname.includes(url))?.label || ''

  useEffect(function init() {
    if (!admin.hasAccess) router.push('/admin')
    // eslint-disable-next-line
  }, [admin.hasAccess])

  if (router.pathname === '/admin')
    return (
      <main className={cn(styles.root, styles.center)}>
        { children }
        <Toasts />
      </main>
    )

  return (
    <main className={styles.root}>
      <div className={cn('container', styles.adminLayoutContainer)}>
        <SideMenu />
        <div className={styles.content}>
          <h1>{ pageName }</h1>
          <div className={styles.pageContainer}>
            { children }
          </div>
        </div>
      </div>
      <Toasts />
    </main>
  )
}

export default AdminLayout