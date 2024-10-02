import React, { useEffect } from 'react'
import serverErrorImg from "../img/servererror.png"
import Memory from  '../store/Memory'

export const ServerError = () => {
  useEffect(() => {
Memory.exchangeFlag(false)
  }, [])
  return (
    <div className='error_container'>
      <p className='error_text'>Сервер этикеток недоступен попробуйте позже</p>
      <img className='img_error' src={serverErrorImg} alt="" srcset="" />
    </div>
  )
}
