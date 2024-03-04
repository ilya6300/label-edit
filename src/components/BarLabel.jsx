import React, { useState } from 'react'
import Memory from '../store/Memory'
import { observer } from 'mobx-react-lite'

export const BarLabel = observer(() => {
    const [wValuse, setWValue] = useState(Memory.width_label)
    const [hValuse, setHValue] = useState(Memory.height_label)
    const [rValuse, setRValue] = useState(Memory.radius_label)


const changeW = (e) => {
    setWValue(e.target.value)
    Memory.widthLabelChange(e.target.value)
}
const changeH = (e) => {
    setHValue(e.target.value)
    Memory.heigthLabelChange(e.target.value)
}
const changeR = (e) => {
    setRValue(e.target.value)
    Memory.radiusLabelChange(e.target.value)
}

  return (
    <div>
        <span className='barlabel_title'>Параметры этикетки</span>
        <label>Ширина: <input className='barlabel_number' type="number" value={wValuse} onChange={(e) =>changeW(e)}/></label>
        <label>Высота: <input className='barlabel_number' type="number" value={hValuse} onChange={(e) =>changeH(e)}/></label>
        <label>Скругление: <input className='barlabel_number' type="number" value={rValuse} onChange={(e) =>changeR(e)}/></label>
    </div>
  )
})
