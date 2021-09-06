import React from 'react'
import cn from "classnames";

function Typography({
  tag = 'p',
  children,
  fontFamily = 'Montserrat',
  className,
  fontSize,
  fontWeight = 400,
  color,
  margin,
  lHeight = 1.3
}) {

  const style = {
    fontFamily: `'${fontFamily}', sans-serif`,
    fontSize: `${fontSize}px`,
    fontWeight,
    color,
    margin,
    lineHeight: `${lHeight}${ +lHeight < 2 ? '' : 'px' }`
  }
  return (
    <>
      { React.createElement(tag, { style }, children) }
      <style jsx>{`
        .typography {
          font-family: '${fontFamily}', sans-serif;
          font-size: ${fontSize}px;
          font-weight: ${fontWeight};
          color: ${color};
          margin: ${margin};
          line-height: ${lHeight}${ +lHeight < 2 ? '' : 'px' }
        }
      `}</style>
    </>
  )
}
export default Typography