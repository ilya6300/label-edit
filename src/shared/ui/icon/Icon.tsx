import { cls } from '../../utils'

interface IconProps {
	children?: string | React.ReactNode
	className?: string
	name?: string
	color?: string
	as?: string
}
export function Icon({
	children,
	className,
	name,
	color,
	as = 'i',
	...props
}: IconProps) {
	const Tag = as
	/*name ||= children
	if (!name) {
		return ''
	}*/
	/*color &&= color = ' text-' + color
	color ||= ''*/
	return (
		<i
			{...props}
			className={cls('mdc-icon', className)}
			role='presentation'
			aria-hidden='true'
		>
			{children}
		</i>
	)
}
