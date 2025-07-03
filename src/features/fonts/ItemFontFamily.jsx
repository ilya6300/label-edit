import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { cls } from '../../shared/utils'
import Object from '../../store/Object'
import './style.css'

export const ItemFontFamily = observer(
	({ font, selectFontFamily, hoverFontFamily }) => {
		useEffect(() => {
			if (font.data === undefined) return
		}, [])

		return (
			<li
				className={cls('font-family-item', {
					'font-family-item--active':
						Object.prop_obj.style.fontFamily === font.name,
				})}
				onClick={() => selectFontFamily(font)}
				onMouseMove={() => hoverFontFamily(font)}
			>
				<div
					className='font-family-item__font'
					style={{
						fontFamily: font.name,
					}}
				>
					<span className='font-family-item__font-name'>{font.name}</span>
					Это образец шрифта <br /> This is a sample font
					<br /> 0123456789
				</div>
			</li>
		)
	}
)
