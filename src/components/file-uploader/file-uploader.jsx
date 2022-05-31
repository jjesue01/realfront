import React, { useRef, useState } from 'react'
import styles from './file-uploader.module.sass'
import cn from "classnames";

const MAX_KB_SIZE = 800000

export function FileUploader({ className, children, onChange, accept = '*', error, disabled, multiple = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef()
  const dropRef = useRef()

  function handleClick() {
    if (disabled) return;
    inputRef.current.click();
  }

  function handleChange({ target: { files } }) {
    if (files.length) onChange(validateFiles(files))  
  }

  function validateFormat(file) {
    return accept
      .split(',')
      .some((format) =>
        file.name.toLowerCase().endsWith(format.toLowerCase()))
  }

  function validateFiles(files) {
    const resultFiles = []

    for (const file of files) {
      if (Math.round(file.size / 1000) > MAX_KB_SIZE || accept !== '*' && !validateFormat(file)) {
        return `File size should be less than ${MAX_KB_SIZE / 1000} MB and have supported format`
        // dispatch(pushToast({ type: 'info', message: `}))
        continue;
      }

      resultFiles.push(file)

      if (!multiple && resultFiles.length === 1)
        break;
    }

    return resultFiles
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== dropRef.current) {
      setIsDragging(true);
    }
  }
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === dropRef.current) {
      setIsDragging(false);
    }
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const {files} = e.dataTransfer;

    setIsDragging(false)

    if (files && files.length) {
      onChange(validateFiles(files))
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(className, styles.root, { [styles.active]: isDragging, [styles.error]: error, [styles.disabled]: disabled })}>
      { children }
      <input
        className={styles.input}
        type="file"
        ref={inputRef}
        accept={accept}
        value=""
        multiple={multiple}
        onChange={handleChange}
        title=""
      />
      {
        isDragging &&
        <div ref={dropRef} className={styles.drop}>
          <p>
            Drop file
          </p>
        </div>
      }
    </div>
  )
}