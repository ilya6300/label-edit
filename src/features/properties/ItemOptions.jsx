import { observer } from 'mobx-react-lite'

import { Item, ItemLabel, ItemSection, Options, Popover } from '../../shared/ui'

export const ItemOptions = observer(
	({ label, value, onChange, options, unit, labels }) => {
		return (
			<Popover autoClose>
				<Popover.Target>
					<Item>
						<ItemSection>{label}</ItemSection>
						<ItemSection
							end
							row
							style={{ cursor: 'pointer', color: 'var(--color-secondary)' }}
						>
							<ItemLabel>{labels ? labels[value] : value}</ItemLabel>
							{unit && <ItemLabel side>{unit}</ItemLabel>}
						</ItemSection>
					</Item>
				</Popover.Target>
				<Popover.Dropdown>
					<Options
						inline
						value={value}
						options={options}
						onChange={(...args) => {
							onChange(...args)
						}}
					/>
				</Popover.Dropdown>
			</Popover>
		)
	}
)
