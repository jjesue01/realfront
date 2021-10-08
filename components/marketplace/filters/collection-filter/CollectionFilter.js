import React, {useState, useEffect, useCallback} from "react";
import styles from './CollectionFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import SearchIcon from "../../../../public/icons/search-icon.svg";
import Input from "../../../input/Input";
import Checkbox from "../../../checkbox/Checkbox";
import cn from "classnames";

function CollectionFilter({ className, name, onChange, value, mode, options = [] }) {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [checkedAll, setCheckedAll] = useState(false)

  const checkboxesList = getFilteredData().map(({ value, label, checked }) => (
    <Checkbox
      key={value}
      className={styles.checkbox}
      checked={checked}
      label={label}
      onChange={handleCheckboxChange(value)} />
  ))

  function handleInputChange({ target: { value } }) {
    setSearchValue(value)
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
        handleApply(updatedData)
    }
  }

  function getFilteredData() {
    return data.filter(({ value }) => value.toLowerCase().includes(searchValue.toLowerCase()))
  }

  function handleApply(arr = []) {
    const result = arr.length !== 0 ? arr : data
    onChange({
      target: {
        name,
        value: result.filter(({ checked }) => checked).map(({ value }) => value)
      }
    })
  }

  const handleReset = useCallback(() => {
    let updatedCheckedAll = true
    const updatedData = options.map(item => ({
      ...item,
      checked: value.includes(item.value)
    }))

    updatedData.forEach(item => {
      if (!item.checked) updatedCheckedAll = false
    })

    setCheckedAll(updatedCheckedAll)
    setData(updatedData)
    setSearchValue('')
  }, [value, options])

  useEffect(function () {
    handleReset()
  }, [value, handleReset])

  useEffect(function initOptions() {
    if (options.length !== 0) {
      setData(options.map(option => ({ ...option, checked: false })))
    }
  }, [options])

  return (
    <FilterWrapper
      mode={mode}
      className={cn(className, { [styles.flat]: mode === 'flat' })}
      title="Collection"
      onApply={handleApply}
      onClose={handleReset}>
      <div className={styles.header}>
        <Typography fontWeight={600} fontSize={14} lHeight={20} color={'#111'}>
          Collection
        </Typography>
        <Input
          className={styles.inputSearch}
          size="small"
          iconRight={<SearchIcon />}
          name="city"
          value={searchValue}
          placeholder="Search"
          onChange={handleInputChange} />
      </div>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContainer}>
          <div className={styles.content}>
            <div className={styles.checkAllContainer}>
              <Checkbox
                checked={checkedAll}
                label={'All'}
                type="circle"
                onChange={handleCheckboxChange('all')} />
            </div>
            <div className={styles.checkboxes}>
              {
                checkboxesList.length === 0 ?
                  <Typography
                    fontSize={14}
                    color={'#111'}
                    margin={'0px 0 0 40px'}>
                    No collections
                  </Typography>
                  :
                  checkboxesList
              }
            </div>
          </div>
        </div>
      </div>
    </FilterWrapper>
  )
}

export default CollectionFilter