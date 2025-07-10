import { observer } from 'mobx-react-lite'

import { Item, ItemSection } from '../../shared/ui'

export const ItemAction = observer(({ label, value, onClick, className }) => {
	return (
		<Item onClick={onClick}>
			{label && <ItemSection>{label}</ItemSection>}
			{value && (
				<ItemSection end style={{ cursor: 'pointer' }}>
					{value}
				</ItemSection>
			)}
		</Item>
	)
})
