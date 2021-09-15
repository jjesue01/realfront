import React, { useState, useEffect, useCallback } from 'react'
import styles from './ResourcesFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import Checkbox from "../../../checkbox/Checkbox";

const options = ['Photo', 'Video']

function ResourcesFilter({ className, name, onChange, value }) {
  const [data, setData] = useState(options.map(option => ({ value: option, checked: false })))
  const [checkedAll, setCheckedAll] = useState(false)

  const checkboxesList = data.map(({ value, checked }) => (
    <Checkbox
      key={value}
      className={styles.checkbox}
      checked={checked}
      label={value}
      onChange={handleCheckboxChange(value)} />
  ))

  function handleCheckboxChange(value) {
    return function ({ target: { checked } }) {
      let updatedCheckedAll = true
      let updatedData = [...data]

      if (value === 'all') {
        updatedData = data.map(item => ({ ...item, checked }))
      } else {
        const index = data.findIndex(item => item.value === value)
        updatedData[index].checked = checked
      }

      updatedData.forEach(item => {
        if (!item.checked) updatedCheckedAll = false
      })

      setCheckedAll(updatedCheckedAll)
      setData(updatedData)
    }
  }

  function handleApply() {
    onChange({
      target: {
        name,
        value: data.filter(({ checked }) => checked).map(({ value }) => value)
      }
    })
  }

  const handleReset = useCallback(() => {
    let updatedCheckedAll = true
    const updatedData = options.map(item => ({
      value: item,
      checked: value.includes(item)
    }))

    updatedData.forEach(item => {
      if (!item.checked) updatedCheckedAll = false
    })

    setCheckedAll(updatedCheckedAll)
    setData(updatedData)
  }, [value])

  useEffect(function () {
    handleReset()
  }, [value, handleReset])

  return (
    <FilterWrapper className={className} title="Resources" onApply={handleApply} onClose={handleReset}>
      <div className={styles.root}>
        <Typography
          fontSize={14}
          fontWeight={600}
          lHeight={20}
          color={'#111'}>
          Price
        </Typography>
        <div className={styles.checkboxes}>
          <Checkbox
            className={styles.checkbox}
            checked={checkedAll}
            label={'All'}
            type="circle"
            onChange={handleCheckboxChange('all')} />
          { checkboxesList }
        </div>
      </div>
    </FilterWrapper>
  )
}

export default ResourcesFilter