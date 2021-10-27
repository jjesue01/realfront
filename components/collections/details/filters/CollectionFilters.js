import React from "react";
import styles from './CollectionFilters.module.sass'
import Input from "../../../input/Input";
import cn from "classnames";
import SearchIcon from "../../../../public/icons/search-icon.svg";
import Select from "../../../select/Select";
import {sortOptions} from "../../../profile/fixtures";
import Button from "../../../button/Button";
import {useRouter} from "next/router";

function CollectionFilters({ filters, onChange, }) {

  return (
    <div className={styles.root}>
      <div className="container">
        <div className={styles.filters}>
          <Input
            className={cn(styles.inputSearch, { [styles.inputSearchActive]: filters.searchValue !== '' } )}
            type="search"
            name="searchValue"
            value={filters.searchValue}
            onChange={onChange}
            iconRight={<SearchIcon />}
            placeholder="Search" />
          <Select
            className={styles.selectSort}
            name="sortBy"
            value={filters.sortBy}
            onChange={onChange}
            options={sortOptions}
            placeholder={'Sort By'} />
          {/*{*/}
          {/*  isOwner &&*/}
          {/*  <Button onClick={handleAddItem}>*/}
          {/*    Add item*/}
          {/*  </Button>*/}
          {/*}*/}
        </div>
      </div>
    </div>
  )
}

export default CollectionFilters