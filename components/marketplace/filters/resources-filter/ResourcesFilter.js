import React from 'react'
import styles from './ResourcesFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";

function ResourcesFilter({ className, name, onChange }) {

  function handleApply() {

  }

  return (
    <FilterWrapper className={className} title="Resources" onApply={handleApply}>

    </FilterWrapper>
  )
}

export default ResourcesFilter