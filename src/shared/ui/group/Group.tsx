import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface GroupProps {
	children: React.ReactNode
	className?: string
	justify?: 'start' | 'center' | 'end' | 'between'
	style: any
	gap?: string | number
}

export const Group = memo(
	({ children, className, justify, style = {}, gap, ...props }: GroupProps) => {
		return (
			<div
				{...props}
				className={cls(
					'mdc-group',
					{
						[`mdc-group--${justify}`]: justify,
					},
					className
				)}
				style={{
					...style,
					'--group-gap': gap,
				}}
			>
				{children}
			</div>
		)
	}
)
