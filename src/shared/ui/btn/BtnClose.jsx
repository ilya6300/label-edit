import { cls } from '../../utils/'
import { Btn } from './Btn'
import './style.css'

export function BtnClose({ className, ...props }) {
	return (
		<Btn
			{...props}
			text
			className={cls('btn--close', className)}
			aria-label='Close'
		/>
	)
}
