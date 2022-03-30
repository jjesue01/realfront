import React, {useState} from "react";
import styles from './Input.module.sass'
import cn from "classnames";
import {getFormattedDate} from "../../utils";
import DatePicker from "../date-picker/DatePicker";
import CalendarIcon from '/public/icons/calendar.svg'
import ClockIcon from '/public/icons/clock.svg'
import TimePicker from "../time-picker/TimePicker";

const dropdownTypes = ['date', 'time']

function Input({
  className,
  name,
  value,
  type = 'text',
  onChange,
  placeholder,
  label,
  size = 'default',
  iconRight,
  required,
  subLabel,
  urlPrefix,
  error,
  errorText,
  disabled,
  noPast,
  ...otherProps
}, ref) {
  const [isOpened, setOpened] = useState(false)

  const needsDropdown = dropdownTypes.includes(type)

  const inputClassNames = cn(
    styles.input,
    {
      [styles.small]: size === 'small',
      [styles.iconRight]: !!iconRight,
      [styles.withUrlPrefix]: urlPrefix,
      [styles.price]: type === 'price',
      [styles.error]: error,
      [styles.iconLeft]: needsDropdown
    }
  )

  function getType() {
    let result = type

    if (type === 'price') result = 'number'
    if (needsDropdown) result = 'text'

    return result
  }

  function toggleDropdown() {
    if (needsDropdown)
      setOpened(prevState => !prevState)
  }

  function getDisplayingValue() {
    let displayingValue = value

    if (type === 'date')
      displayingValue = getFormattedDate(value)


    return displayingValue
  }

  function handleDateChange(e) {
    onChange(e)
    toggleDropdown()
  }

  return (
    <div className={cn(className, styles.inputContainer, { [styles.label]: label, [styles.disabled]: disabled })}>
      {
        label &&
        <label htmlFor={name}>
          { label }
        </label>
      }
      {
        subLabel &&
          <p>{subLabel}</p>
      }
      <div className={styles.inputWrapper}>
        {
          urlPrefix &&
            <p className={styles.urlPrefix}>{urlPrefix}</p>
        }
        {
          type === 'price' &&
            <p className={styles.currency}>usd</p>
        }
        {
          needsDropdown &&
            <div className={styles.iconLeftWrapper}>
              {
                type === 'date' &&
                  <CalendarIcon />
              }
              {
                type === 'time' &&
                  <ClockIcon />
              }
            </div>
        }
        <input
          ref={ref}
          id={name}
          className={inputClassNames}
          type={getType()}
          name={name}
          value={getDisplayingValue()}
          onWheel={(e) => e.target.blur()}
          required={required}
          onClick={toggleDropdown}
          onChange={onChange}
          readOnly={needsDropdown || otherProps?.readOnly}
          placeholder={placeholder}
          { ...otherProps } />
        { iconRight }
        {
          error && errorText &&
          <p className={styles.errorText}>{ errorText }</p>
        }
        {
          needsDropdown &&
            <div className={cn(styles.dropdown, { [styles.dropdownOpened]: isOpened })}>
              {
                type === 'date' &&
                <DatePicker
                  name={name}
                  value={value}
                  onChange={handleDateChange} 
                  noPast={noPast}/>
              }
              {
                type === 'time' &&
                  <TimePicker
                    name={name}
                    value={value}
                    onChange={onChange} />
              }
            </div>
        }
        {
          isOpened &&
            <div onClick={toggleDropdown} className={styles.closeLayer} />
        }
      </div>
    </div>
  )
}

export default React.forwardRef(Input)