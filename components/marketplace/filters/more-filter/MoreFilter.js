import React, { useState, useCallback, useEffect } from 'react'
import styles from './MoreFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import Input from "../../../input/Input";
import Checkbox from "../../../checkbox/Checkbox";
import cn from "classnames";

function MoreFilter({ className, name, onChange, value, mode, options = [] }) {
  const [data, setData] = useState([])
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

  function handleInputChange({ target: { value: inputValue } }) {
    setKeywords(inputValue)
    if (mode === 'flat') {
      onChange({ target: { name, value: { ...value, keywords: inputValue } } })
    }
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
      if (mode === 'flat')
        onChange({
          target: {
            name,
            value: {
              types: updatedData.filter(({ checked }) => checked).map(({ value }) => value),
              keywords
            }
          }
        })
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
  }, [value, options])

  useEffect(function () {
    handleReset()
  }, [value.types, value.keywords, handleReset])

  useEffect(function initOptions() {
    if (options.length !== 0) {
      setData(options.map(option => ({ value: option, checked: false })))
    }
  }, [options])

  return (
    <FilterWrapper
      mode={mode}
      className={className}
      title="More"
      active={value.types.length !== 0 || !!value.keywords}
      onApply={handleApply}
      onClose={handleReset}>
      <div className={cn(styles.root, { [styles.flat]: mode === 'flat' })}>
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
        <div className={styles.keywords}>
          <Typography
            fontSize={14}
            fontWeight={600}
            lHeight={20}
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
      </div>
    </FilterWrapper>
  )
}

export default MoreFilter