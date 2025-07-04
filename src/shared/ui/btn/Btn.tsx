import { cls } from '../../utils'
import './style.css'

export const Btn = ({
	children,
	className = '',
	color,
	outline,
	loading,
	active,
	disabled,
	text,
	...props
}: any) => {
	return (
		<button
			className={cls(
				'btn',
				{
					[`btn--${color}`]: color,
					'btn--outline': outline,
					'btn--disabled': disabled,
					'btn--active': active,
					'btn--loading': loading,
					'btn--text': text,
				},
				className
			)}
			{...props}
		>
			{typeof children === 'function' ? (
				children
			) : (
				<>
					<span className='btn-content'>
						<span className='btn-label'>{children}</span>
					</span>
					<span className='btn-loader'>Loading...</span>
				</>
			)}
		</button>
	)
}
