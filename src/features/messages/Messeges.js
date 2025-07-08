import { observer } from 'mobx-react-lite'
import { storeMessage } from '../../entites/messege/store'
import { MessegeItem } from './MessegeItem'
import './style.css'

export const Messages = observer(() => {
	return (
		<div className='messages'>
			{storeMessage.messages.map(message => (
				<MessegeItem key={message.id} {...message} />
			))}
		</div>
	)
})
