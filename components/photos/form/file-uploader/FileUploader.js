import React, { useRef, useState } from 'react'
import styles from './FileUploader.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";

const MAX_KB_SIZE = 40000

function FileUploader({ className, children, onChange, accept = '*', error }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef()
  const dropRef = useRef()

  function handleClick() {
    inputRef.current.click();
  }

  function handleChange({ target: { files } }) {
    if (files.length) onChange(validateFiles(files))
  }

  function validateFiles(files) {
    const file = files[0]
    let result = file

    if (Math.round(file.size / 1000) > MAX_KB_SIZE)
      result = null

    if (accept !== '*' && !accept.split(',').some((format) => file.name.toLowerCase().endsWith(format.toLowerCase()))) {
      result = null
    }

    return result
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
      className={cn(className, styles.root, { [styles.active]: isDragging, [styles.error]: error })}>
      { children }
      <input
        className={styles.input}
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        title=""
      />
      {
        isDragging &&
        <div ref={dropRef} className={styles.drop}>
          <Typography fontSize={20} fontWeight={600} color={'#1DC3A6'}>
            Drop file
          </Typography>
        </div>
      }
    </div>
  )
}

export default FileUploader