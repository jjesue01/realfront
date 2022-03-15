import React, {useState} from "react";
import styles from './index.module.sass'
import Typography from "../../Typography";
import Checkbox from "../../checkbox/Checkbox";
import Input from "../../input/Input";

const items = [
  {
    value: 'Text'
  },
  {
    value: 'Email'
  },
  {
    value: 'Discord'
  },
  {
    value: 'WhatsApp'
  },
  {
    value: 'Telegram'
  },
]

function ContactChannel() {
  const [currentValue, setCurrentValue] = useState('Email')
  const [inputValue, setInputValue] = useState('')

  function handleChange(value) {
    return function () {
      setCurrentValue(value)
    }
  }

  function handleInputChange({ target: { value } }) {
    setInputValue(value)
  }

  return (
    <div className={styles.root}>
      <Typography fontWeight={600} fontSize={16} lHeight={20}>
        I prefer
      </Typography>
      <div className={styles.options}>
        {
          items.map(item => (
            <div key={item.value} className={styles.option}>
              <Checkbox
                label={item.value}
                onChange={handleChange(item.value)}
                checked={currentValue === item.value}
                type="circle" />
              {
                currentValue === item.value &&
                <Input
                  className={styles.input}
                  value={inputValue}
                  placeholder={'Enter your ' + item.value}
                  onChange={handleInputChange} />
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ContactChannel