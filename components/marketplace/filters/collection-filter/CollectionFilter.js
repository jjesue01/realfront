import React, {useState, useEffect, useCallback} from "react";
import styles from './CollectionFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import SearchIcon from "../../../../public/icons/search-icon.svg";
import Input from "../../../input/Input";
import Checkbox from "../../../checkbox/Checkbox";

const options = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Philadelphia',
  'Phoenix',
  'Washington',
  'Miami',
]

function CollectionFilter({ className, name, onChange, value }) {
  const [data, setData] = useState(options.map(option => ({ value: option, checked: false })))
  const [searchValue, setSearchValue] = useState('')
  const [checkedAll, setCheckedAll] = useState(false)

  const checkboxesList = getFilteredData().map(({ value, checked }) => (
    <Checkbox
      key={value}
      className={styles.checkbox}
      checked={checked}
      label={value}
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
    }
  }

  function getFilteredData() {
    return data.filter(({ value }) => value.toLowerCase().includes(searchValue.toLowerCase()))
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
    setSearchValue('')
  }, [value])

  useEffect(function () {
    handleReset()
  }, [value, handleReset])

  return (
    <FilterWrapper className={className} title="Collection" onApply={handleApply} onClose={handleReset}>
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