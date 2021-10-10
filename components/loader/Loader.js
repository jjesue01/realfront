import React from "react";
import cn from "classnames";

function Loader({ className, opened, color = 'white' }) {
  return (
    <div className={cn(className, 'lds-spinner', { 'loader--opened': opened, 'loader--accent': color === 'accent' })}>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
    </div>
  )
}
export default Loader