import React from 'react'
import styles from './Pagination.module.sass'
import Typography from "../Typography";
import ArrowShort from '/public/icons/arrow-short.svg'
import cn from "classnames";

function Pagination({ className, currentPage, count, onNext = () => {}, onPrev = () => {} }) {
  return (
    <div className={cn(className,styles.root)}>
      <Typography fontSize={14}>
        Page
      </Typography>
      <div className={styles.currentPage}>
        <Typography fontSize={14} fontWeight={600}>
          { currentPage }
        </Typography>
      </div>
      <Typography fontSize={14} color={'#878D97'}>
        of
      </Typography>
      <Typography fontSize={14} color={'#878D97'} margin={'0 14px 0 16px'}>
        { count }
      </Typography>
      <button onClick={onPrev} className={cn(styles.btnArrow)}>
        <ArrowShort />
      </button>
      <button onClick={onNext} className={cn(styles.btnArrow, styles.btnArrowNext)}>
        <ArrowShort />
      </button>
    </div>
  )
}

export default Pagination