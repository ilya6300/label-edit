import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import iconSettings from '../img/icons/icon-settings.png'
import service from '../request/service'
import Memory from '../store/Memory'
import Msg from '../store/Msg'
import Object from '../store/Object'
import Templates from '../store/Templates'
import Theme from '../store/Theme'
import { BtnVer1 } from '../UI/btn/BtnVer1'
import { LabelInpVer1 } from '../UI/label/LabelInpVer1'
import { BarInfo } from './BarInfo'
import { PostCompanent } from './PostCompanent'
import { CodeTemplayModal } from './templates/CodeTemplayModal'

export const BarLabel = observer(
	({
		setFlagPrevier,
		flagPreview,
		setVisibleTemplates,
		visibleTemplates,
		setClsMM,
		clsMM,
		setImportC,
		setSetting,
		setting,
		// flagPrinter,
		setFlagPrinter,
		// flagApp,
		setFlagApp,
	}) => {
		const [wValuse, setWValue] = useState(Memory.width_label)
		const [hValuse, setHValue] = useState(Memory.height_label)
		const [rValuse, setRValue] = useState(Memory.radius_label)
		const [gValuse, setGValue] = useState(Memory.gap)
		const [direction1, setDirection1] = useState(Memory.DIRECTION_1)
		const [direction2, setDirection2] = useState(Memory.DIRECTION_2)
		const [refX, setRefX] = useState(Memory.ref_x)
		const [refY, setRefY] = useState(Memory.ref_y)

		// Имя шаблона
		const [valueName, setValueName] = useState(Memory.name_template)
		const refCodeImport = useRef()

		const [visibleCodeTemplateFlag, setVisibleCodeTemplateFlag] =
			useState(false)

		const loadingUrlTemplate = async () => {
			const urlID = String(window.location.search.match(/_id=\d*$/))
			if (urlID !== 'null') {
				const ID = String(urlID.match(/\d*$/))
				console.log(urlID, ID)
				try {
					await service.getTemplatesID(ID)
					Templates.saveID(ID)
					Object.select()
					Templates.setNewTemplate(false)
				} catch (e) {
					console.error(e)
				}
			}
		}

		useEffect(() => {
			loadingUrlTemplate()
		}, [])

		const changeW = e => {
			if (e.target.value > 150) {
				setWValue(150)
				Memory.widthLabelChange(150)
			} else {
				setTimeout(() => {
					if (e.target.value < 15) {
						setWValue(15)
						Memory.widthLabelChange(15)
					}
				}, 1000)
				setWValue(e.target.value)
				Memory.widthLabelChange(e.target.value)
			}
		}
		const changeH = e => {
			if (e.target.value > 400) {
				setHValue(400)
				Memory.heigthLabelChange(400)
			} else {
				setTimeout(() => {
					if (e.target.value < 15) {
						setHValue(15)
						Memory.heigthLabelChange(15)
					}
				}, 1000)
				setHValue(e.target.value)
				Memory.heigthLabelChange(e.target.value)
			}
		}
		const changeR = e => {
			if (e.target.value > 50) {
				setRValue(50)
				Memory.radiusLabelChange(50)
			} else if (e.target.value <= 0) {
				setRValue(0)
				Memory.radiusLabelChange(0)
			} else {
				setRValue(e.target.value)
				Memory.radiusLabelChange(e.target.value)
			}
		}

		const changeG = e => {
			if (e.target.value > 10) {
				return
			}
			setGValue(e.target.value)
			Memory.gapLabelChange(e.target.value)
		}

		const reset = () => {
			Object.reset()
			Memory.updateFlagPropsObj(false)
			Object.setPropObj(null)
		}

		const preview = () => {
			if (flagPreview) {
				setFlagPrevier(false)
			} else {
				setFlagPrevier(true)
				setTimeout(() => {
					Object.editBodyPreview()
				}, 100)
			}
		}

		const changeDirection = e => {
			let targetValue = Number(e.target.value)
			if (targetValue.length > 1) {
				return
			}
			if (Number(e.target.value) < 0) {
				targetValue = 0
			}
			if (Number(e.target.value) > 1) {
				targetValue = 1
			}
			if (Number(e.target.id) === Number(1)) {
				Memory.labelDirection1(targetValue)
				setDirection1(targetValue)
			}
			if (Number(e.target.id) === Number(2)) {
				Memory.labelDirection2(targetValue)
				setDirection2(targetValue)
			}
		}

		const changeRef = e => {
			let value = e.target.value
			if (e.target.value < 0) {
				value = 0
			}
			if (e.target.id === 'x') {
				if (e.target.value > Memory.width_label) {
					return
				}
				Memory.labelRefX(value)
				setRefX(value)
			}
			if (e.target.id === 'y') {
				if (e.target.value > Memory.height_label) {
					return
				}
				Memory.labelRefY(value)
				setRefY(value)
			}
		}

		const [temp_wl, setTemp_wl] = useState(0)
		const [temp_hl, setTemp_hl] = useState(0)
		const [temp_rx, setTemp_rx] = useState(0)
		const [temp_ry, setTemp_ry] = useState(0)
		const [temp_d1, setTemp_d1] = useState(0)
		const [temp_d2, setTemp_d2] = useState(0)
		const [temp_g, setTemp_g] = useState(0)

		// показать список шаблонов
		const openTemplates = () => {
			setTemp_wl(Memory.width_label)
			setTemp_hl(Memory.height_label)
			setTemp_rx(Memory.ref_x)
			setTemp_ry(Memory.ref_y)
			setTemp_d1(Memory.DIRECTION_1)
			setTemp_d2(Memory.DIRECTION_2)
			setTemp_g(Memory.gap)
			setVisibleTemplates(true)
			service.getImages()
		}

		const closedTemplates = () => {
			setVisibleTemplates(false)
			setRefX(temp_rx)
			setRefY(temp_ry)
			setDirection1(temp_d1)
			setDirection2(temp_d2)
			Memory.widthLabelChange(temp_wl)
			Memory.heigthLabelChange(temp_hl)
			setGValue(temp_g)
		}
		// Переименовать шаблон
		const [renameFlag, setRenameFlag] = useState(false)
		const [rename, setRename] = useState(Memory.name_template)
		const handlerRename = async e => {
			setRename(e.target.value)
		}
		const renameBlockRef = useRef()
		const closedRenameBlock = e => {
			if (
				renameBlockRef.current &&
				!renameBlockRef.current.contains(e.target)
			) {
				setRenameFlag(false)
			}
		}
		useEffect(() => {
			document.addEventListener('mousedown', closedRenameBlock)
		}, [])

		const renameTemplate = async () => {
			if (Memory.name_template !== rename) {
				Memory.writeNameTemplate(true, rename)
				service.pathUpdateLabel({ name: rename })
				setRenameFlag(false)
			} else {
				console.error('Memory.name_template не изменился')
			}
		}

		const openRenameBlock = async () => {
			setRename(Memory.name_template)
			setRenameFlag(true)
		}

		// Новый шаблон
		const newTemplateFunc = () => {
			Memory.clearUrl()
			Object.newTemplate()
			Templates.setNewTemplate(true)
		}

		const changeDpi = e => {
			Memory.dpiChange(e.target.value)
		}

		const visibleImportC = () => {
			setVisibleTemplates(false)
			setImportC(true)
		}

		const trialPrintFunc = async () => {
			if (Templates.template_id === null) {
				return alert('Сохраните шаблон или выберите из БД')
			}
			if (localStorage.getItem('printer') === null) {
				setFlagApp(false)
				setFlagPrinter(true)
				return setSetting(true)
			}
			const res = await service.trialPrint()
			if (res === undefined) return
			if (res.success) {
				setVisibleCodeTemplateFlag(true)
			}
		}

		const codePrintFunc = async () => {
			if (Templates.template_id === null) {
				return alert('Сохраните шаблон или выберите из БД')
			}
			if (localStorage.getItem('printer') === null) {
				setFlagApp(false)
				setFlagPrinter(true)
				return setSetting(true)
			}
			const res = await service.codePrint()
			if (res === undefined) return
			if (res.success) {
				setVisibleCodeTemplateFlag(true)
			}
		}

		const examplePrintFunc = async () => {
			if (Templates.template_id === null) {
				return alert('Сохраните шаблон или выберите из БД')
			}
			if (localStorage.getItem('printer') === null) {
				setFlagApp(false)
				setFlagPrinter(true)
				return setSetting(true)
			}
			const res = await service.examplePrint()
			if (res === undefined) return
			if (res.success) {
				setVisibleCodeTemplateFlag(true)
			}
		}

		const importTemplates = async e => {
			if (!e.target.files[0].name.match(/\.tdmc$/gm)) {
				return Msg.writeMessages(
					'Необходимо загрузить файл типа .tdmc (Template DMC). Экспортированный ранее из редактора этикеток DMC или DMC'
				)
			}
			try {
				const reader = new FileReader()
				reader.onload = async () => {
					const resID = await service.importCodeTemplate(reader.result)
					if (resID.success !== undefined) {
						await service.getTemplatesID(resID.data.id)
					}
				}
				reader.readAsText(e.target.files[0])
			} catch (e) {
				return Msg.writeMessages(e)
			}
			e.target.value = null
		}

		return (
			<div className='bar_label' style={{ border: Theme.theme_border }}>
				<div
					className='barlabel_title'
					style={{ borderBottom: Theme.theme_border }}
				>
					{Templates.new_template ? (
						<span className='new_name_blank_template'>Новый шаблон</span>
					) : (
						<>
							{!renameFlag ? (
								<span className='barlabel_rename_btn' onClick={openRenameBlock}>
									{Memory.name_template}
								</span>
							) : (
								<label
									ref={renameBlockRef}
									className='barlabel_rename_container'
								>
									<input
										placeholder='Введите новое название шаблона'
										className='barlabel_text'
										value={rename}
										onChange={handlerRename}
									/>
									<BtnVer1
										onClick={renameTemplate}
										maxWidth='28px'
										maxHeight='28px'
										margin='0'
									>
										<span className='barlabel_rename_enter'>&#8629;</span>
									</BtnVer1>
								</label>
							)}
						</>
					)}
					<div className='barlabel_btn_container'>
						{!visibleTemplates ? (
							<>
								{/* Редактор */}
								<BtnVer1 onClick={newTemplateFunc}>Создать новый</BtnVer1>

								<PostCompanent
									valueName={valueName}
									setValueName={setValueName}
								/>
								<BtnVer1 onClick={openTemplates}>Шаблоны</BtnVer1>
								<BtnVer1 onClick={visibleImportC}>
									Импорт кода (строками)
								</BtnVer1>
								<BtnVer1 onClick={reset}>Очистить текущий</BtnVer1>
								<BtnVer1 flagPreview={flagPreview} onClick={preview}>
									Предпросмотр
								</BtnVer1>
							</>
						) : (
							<>
								{/* Окно просмотра шаблона */}
								<BtnVer1 onClick={closedTemplates}>Закрыть</BtnVer1>
								<input
									ref={refCodeImport}
									type='file'
									accept='.tdmc'
									style={{ display: 'none' }}
									onChange={importTemplates}
								/>
								<BtnVer1 onClick={() => refCodeImport.current.click()}>
									Импорт из файла
								</BtnVer1>
							</>
						)}

						<BtnVer1 onClick={codePrintFunc}>Код печати</BtnVer1>
						<BtnVer1 onClick={examplePrintFunc}>Fake print</BtnVer1>
						<BtnVer1 onClick={trialPrintFunc}>Пробная печать</BtnVer1>

						{/* <button
              onClick={onMM}
              className={clsMMBtn}
              style={{ background: Theme.btn_background_black }}
            >
              #
            </button> */}
						{/* <span
              className="btn_back_history"
              style={{ background: Theme.btn_background_black }}
              onClick={backStepHistory}
            ></span> */}
						<div className='barlabel_container_printing'>
							{visibleCodeTemplateFlag ? (
								<CodeTemplayModal
									setVisibleCodeTemplateFlag={setVisibleCodeTemplateFlag}
								/>
							) : (
								<></>
							)}
							{/* <BtnVer1 onClick={getPingPrint}>Проверка связи</BtnVer1> */}

							<img
								onClick={() => setSetting(!setting)}
								className='barlabel_setting_printer'
								src={iconSettings}
								alt='Настройки принтера'
								style={{
									animation: setting
										? 'setting_printing_rotate 3s infinite linear'
										: '',
								}}
							/>
						</div>
						<BarInfo />
					</div>
				</div>

				<div className='barlabel_container'>
					<div className='barlabel_filter_container'>
						<label onChange={changeDpi}>
							dpi:{' '}
							<select
								className='barlabel_container_dpi'
								style={{ background: Theme.btn_background_black }}
							>
								<option value='12'>300</option>
								<option value='8'>200</option>
							</select>
						</label>
						<LabelInpVer1
							text='Ширина'
							value={Memory.width_label}
							onChange={changeW}
						/>
						<LabelInpVer1
							text='Высота'
							value={Memory.height_label}
							onChange={changeH}
						/>
						<LabelInpVer1
							text='Скругление'
							value={Memory.radius_label}
							onChange={changeR}
						/>
						<LabelInpVer1 text='Зазор' value={Memory.gap} onChange={changeG} />
						<label>
							Направление:
							<input
								className='barlabel_number'
								type='number'
								id='1'
								value={Memory.DIRECTION_1}
								onChange={changeDirection}
								style={{
									width: '25px',
									margin: '0 5px',
								}}
							/>
							,
							<input
								className='barlabel_number'
								type='number'
								id='2'
								value={Memory.DIRECTION_2}
								onChange={changeDirection}
								style={{
									width: '25px',
									margin: '0 5px',
								}}
							/>
						</label>
						<label>
							Смещение по x:
							<input
								className='barlabel_number'
								type='number'
								id='x'
								value={Memory.ref_x}
								onChange={changeRef}
								style={{
									width: '40px',
									margin: '0 5px',
								}}
							/>
							y:
							<input
								className='barlabel_number'
								type='number'
								id='y'
								value={Memory.ref_y}
								onChange={changeRef}
								style={{
									width: '40px',
									margin: '0 5px',
								}}
							/>
						</label>
					</div>
				</div>
			</div>
		)
	}
)
