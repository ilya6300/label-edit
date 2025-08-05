import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { storeBg } from '../../store/BG'
import HistoryStore from '../../store/HistoryStore'
import Memory from '../../store/Memory'
import Theme from '../../store/Theme'
import zoomImg from './../../img/icons/zoom.png'
import zoomImgActive from './../../img/icons/zoom_active.png'

export const ToolsPanel = observer(({ setClsMM, clsMM }) => {
	const [iconZoom, setIconTools] = useState(zoomImg)

	// Включить / отклюяить милимметровую сетку
	const [clsMMBtn, setClsMMBtn] = useState('cls_mm-btn')
	const onMM = () => {
		if (clsMM === 'none') {
			setClsMMBtn('cls_mm-btn-active')
			setClsMM(`linear-gradient(rgb(114 114 114 / 75%) 1px, transparent 1px),
              linear-gradient(90deg, rgb(114 114 114 / 75%) 1px, transparent 1px),
              linear-gradient(rgb(114 114 114) 1px, transparent 1px),
              linear-gradient(90deg, rgb(114 114 114) 1px, white 1px)`)
		} else {
			setClsMMBtn('cls_mm-btn')
			setClsMM('none')
		}
	}

	const backStepHistory = () => {
		HistoryStore.incrementReturnHistory()
	}

	const cancelStepHistory = () => {
		HistoryStore.decrementReturnHistory()
	}

	const bgFile = useRef()
	const addBg = () => bgFile.current?.click()
	const selectedBG = e => {
		if (e.target.files.length === 0) {
			return
		}
		const allowedExtensions = ['bmp', 'jpeg', 'png']
		if (
			!allowedExtensions
				.map(item => 'image/' + item)
				.includes(e.target.files[0].type)
		) {
			return alert(
				'Вы пытаетесь добавить файл ' +
					e.target.files[0].type +
					`. Вы можете загрузить только изображение с расширение .${allowedExtensions.join(
						', .'
					)}`
			)
		}
		const reader = new FileReader()
		reader.onload = () => {
			storeBg.setImage(reader.result)
		}
		reader.readAsDataURL(e.target.files[0])
		/*if (e.target.files[0].type !== "image/bmp") {
      return alert(
        "Вы пытаетесь добавить файл " +
          e.target.files[0].type +
          ". Вы можете загрузить только изображение с форматом .bmp"
      );
    }
    if (e.target.files[0].size > 512000) {
      return alert(
        "Превышен максимальный размер файла. Максимальный разрешённый размер 515 Кб"
      );
    }*/
		//console.log(e.target.files[0])
		//storeBG.setImage(e.target.files[0])
	}

	return (
		<div className='tools_container'>
			<div
				className='btn_tools'
				onMouseEnter={() => setIconTools(zoomImgActive)}
				onMouseLeave={() => setIconTools(zoomImg)}
				style={{ background: Theme.btn_background_black }}
			>
				<img className='img_tools' src={iconZoom} alt='zoom' />
				{iconZoom === zoomImgActive ? (
					<div
						className='barlabel_container_scale'
						style={{
							background: Theme.btn_background_black,
							border: Theme.theme_border,
						}}
					>
						<span className='barlabel_container_scale_text'>Масштаб</span>
						<input
							type='range'
							min='1'
							max='4'
							step='0.25'
							value={Memory.scale}
							onChange={e => Memory.setScaleLabel(e.target.value)}
						/>
						<span className='barlabel_container_scale_text'>
							{Memory.scale * 100} %
						</span>
					</div>
				) : (
					<></>
				)}
			</div>

			<button
				onClick={addBg}
				className='btn_bg'
				style={{ background: Theme.btn_background_black, overflow: 'hidden' }}
				title='Загрузить фон'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='256'
					height='256'
					viewBox='0 0 256 256'
				>
					<path
						fill='currentColor'
						d='M160 80H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16m0 128H48V96h112ZM136 40a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m88 8v8a8 8 0 0 1-16 0v-8h-8a8 8 0 0 1 0-16h8a16 16 0 0 1 16 16m0 48v16a8 8 0 0 1-16 0V96a8 8 0 0 1 16 0m0 56v8a16 16 0 0 1-16 16h-8a8 8 0 0 1 0-16h8v-8a8 8 0 0 1 16 0M80 56v-8a16 16 0 0 1 16-16h8a8 8 0 0 1 0 16h-8v8a8 8 0 0 1-16 0'
					/>
				</svg>
				<input
					ref={bgFile}
					onChange={selectedBG}
					type='file'
					accept='image/bmp, image/png, image/jpeg'
					className='hidden'
				/>
			</button>
			<button
				onClick={onMM}
				className='btn_back_history'
				style={{ background: Theme.btn_background_black }}
			>
				#
			</button>
			<span
				className='btn_back_history'
				style={{ background: Theme.btn_background_black }}
				onClick={backStepHistory}
			>
				&#8630;
			</span>
			<span
				className='btn_back_history'
				style={{ background: Theme.btn_background_black }}
				onClick={cancelStepHistory}
			>
				&#8631;
			</span>
		</div>
	)
})
