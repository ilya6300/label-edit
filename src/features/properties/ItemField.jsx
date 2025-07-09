import { observer } from 'mobx-react-lite'

import { Input, Item, ItemSection } from '../../shared/ui'

export const ItemField = observer(
	({
		edit,
		label,
		value,
		type,
		unit,
		placeholder,
		onChange,
		onClick,
		className,
	}) => {
		return (
			<Item>
				{edit ? (
					<>
						<ItemSection>{label}</ItemSection>
						<ItemSection>
							<Input
								dense
								underline
								type={type}
								placeholder={placeholder}
								value={value}
								onChange={onChange}
							/>
						</ItemSection>
						{unit && <ItemSection side>{unit}</ItemSection>}
					</>
				) : (
					<>
						<ItemSection>{label}</ItemSection>
						<ItemSection end>Нет</ItemSection>
					</>
				)}
			</Item>
		)
	}
)
