import { observer } from 'mobx-react-lite'
import { storeMessage } from '../../entites/messege/store'
import { cls } from '../../shared/utils'

export const MessegeItem = observer(({ id, message, type }) => {
	const deleteMsg = () => {
		storeMessage.remove(id)
	}
	return (
		<div
			className={cls('message', {
				[`message--${type}`]: type,
			})}
		>
			<p>{message}</p>
			<span className='message__closed' onClick={deleteMsg}>
				x
			</span>
		</div>
	)
})
