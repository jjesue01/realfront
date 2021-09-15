import React, { useState, useCallback, useEffect } from 'react'
import styles from './MoreFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import Input from "../../../input/Input";
import Checkbox from "../../../checkbox/Checkbox";

const options = [
  'Aerial',
  'Ground',
  'Residential',
  'Commercial',
  'Park',
  'Waterfront',
]

function MoreFilter({ className, name, onChange, value }) {
  const [data, setData] = useState(options.map(option => ({ value: option, checked: false })))
  const [checkedAll, setCheckedAll] = useState(false)
  const [keywords, setKeywords] = useState('')

  const checkboxesList = data.map(({ value, checked }) => (
    <Checkbox
      key={value}
      className={styles.checkbox}
      checked={checked}
      label={value}
      onChange={handleCheckboxChange(value)} />
  ))

  function handleInputChange({ target: { value } }) {
    setKeywords(value)
  }

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
        value: {
          types: data.filter(({ checked }) => checked).map(({ value }) => value),
          keywords
        }
      }
    })
  }

  const handleReset = useCallback(() => {
    let updatedCheckedAll = true
    const updatedData = options.map(item => ({
      value: item,
      checked: value.types.includes(item)
    }))

    updatedData.forEach(item => {
      if (!item.checked) updatedCheckedAll = false
    })

    setCheckedAll(updatedCheckedAll)
    setData(updatedData)
    setKeywords(value.keywords)
  }, [value])

  useEffect(function () {
    handleReset()
  }, [value, handleReset])

  return (
    <FilterWrapper className={className} title="More" onApply={handleApply} onClose={handleReset}>
      <div className={styles.root}>
        <Typography
          fontSize={14}
          fontWeight={600}
          lHeight={20}
          color={'#111'}>
          Type
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
        <Typography
          fontSize={14}
          fontWeight={600}
          lHeight={20}
          margin={'24px 0 0'}
          color={'#111'}>
          Keywords
        </Typography>
        <Input
          className={styles.input}
          name="keywords"
          value={keywords}
          onChange={handleInputChange}
          placeholder="MLS #, yard, etc."
          size="small" />
      </div>
    </FilterWrapper>
  )
}

export default MoreFilter