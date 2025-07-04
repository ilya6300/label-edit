import { memo } from 'react'
import { cls } from '../../utils'
import './style.css'

interface StackProps {
	children: React.ReactNode
	className?: string
	justify?: 'start' | 'center' | 'end' | 'around' | 'between'
	style: any
	gap?: string | number
}

export const Stack = memo(
	({ children, className, justify, style = {}, gap, ...props }: StackProps) => {
		return (
			<div
				{...props}
				className={cls(
					'mdc-stack',
					{
						[`mdc-stack--${justify}`]: justify,
					},
					className
				)}
				style={{
					...style,
					'--stack-gap': gap,
				}}
			>
				{children}
			</div>
		)
	}
)
