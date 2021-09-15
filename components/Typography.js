import React from 'react'

function Typography({
  tag = 'p',
  children,
  fontFamily = 'Montserrat',
  className,
  fontSize,
  fontWeight = 400,
  color = '#111',
  align = 'left',
  margin = '0',
  lHeight = 1.3,
  maxWidth = '100%'
}) {
  const Tag = tag

  return (
      <Tag className="typography">
        {children}
        <style jsx>{`
          .typography {
            font-family: '${fontFamily}', sans-serif;
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            color: ${color};
            margin: ${margin};
            line-height: ${lHeight}${ +lHeight < 2 ? '' : 'px' };
            max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px`: maxWidth};
            text-align: ${align};
          }
        `}</style>
      </Tag>
  )
}
export default Typography