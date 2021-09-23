import React from 'react'
import styles from './FileUploader.module.sass'
import cn from "classnames";

function FileUploader({ className, children }) {
  return (
    <div className={cn(className, styles.root)}>
      { children }
    </div>
  )
}

export default FileUploader