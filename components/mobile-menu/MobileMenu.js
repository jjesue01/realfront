import React, {useEffect, useRef} from "react";
import styles from './MobileMenu.module.sass'
import cn from 'classnames'
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "body-scroll-lock";
import Link from 'next/link'
import {useRouter} from "next/router";

function MobileMenu({ opened, onClose }) {
  const router = useRouter()
  const containerRef = useRef()

  useEffect(function toggleScrollLock() {
    if (containerRef.current)
      if (opened)
        disableBodyScroll(containerRef.current)
      else
        enableBodyScroll(containerRef.current)

    return function clear() {
      clearAllBodyScrollLocks();
    }
  }, [opened])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (router.pathname !== url && opened)
        onClose()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, onClose, opened])

  return (
    <div ref={containerRef} className={cn(styles.root, { [styles.opened]: opened })}>
      <div className={styles.menuItems}>
        <Link href="/about">
          <a className={styles.menuItem}>
            Our Story
          </a>
        </Link>
        <Link href="/marketplace">
          <a className={styles.menuItem}>
            Marketplace
          </a>
        </Link>
        <Link href="/faq">
          <a className={styles.menuItem}>
            FAQ
          </a>
        </Link>
      </div>
    </div>
  )
}

export default MobileMenu