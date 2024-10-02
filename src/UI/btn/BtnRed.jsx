import React from 'react'

export const BtnRed = (props) => {
  return (
    <button className='btn_red_v1 posi_abl_right_btn' onClick={props.onClick}>{props.text}</button>
  )
}
