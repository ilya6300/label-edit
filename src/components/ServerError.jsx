import React from 'react'
import serverErrorImg from "../img/servererror.png"

export const ServerError = () => {
  return (
    <div className='error_container'>
      <p className='error_text'>Сервер недоступен попробуйте позже</p>
      <img className='img_error' src={serverErrorImg} alt="" srcset="" />
    </div>
  )
}
