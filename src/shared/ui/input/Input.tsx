import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface InputProps {
	type?: string
	label?: string
	dense?: boolean
	underline?: boolean
}

export const Input = memo(
	({ type = 'text', label, dense, underline, ...props }: InputProps) => {
		return (
			<div className='mdc-input__wrap'>
				<input
					type={type}
					{...props}
					className={cls('mdc-input', {
						'mdc-input--dense': dense,
						'mdc-input--underline': underline,
					})}
				/>
				{label && !dense && <label className='mdc-input__label'>{label}</label>}
			</div>
		)
	}
)
