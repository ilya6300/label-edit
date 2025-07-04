import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Item, ItemLabel, ItemSection } from '../../shared/ui'
import Object from '../../store/Object'

export const ItemFontFamily = observer(
	({ font, selectFontFamily, hoverFontFamily }) => {
		useEffect(() => {
			if (font.data === undefined) return
		}, [])

		return (
			<Item
				bordered
				active={Object.prop_obj.style.fontFamily === font.name}
				onClick={() => selectFontFamily(font)}
				onMouseMove={() => hoverFontFamily(font)}
			>
				<ItemSection
					style={{
						fontFamily: font.name,
						gap: 8,
					}}
				>
					<ItemLabel header>{font.name}</ItemLabel>
					<ItemLabel>
						Это образец шрифта <br /> This is a sample font
						<br /> 0123456789
					</ItemLabel>
				</ItemSection>
			</Item>
		)
	}
)
