import React from 'react'
import styles from './pagination.module.sass'
import { Icons } from '../../icons';
import cn from "classnames";

export function Pagination({ className, currentPage, count, onNext = () => {}, onPrev = () => {} }) {
  return (
    <div className={cn(className,styles.root)}>
      <p>
        Page
      </p>
      <div className={styles.currentPage}>
        <p>
          { currentPage }
        </p>
      </div>
      <p>
        of
      </p>
      <p className={styles.countPage}>
        { count }
      </p>
      <button onClick={onPrev} className={cn(styles.btnArrow)}>
        <Icons.ArrowShort />
      </button>
      <button onClick={onNext} className={cn(styles.btnArrow, styles.btnArrowNext)}>
        <Icons.ArrowShort />
      </button>
    </div>
  )
}