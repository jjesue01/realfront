import React, { useRef, useEffect  } from 'react'
import styles from './SideFilter.module.sass'
import cn from "classnames";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Typography from "../../Typography";
import CollectionFilter from "../../marketplace/filters/collection-filter/CollectionFilter";
import PriceFilter from "../../marketplace/filters/price-filter/PriceFilter";
import ResourcesFilter from "../../marketplace/filters/resources-filter/ResourcesFilter";
import MoreFilter from "../../marketplace/filters/more-filter/MoreFilter";

function SideFilter({ opened, onClose, filters, onChange }) {
  const filterRef = useRef()

  useEffect(function toggleScrollLock() {
    if (filterRef.current)
      if (opened)
        disableBodyScroll(filterRef.current)
      else
        enableBodyScroll(filterRef.current)

    return function clear() {
      clearAllBodyScrollLocks();
    }
  }, [opened])

  return (
    <div className={cn(styles.root, { [styles.opened]: opened })}>
      <div onClick={onClose} className={styles.closeLayer} />
      <div ref={filterRef} className={styles.filter}>
        <div className={styles.header}>
          <Typography fontWeight={600} fontSize={20}>
            Filters
          </Typography>
          <button onClick={onClose} className={styles.btnClose} />
        </div>
        <div>
          <CollectionFilter
            mode="flat"
            className={styles.filterItem}
            name="collections"
            value={filters.collections}
            options={[]}
            onChange={onChange} />
          <PriceFilter
            mode="flat"
            className={styles.filterItem}
            name="price"
            value={filters.price}
            onChange={onChange} />
          <ResourcesFilter
            mode="flat"
            className={styles.filterItem}
            name="resources"
            value={filters.resources}
            onChange={onChange} />
          <MoreFilter
            mode="flat"
            name="more"
            options={[]}
            value={filters.more}
            onChange={onChange} />
        </div>
      </div>
    </div>
  )
}

export default SideFilter