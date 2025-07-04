import { cls } from '../../utils'
import { Btn } from './Btn'
import './style.css'

export function BtnAdd({ children, className, ...props }: any) {
	return (
		<Btn
			{...props}
			outline
			className={cls('btn--add', className)}
			aria-label='Add'
		/>
	)
}
