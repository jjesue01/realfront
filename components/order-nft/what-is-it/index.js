import React, {useState} from "react";
import styles from './index.module.sass'
import Card from "../card";
import Typography from "../../Typography";
import Input from "../../input/Input";

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

function WhatIsIt() {
  const [currentValue, setCurrentValue] = useState(items[0].value)
  const [otherValue, setOtherValue] = useState('')

  function handleClick(value) {
    return function () {
      setCurrentValue(value)
    }
  }

  function handleChange({ target: { value } }) {
    setOtherValue(value)
  }

  return (
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
        onClick={handleClick('other')}
        className={styles.card}
        checkmarkClassName={styles.checkmark}
        active={currentValue === 'other'}>
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
          onChange={handleChange}  />
      </Card>
    </div>
  )
}

export default WhatIsIt