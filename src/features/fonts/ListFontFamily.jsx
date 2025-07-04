import { observer } from 'mobx-react-lite'
import Fonts from '../../store/Fonts'
import Object from '../../store/Object'
import { ItemFontFamily } from './ItemFontFamily'

import { List } from '../../shared/ui'

export const ListFontFamily = observer(({ selectFontFamily }) => {
	// Выбрать шрифт тектса
	const hoverFontFamily = (...args) => {
		Object.updateFontFamily(...args)
	}

	return (
		<List
			style={{
				gap: 8,
			}}
		>
			{Fonts.fonts.map(font => (
				<ItemFontFamily
					selectFontFamily={selectFontFamily}
					hoverFontFamily={hoverFontFamily}
					font={font}
					key={font.id}
				/>
			))}
		</List>
	)
})
