import { useState } from 'react'

import { observer } from 'mobx-react-lite'

import { Btn, Input, Item, ItemSection } from '../../shared/ui'

export const ItemEditable = observer(
	({
		label,
		value,
		type,
		placeholder,
		onChange,
		onClick,
		className,
		editable,
	}) => {
		const [edit, setEdit] = useState(false)
		return (
			<Item>
				{edit && editable ? (
					<>
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
						<ItemSection side>
							<Btn
								outline
								onClick={(...args) => {
									onClick?.(...args)
									setEdit(false)
								}}
							>
								Ок
							</Btn>
						</ItemSection>
					</>
				) : (
					<>
						<ItemSection>{label}</ItemSection>
						<ItemSection
							end
							onClick={() => setEdit(true)}
							style={
								editable
									? { cursor: 'pointer', color: 'var(--color-secondary)' }
									: {}
							}
						>
							{value}
						</ItemSection>
					</>
				)}
			</Item>
		)
	}
)
