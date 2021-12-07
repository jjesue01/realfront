import React from "react";
import styles from './Tabs.module.sass'
import cn from "classnames";

function Tabs({ className, name, value, onChange, tabs }) {
  const tabsList = tabs.map(tab => (
    <button
      type="button"
      key={tab}
      onClick={handleClick(tab)}
      className={cn(styles.tab, { [styles.tabActive]: tab === value })}>
      { tab }
    </button>
  ))

  function handleClick(tabName) {
    return function () {
      onChange({ target: { name, value: tabName } })
    }
  }

  return (
    <div className={cn(className, styles.root)}>
      { tabsList }
    </div>
  )
}

export default Tabs