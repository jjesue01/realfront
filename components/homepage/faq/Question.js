import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import styles from './FAQ.module.sass'

function Question ({ index, content, children, opened, onClick }){
  const wrapperRef = useRef()
  const contentRef = useRef()

  function handleClick() {
    const result = opened ? -1 : index;
    onClick(result)
  }

  useEffect(function toggleText() {
    if (opened) {
      const height = contentRef.current.clientHeight;
      wrapperRef.current.style.height = `${height}px`
    } else {
      wrapperRef.current.style.height = `0px`
    }

  }, [opened])

  return (
    <div className={styles.question}>
      <button onClick={ handleClick } className={ cn(styles.btnQuestion, { [styles.btnQuestionOpened]: opened }) }>
        { content }
        <span className={styles.icon} />
      </button>
      <div ref={ wrapperRef } className={ styles.answerWrapper}>
        <div ref={ contentRef } className={ styles.answerContent }>
          { children }
        </div>
      </div>
    </div>
  )
}

export default Question