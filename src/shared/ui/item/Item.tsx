import { memo, useMemo } from 'react'
import { cls } from '../../utils'
import './style.css'

const clickableTag = ['a', 'label', 'button']
const disRoleTag = ['label']
const disDisabledTag = ['div', 'span', 'a', 'label']

interface ItemProps {
	as?: 'li'
	children: React.ReactNode
	className?: string
	role?: string
	tabIndex?: number
	vertical?: boolean
	dense?: boolean
	active?: boolean
	activeClass?: string
	disabled?: boolean
	hoverable?: boolean
	bordered?: boolean
	color?: 'primary' | 'secondary'
	onClick?: (e: React.MouseEvent<HTMLElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
	onKeyUp?: (e: React.KeyboardEvent<HTMLElement>) => void
	onKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void
	onFocus?: (e: React.FocusEvent<HTMLElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLElement>) => void
}

export const Item = memo(
	({
		as = 'li',
		className,
		children,
		tabIndex = 0,
		vertical,
		dense,
		active,
		activeClass,
		disabled,
		bordered,
		role,
		onClick,
		hoverable,
		...props
	}: ItemProps) => {
		const Tag = as
		const isActionable = useMemo(() => {
			return clickableTag.includes(as) || typeof onClick === 'function'
		}, [props, onClick])

		const isClickable = !disabled && isActionable

		const isHoverable = isClickable || hoverable

		const attrs = useMemo(() => {
			const attrs: Record<string, any> = {
				className: cls(
					'mdc-item',
					{
						'mdc-item--dense': dense,
						'mdc-item--active': active,
						'mdc-item--disabled': disabled,
						'mdc-item--clickable': isClickable,
						'mdc-item--hoverable': isHoverable,
						'mdc-item--vertical': vertical,
						'mdc-item--bordered': bordered,
					},
					className
				),
				role: disRoleTag.includes(as) ? undefined : role ?? 'listitem',
				disabled: disabled,
			}
			if (isActionable) {
				attrs['aria-disabled'] = disabled
			}
			if (isClickable) {
				attrs.tabIndex = disabled ? -1 : tabIndex ?? -1
			}
			if (disDisabledTag.includes(as)) {
				delete attrs.disabled
			}
			return attrs
		}, [
			disabled,
			tabIndex,
			role,
			dense,
			active,
			className,
			activeClass,
			isClickable,
			isActionable,
		])

		return (
			<Tag
				{...props}
				{...attrs}
				onClick={(event: React.MouseEvent<HTMLElement>) => {
					if (disabled) {
						event.preventDefault()
					}
					onClick?.(event)
				}}
			>
				{children}
			</Tag>
		)
	}
)
