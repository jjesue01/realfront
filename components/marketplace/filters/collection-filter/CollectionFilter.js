import React, {useState, useEffect, useCallback} from "react";
import styles from './CollectionFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import SearchIcon from "../../../../public/icons/search-icon.svg";
import Input from "../../../input/Input";
import Checkbox from "../../../checkbox/Checkbox";
import cn from "classnames";

function CollectionFilter({ className, name, onChange, value, mode, options = [], refetchOptions }) {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [checkedAll, setCheckedAll] = useState(false)
  const [inputName, setInputName] = useState('city')

  const checkboxesList = options.map(({ value, label, checked }) => (
    <Checkbox
      key={value}
      className={styles.checkbox}
      checked={isChecked(value)}
      label={label}
      onChange={handleCheckboxChange(value)} />
  ))

  function handleInputChange({ target: { value } }) {
    setSearchValue(value)
    refetchOptions(value)
  }

  function handleCheckboxChange(value) {
    return function ({ target: { checked } }) {
      let updatedCheckedAll = true
      let updatedData = [...data]

      if (value === 'all') {
        setCheckedAll(checked)
        updatedData = []
      } else if (updatedData.includes(value)) {
        updatedData = updatedData.filter(id => id !== value)
      } else {
        updatedData = [...updatedData, value]
      }

      if (mode === 'flat')
        handleApply(updatedData)
      else
        setData(updatedData)
    }
  }

  function isChecked(id) {
    return data.includes(id) || checkedAll
  }

  function handleApply(arr = []) {
    const result = arr.length !== 0 ? arr : data
    console.log(result)
    onChange({
      target: {
        name,
        value: result
      }
    })
  }

  const handleReset = useCallback(() => {
    setData([...value])
    setSearchValue('')
  }, [value])

  useEffect(function () {
    setInputName(Date.now() + 'city')
    setData(value)
  }, [value])

  return (
    <FilterWrapper
      mode={mode}
      className={cn(className, { [styles.flat]: mode === 'flat' })}
      title="City"
      active={value.length !== 0}
      onApply={handleApply}
      onClose={handleReset}>
      <div className={styles.header}>
        <Typography fontWeight={600} fontSize={14} lHeight={20} color={'#111'}>
          City
        </Typography>
        <Input
          className={styles.inputSearch}
          size="small"
          iconRight={<SearchIcon />}
          name={inputName}
          value={searchValue}
          placeholder="Search"
          autoComplete="chrome-off"
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