import { memo, useCallback } from 'react'
import { cls } from '../../utils'
import './style.css'

interface OptionsProps {
	value?: string | number
	options?: Record<string | number, any>[]
	onChange?: (value: string | number) => void
	name?: string
	multiple?: boolean
	inline?: boolean
}

export const Options = memo(
	({ value, options = [], onChange, name, multiple, inline }: OptionsProps) => {
		const handlerChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				onChange?.(e.target.value)
			},
			[onChange]
		)
		return (
			<div
				className={cls('mdc-options', {
					'mdc-options--multiple': multiple,
					'mdc-options--inline': inline,
				})}
			>
				{options.map(option => (
					<label
						key={option.value}
						className={cls('mdc-options__option', {
							'mdc-options__option--active': value == option.value,
						})}
					>
						<span className='mdc-options__label'>
							{option.label || option.value}
						</span>
						<div className='mdc-options__control'>
							<input
								checked={value == option.value}
								name={name}
								type='radio'
								value={option.value}
								onChange={handlerChange}
							/>
						</div>
					</label>
				))}
			</div>
		)
	}
)
