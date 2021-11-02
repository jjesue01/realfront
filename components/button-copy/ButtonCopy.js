import React, {useEffect, useState} from "react";
import styles from './ButtonCopy.module.sass'
import Tooltip from "../tooltip/Tooltip";
import CopyIcon from '/public/icons/copy.svg'

const TOOLTIP_DURATION = 2000

function ButtonCopy({ className, value, children, onCopied }, ref) {
  const [opened, setOpened] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value)
      .then(() => {
        setOpened(true)
      })
  }

  useEffect(function closeTooltip() {
    if (opened) {
      const timeout = setTimeout(function () {
        setOpened(false)
        onCopied && onCopied()
      }, TOOLTIP_DURATION)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [onCopied, opened])

  return (
    <Tooltip
      className={className}
      opened={opened}
      content={<p><span>Copied!</span></p>}>
      <button ref={ref} onClick={handleCopy} className={styles.root}>
        {
          children ?
            children
            :
            <CopyIcon />
        }
      </button>
    </Tooltip>
  )
}

export default React.forwardRef(ButtonCopy)