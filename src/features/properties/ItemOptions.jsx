import { useState } from 'react'

import { observer } from 'mobx-react-lite'

import { Item, ItemLabel, ItemSection, Options } from '../../shared/ui'

export const ItemOptions = observer(
	({ label, value, onChange, options, unit }) => {
		const [opened, setOpened] = useState(false)
		return (
			<Item>
				<ItemSection>{label}</ItemSection>
				<ItemSection
					end
					row
					onClick={() => setOpened(true)}
					style={{ cursor: 'pointer', color: 'var(--color-secondary)' }}
				>
					<ItemLabel>{value}</ItemLabel>
					{unit && <ItemLabel side>{unit}</ItemLabel>}
					<Options value={value} options={options} onChange={onChange} />
				</ItemSection>
			</Item>
		)
	}
)
