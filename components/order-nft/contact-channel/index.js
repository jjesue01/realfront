import React, {useState} from "react";
import styles from './index.module.sass'
import pageStyles from '/styles/OrderNFT.module.sass'
import Typography from "../../Typography";
import Checkbox from "../../checkbox/Checkbox";
import Input from "../../input/Input";
import Button from "../../button/Button";

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

function ContactChannel({ data, onDone }) {
  const [currentValue, setCurrentValue] = useState(data.contactMethod)
  const [inputValue, setInputValue] = useState(data.contactInfo)
  const [hasError, setError] = useState(false)

  function handleChange(value) {
    return function () {
      setCurrentValue(value)
    }
  }

  function handleInputChange({ target: { value } }) {
    setInputValue(value)
  }

  function handleDone() {
    if (!inputValue) {
      setError(true)
      return;
    }

    onDone({
      contactMethod: currentValue,
      contactInfo: inputValue
    })
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
                  error={hasError && !inputValue}
                  placeholder={'Enter your ' + item.value}
                  onChange={handleInputChange} />
              }
            </div>
          ))
        }
      </div>
      <Button onClick={handleDone} className={pageStyles.btnDone}>
        Order custom NFT
      </Button>
    </div>
  )
}

export default ContactChannel