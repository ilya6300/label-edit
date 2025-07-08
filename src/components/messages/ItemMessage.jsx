import { observer } from 'mobx-react-lite'
import Msg from '../../store/Msg'

export const ItemMessage = observer(props => {
	const deleteMsg = () => {
		Msg.deleteMessage(props.msg)
	}
	return (
		<div className='item_message'>
			<p>{props.msg.message}</p>
			<span className='item_message-closed' onClick={deleteMsg}>
				x
			</span>
		</div>
	)
})
