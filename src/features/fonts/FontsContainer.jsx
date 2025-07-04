import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import service from '../../request/service'
import {
	BtnAdd,
	BtnClose,
	Item,
	ItemLabel,
	ItemSection,
	List,
} from '../../shared/ui'
import Object from '../../store/Object'
import { ListFontFamily } from './ListFontFamily'

export const FontsContainer = observer(({ setFlagFonts }) => {
	const [nameFont, setNameFont] = useState('')
	const [newFont, setNewFont] = useState(false)
	const [fileFont, setFileFont] = useState(null)
	const refInpFile = useRef(null)

	const addFont = () => {
		refInpFile.current.click()
	}

	const selectedFont = e => {
		const file = e.target.files[0].name
		if (!file.toLowerCase().match(/\.ttf$/g)) {
			alert(
				'Загрузка не разрешена. Необходимо загрузить файл с разрешением ttf'
			)
			return
		}
		setNameFont(e.target.files[0].name.replace(/(\.)|(...$)/g, ''))
		setFileFont(e.target.files[0])
		setNewFont(true)
	}

	const closedContainer = () => {
		setNameFont('')
		setNewFont(false)
	}

	const saveFont = async file => {
		const reader = new FileReader()
		reader.onload = () => {
			service.postFont(
				nameFont,
				reader.result.replace(/data:application\/.*;base64,/g, '')
			)
		}
		reader.readAsDataURL(file)
		setNameFont('')
		setNewFont(false)
	}

	const writeName = e => {
		if (e.target.value.match(/[a-zA-Z\d_]/gm) || e.target.value.length === 0)
			setNameFont(
				e.target.value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, '')
			)
	}

	const closedFontsList = () => {
		setFlagFonts(false)
		Object.getFlagEditSize(false)
	}

	return (
		<List as='div'>
			<Item as='div'>
				<ItemSection>
					<ItemLabel header>Шрифты</ItemLabel>
				</ItemSection>
				<ItemSection side>
					<BtnClose onClick={() => setFlagFonts(false)} />
				</ItemSection>
			</Item>
			{newFont ? (
				<>
					<li className='add_img_name_container-text'>
						Загружен шрифт {nameFont}. Оставьте текущее название или введите
						своё на латинице. Максимум 8 символов
					</li>
					<input
						value={nameFont}
						onChange={writeName}
						className='add_img_name_container-inp'
						type='text'
						placeholder='Введите название шрифта'
					/>
					<li className='preview_container_btn'>
						{' '}
						<span className='btn_add_font' onClick={() => saveFont(fileFont)}>
							Сохранить
						</span>
						<span onClick={closedContainer} className='btn_add_font'>
							Отмена
						</span>
					</li>
				</>
			) : (
				<Item as='div'>
					<ItemSection>
						<ItemLabel header>Добавить шрифт</ItemLabel>
					</ItemSection>
					<ItemSection side>
						<BtnAdd onClick={addFont} />
						<input
							ref={refInpFile}
							onChange={selectedFont}
							type='file'
							className='hidden'
						/>
					</ItemSection>
				</Item>
			)}
			<ListFontFamily selectFontFamily={closedFontsList} />
		</List>
	)
})
