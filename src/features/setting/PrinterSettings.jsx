import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { storePrinter } from '../../entites/printer/store'
import service from '../../request/service'
import Memory from '../../store/Memory'
import Msg from '../../store/Msg'

import { Btn, Stack } from '../../shared/ui'
import { SettingRow } from './SettingRow'

export const PrinterSettings = observer(({ setPrinterSetting }) => {
	const conf = storePrinter.getConfig()
	useEffect(() => {
		if (localStorage.getItem('printer') === null) {
			const printer = {
				host: '127.0.0.1',
				port: 9100,
				number_labels: 1,
				type_printer: 'tspl',
				printer_resolution: 300,
				VERSION: '',
				CODEPAGE: '',
				DENSITY: '',
				RIBBON: '',
				SHIFT_X: '',
				SHIFT_Y: '',
				SPEED: '',
			}
			localStorage.setItem('printer', JSON.stringify(printer))
		}
		writeOptionsSettingsPrinter()
	}, [])
	const [host, setHost] = useState('')
	const [hostFlag, setHostFlag] = useState(false)

	const [port, setPort] = useState('')
	const [portFlag, setPortFlag] = useState(false)
	const [count, setCount] = useState('')
	const [countFlag, setCountFlag] = useState(false)
	const [densityFlag, setDensityFlag] = useState(false)
	const [shiftXFlag, setshiftXFlag] = useState(false)
	const [shiftYFlag, setshiftYFlag] = useState(false)

	const [typePrinter, setTypePrinter] = useState('')
	const [printerResolution, setPrinterResolution] = useState('300')
	const [version, setVersion] = useState('')
	const [codepage, setCodepage] = useState('')
	const [density, setDensity] = useState('')
	const [shiftX, setShiftX] = useState('')
	const [shiftY, setShiftY] = useState('')
	const [speed, setSpeed] = useState('')

	const setPrinterSettings = () => {
		setshiftXFlag(false)
		setshiftYFlag(false)
		setHostFlag(false)
		setPortFlag(false)
		setCountFlag(false)
		setDensityFlag(false)
	}
	const selectTypePrinter = e => {
		setTypePrinter(e.target.value)
	}
	const selectDpiPrinter = e => {
		setPrinterResolution(e.target.value)
	}
	const setValue = (e, func) => {
		func(e.target.value)
	}

	const checkSettingsPrinter = async () => {
		try {
			const res = await service.getSettingsPrinter()
			if (res === undefined) {
				return Msg.writeMessages('Не удалось считать настройки')
			}
			const printer = JSON.parse(localStorage.getItem('printer'))
			console.log(res)
			if (res.DPI !== undefined) {
				printer.printer_resolution = res.DPI
			} else {
				printer.printer_resolution = 300
			}
			printer.VERSION = res.VERSION
			printer.CODEPAGE = res.CODEPAGE
			printer.SPEED = res.SPEED
			printer.DENSITY = res.DENSITY
			printer.SHIFT_X = res['SHIFT X']
			printer.SHIFT_Y = res['SHIFT Y']
			localStorage.setItem('printer', JSON.stringify(printer))
			writeOptionsSettingsPrinter()
		} catch (e) {
			console.error(e)
		}
	}

	const writeOptionsSettingsPrinter = () => {
		const printer = JSON.parse(localStorage.getItem('printer'))
		setHost(printer.host)
		setPort(printer.port)
		setTypePrinter(printer.type_printer)
		setPrinterResolution(printer.printer_resolution)
		setCount(printer.number_labels)
		setVersion(printer.VERSION)
		setCodepage(printer.CODEPAGE)
		setDensity(printer.DENSITY)
		setShiftX(printer.SHIFT_X)
		setShiftY(printer.SHIFT_Y)
		setSpeed(printer.SPEED)
	}

	const settingsPrinter = {
		host:
			JSON.parse(localStorage.getItem('printer')) !== null
				? JSON.parse(localStorage.getItem('printer')).host
				: '',
		port:
			JSON.parse(localStorage.getItem('printer')) !== null
				? JSON.parse(localStorage.getItem('printer')).port
				: '',
		type_printer:
			JSON.parse(localStorage.getItem('printer')) !== null
				? JSON.parse(localStorage.getItem('printer')).type_printer
				: '',
	}

	const rewritPrinting = () => {
		const printer = JSON.parse(localStorage.getItem('printer'))
		printer.host = host
		printer.port = port
		printer.number_labels = count
		printer.type_printer = typePrinter
		printer.printer_resolution = printerResolution
		printer.DENSITY = density
		printer.SHIFT_X = shiftX
		printer.SHIFT_Y = shiftY
		localStorage.setItem('printer', JSON.stringify(printer))
		settingsPrinter.host = JSON.parse(localStorage.getItem('printer')).host
		settingsPrinter.port = JSON.parse(localStorage.getItem('printer')).port
		settingsPrinter.type_printer = JSON.parse(
			localStorage.getItem('printer')
		).type_printer
	}

	const savePrinter = async () => {
		const printer = JSON.parse(localStorage.getItem('printer'))
		const shift_X = printer.SHIFT_X
		const shift_Y = printer.SHIFT_Y

		const host_old = printer.host
		const port_old = printer.port
		const number_labels_old = printer.number_labels
		const type_printer_old = printer.type_printer
		const printer_resolution_old = printer.printer_resolution

		printer.host = host
		printer.port = port
		printer.number_labels = count
		printer.type_printer = typePrinter
		printer.printer_resolution = printerResolution
		printer.DENSITY = density
		printer.SHIFT_X = shiftX
		printer.SHIFT_Y = shiftY
		localStorage.setItem('printer', JSON.stringify(printer))
		if (
			host_old !== host ||
			Number(port_old) !== Number(port) ||
			Number(number_labels_old) !== Number(count) ||
			type_printer_old !== typePrinter ||
			Number(printer_resolution_old) !== Number(printerResolution)
		) {
			Msg.writeMessages('Настройки принтера успешно сохранены.')
		}
		if (
			Number(shift_X) !== Number(shiftX) ||
			Number(shift_Y) !== Number(shiftY)
		) {
			settingsPrinter.shift = {
				x: Number(shiftX),
				y: Number(shiftY),
			}
			const res = await service.setSettingsPrinter(settingsPrinter)
			if (!res) {
				Msg.writeMessages(
					'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
				)
				const printer = JSON.parse(localStorage.getItem('printer'))
				printer.SHIFT_X = shift_X
				printer.SHIFT_Y = shift_Y
				localStorage.setItem('printer', JSON.stringify(printer))
			} else {
				Msg.writeMessages('Настройки смещения успешно сохранены.')
			}
		}
	}

	const getPingPrint = async () => {
		if (localStorage.getItem('printer') === null) {
			return setPrinterSetting(true)
		}
		await service.pingPrinter()
	}

	const printCalibration = async () => {
		rewritPrinting()
		settingsPrinter.calibration = true
		const res = await service.setSettingsPrinter(settingsPrinter)
		if (!res) {
			Msg.writeMessages(
				'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
			)
		}
	}

	return (
		<div className='setting_printing'>
			<div className='printer_setting_column_container'>
				<ul className='printer_setting_column'>
					<SettingRow
						editing
						type='text'
						name='ip-адрес:'
						value={host}
						onChange={e => setValue(e, setHost)}
						onClick={() => setPrinterSettings('host', host)}
					/>
					<SettingRow
						editing
						type='number'
						name='Порт:'
						value={port}
						onChange={e => setValue(e, setPort)}
						onClick={() => setPrinterSettings('port', port)}
					/>
					<SettingRow
						editing
						type='number'
						name='Кол-во:'
						value={count}
						onChange={e => setValue(e, setCount)}
						onClick={() => setPrinterSettings('number_labels', count)}
					/>

					<li className='printer_setting_row'>
						Тип принтера:
						<div className='printer_setting_radio_btn_container'>
							<label
								className='printer_setting_radio_label'
								style={{
									color:
										typePrinter === 'tspl' ? 'var(--mast-blue-1)' : '#8f8c8ce0',
								}}
							>
								tspl
								<input
									checked={typePrinter === 'tspl' ? true : false}
									className='printer_setting_radio_btn'
									name='printer'
									type='radio'
									value='tspl'
									onChange={selectTypePrinter}
								/>
							</label>
							<label
								style={{
									color:
										typePrinter === 'ezpl' ? 'var(--mast-blue-1)' : '#8f8c8ce0',
								}}
								className='printer_setting_radio_label'
							>
								ezpl
								<input
									checked={typePrinter === 'ezpl' ? true : false}
									className='printer_setting_radio_btn'
									name='printer'
									type='radio'
									value='ezpl'
									onChange={selectTypePrinter}
								/>
							</label>
						</div>
					</li>
					{Memory.visible_printer_settings ? (
						<>
							<SettingRow />
							<li className='printer_setting_row'>
								dpi:
								<div className='printer_setting_radio_btn_container'>
									<label
										className='printer_setting_radio_label'
										style={{
											color:
												printerResolution == 200
													? 'var(--mast-blue-1)'
													: '#8f8c8ce0',
										}}
									>
										200
										<input
											checked={printerResolution == 200 ? true : false}
											className='printer_setting_radio_btn'
											name='dpi'
											type='radio'
											value='200'
											onChange={selectDpiPrinter}
										/>
									</label>
									<label
										className='printer_setting_radio_label'
										style={{
											color:
												printerResolution == 300
													? 'var(--mast-blue-1)'
													: '#8f8c8ce0',
										}}
									>
										300
										<input
											checked={printerResolution == 300 ? true : false}
											className='printer_setting_radio_btn'
											name='dpi'
											type='radio'
											value='300'
											onChange={selectDpiPrinter}
										/>
									</label>
								</div>
							</li>
							<SettingRow name='Версия ПО:' value={version} />
							<SettingRow
								editing
								type='number'
								name='Смещение ТПГ по X:'
								value={shiftX}
								onChange={e => setValue(e, setShiftX)}
								onClick={() => setPrinterSettings('SHIFT_X', shiftX)}
							/>
							<SettingRow
								editing
								type='number'
								name='Смещение ТПГ по Y:'
								value={shiftY}
								onChange={e => setValue(e, setShiftY)}
								onClick={() => setPrinterSettings('SHIFT_Y', shiftY)}
							/>
							<SettingRow name='Плотность печати:' value={density} />
							<SettingRow name='Скорость печати:' value={speed} />
							<SettingRow name='Страница кодировки:' value={codepage} />
						</>
					) : (
						<></>
					)}
				</ul>
				<Stack justify='between' style={{ width: 160, height: '100%' }}>
					<Stack justify='start' gap='1rem'>
						<Btn outline onClick={checkSettingsPrinter}>
							Считать настройки
						</Btn>
						<Btn outline onClick={printCalibration}>
							Калибровка
						</Btn>
						<Btn outline onClick={getPingPrint}>
							Проверка связи
						</Btn>
					</Stack>
					<Btn outline onClick={savePrinter}>
						Сохранить
					</Btn>
				</Stack>
			</div>
		</div>
	)
})
