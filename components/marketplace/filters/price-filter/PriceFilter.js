import React, { useState, useEffect } from "react";
import styles from './PriceFilter.module.sass'
import FilterWrapper from "../filter-wrapper/FilterWrapper";
import Typography from "../../../Typography";
import Input from "../../../input/Input";
import cn from "classnames";

function PriceFilter({ className, name, onChange, value, mode }) {
  const [values, setValues] = useState({
    from: '',
    to: ''
  })

  function handleChange({ target: { name, value } }) {
    setValues(prevState => ({
      ...prevState,
      [name]: +value || ''
    }))

    if (mode === 'flat') {
      onChange({ target: { name: 'price', value: { ...values, [name]: +value } } })
    }
  }

  function handleApply() {
    onChange({ target: { name, value: { ...values } } })
  }

  function handleClose() {
    setValues({ ...value} )
  }

  useEffect(function () {
    setValues({ ...value })
  }, [value])

  return (
    <FilterWrapper
      mode={mode}
      className={className}
      title="Price"
      onApply={handleApply}
      onClose={handleClose}>
      <div className={cn(styles.root, { [styles.flat]: mode === 'flat' })}>
        <Typography
          fontSize={14}
          fontWeight={600}
          lHeight={20}
          color={'#111'}>
          Price
        </Typography>
        <Typography
          fontSize={16}
          margin={'16px 0 0'}
          lHeight={20}
          color={'rgba(55, 65, 81, 0.5)'}>
          ETH
        </Typography>
        <div className={styles.row}>
          <Input
            className={styles.input}
            name="from"
            value={values.from}
            onChange={handleChange}
            placeholder="From"
            type="number"
            size="small" />
          <Input
            className={styles.input}
            name="to"
            value={values.to}
            onChange={handleChange}
            placeholder="To"
            type="number"
            size="small" />
        </div>
      </div>
    </FilterWrapper>
  )
}

export default PriceFilter