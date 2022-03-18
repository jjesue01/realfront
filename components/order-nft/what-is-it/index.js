import React, {useState} from "react";
import styles from './index.module.sass'
import Card from "../card";
import Typography from "../../Typography";
import Input from "../../input/Input";
import pageStyles from "../../../styles/OrderNFT.module.sass";
import Button from "../../button/Button";

const items = [
  {
    value: 'Historical Landmark'
  },
  {
    value: 'Commercial building'
  },
  {
    value: 'House'
  },
  {
    value: 'City skyline'
  },
  {
    value: 'Recreational area'
  },
  {
    value: 'Downtown location'
  },
]

function WhatIsIt({ data, onNext }) {
  const initialValue = items.find(({ value }) => value === data.object)?.value
  const [currentValue, setCurrentValue] = useState(initialValue || 'Other')
  const [otherValue, setOtherValue] = useState(initialValue ? '' : data.object)
  const [hasError, setError] = useState(false)

  function handleClick(value) {
    return function () {
      setCurrentValue(value)
    }
  }

  function handleChange({ target: { value } }) {
    setOtherValue(value)
  }

  function handleNext() {
    if (currentValue === 'Other' && !otherValue) {
      setError(true)
      return;
    }
    onNext({ object: currentValue === 'Other' ? otherValue : currentValue })
  }

  return (
    <>
      <div className={styles.root}>
        {
          items.map(item => (
            <Card
              key={item.value}
              onClick={handleClick(item.value)}
              className={styles.card}
              checkmarkClassName={styles.checkmark}
              active={currentValue === item.value}>
              <Typography fontWeight={600} fontSize={18} lHeight={30}>
                { item.value }
              </Typography>
            </Card>
          ))
        }
        <Card
          onClick={handleClick('Other')}
          className={styles.card}
          checkmarkClassName={styles.checkmark}
          active={currentValue === 'Other'}>
          <Typography
            fontWeight={600}
            fontSize={18}
            lHeight={30}>
            Other
            <Typography
              tag="span"
              fontSize={16}
              color={'#878D97'}
              lHeight={30}
              margin={'0 0 0 5px'}>
              (Write in a field)
            </Typography>
          </Typography>
          <Input
            className={styles.input}
            value={otherValue}
            error={hasError && !otherValue}
            onChange={handleChange}  />
        </Card>
      </div>
      <Button onClick={handleNext} className={pageStyles.btnContinue}>
        Continue
      </Button>
    </>
  )
}

export default WhatIsIt