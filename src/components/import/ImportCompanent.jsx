import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { BtnVer1 } from '../../UI/btn/BtnVer1'
import Fonts from '../../store/Fonts'
import Memory from '../../store/Memory'
import Msg from '../../store/Msg'
import Object from '../../store/Object'
import Theme from '../../store/Theme'

export const ImportCompanent = observer(
	({ setImportC, selectedDM, setSelectedDM }) => {
		const refTextImport = useRef()
		const [fakeBodyDM, setFakeBodyDM] = useState(
			'0104603721020607215>(egukLfdK5r93zoJf'
		)
		const [{ unprocessedKey, unprocessedBody }, setUnprocessed] = useState({
			unprocessedKey: [],
			unprocessedBody: [],
		})
		const setDirection = (x, y) => {
			if (x < 0 || x > 1) {
				throw new Error(
					`Неверное значение значение derection по x-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${x} в шаблон`
				)
			}
			if (y < 0 || y > 1) {
				throw new Error(
					`Неверное значение значение derection по y-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${y} в шаблон`
				)
			}
			Memory.labelDirection1(x)
			//Memory.labelDirection2(y);
		}
		const setSize = (w, h) => {
			if (w < 15 || w > 150) {
				throw new Error(
					`Неверное значение ширины. Нижний порог ширины 15мм, верхний 150мм. Вы пытаетесь записать значение ${w}`
				)
			}
			if (h < 15 || h > 400) {
				throw new Error(
					`Неверное значение высоты. Нижний порог высоты 15мм, верхний 150мм. Вы пытаетесь записать значение ${h}`
				)
			}
			Memory.widthLabelChange(w)
			Memory.heigthLabelChange(h)
		}
		const setGap = (x, y) => {
			if (x < 0 || x > 30) {
				throw new Error(`Неверное значение gap.`)
			}
			Memory.gapLabelChange(x)
		}
		const setReference = (x, y) => {
			Memory.labelRefX(x)
			Memory.labelRefY(y)
		}
		const parseSplit = str => {
			return str
				.trim()
				.split(',')
				.map(v => v.trim())
		}
		const removeQuote = str => str.replace(/^"/, '').replace(/"$/, '')

		const createID = () => {
			let num = 1
			while (num <= Object.objects.length) {
				num++
			}
			Object.objects.forEach(obj => {
				if (obj.id === num) {
					num++
				}
			})
			return num
		}

		const tsplParser = {
			test(str) {
				return true
			},
			genObj(def = {}) {
				return {
					id: createID(),
					zIndex: 2,
					active: true,
					editSize: false,
					editSizeW: false,
					editSizeH: false,
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
					style: {
						boxShadow: 'none',
					},
					...def,
				}
			},
			parse(str) {
				const lines = str
					.trim()
					.split(/\n/)
					.map(v => String(v).trim())
				lines.forEach(line => this.parseLine(line))
			},
			parseLine(line) {
				;[
					'DIRECTION',
					'SIZE',
					'GAP',
					'REFERENCE',
					'DMATRIX',
					'TEXT',
					'BLOCK',
					'BARCODE',
					'QRCODE',
					'PUTBMP',
					'BOX',
					'BAR',
				].forEach(v => {
					const reg = new RegExp(`^${v}`)
					if (reg.test(line)) {
						this[`parse${v}`](line.replace(reg, ''))
					}
				})
			},
			parseDIRECTION(str) {
				const arr = parseSplit(str).map(v => Number(v.trim()))
				setDirection(...arr)
			},
			parseSIZE(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setSize(...arr)
			},
			parseGAP(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setGap(...arr)
			},
			parseREFERENCE(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setReference(...arr)
			},
			parseDMATRIX(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'datamatrix',
					typeObj: 'barcode',
					typeBarcode: 'datamatrix',
				})

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				// obj.w = parseInt(arr[2], 10);
				if (/^x/.test(arr[5])) {
					obj.w = parseInt(arr[5].replace(/^x/, ''), 10)
				} else {
					obj.w = 6
				}
				if (/^r/.test(arr[6])) {
					obj.style.rotate = parseInt(arr[6], 10) || 0
				}

				obj.h = obj.w
				obj.size = obj.w
				obj.min_size = obj.w / Memory.dpi
				obj.pxW = obj.w
				obj.pxH = obj.h

				obj.body = removeQuote(arr[8])
				obj.fakeBody = fakeBodyDM
				Object.addObj(obj)
				setSelectedDM(true)
			},
			parseTEXT(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'text',
					typeObj: 'text',
					w: 'fit-content',
					h: 'fit-content',
					pxW: 'fit-content',
					pxH: 'fit-content',
					cls: ['bardcode_container-text '],
					clsPreview: 'bardcode_container-text-preview',
				})

				obj.style.fontFamily = Fonts.default_font.name

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxFakeX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.font_family_id = Fonts.default_font.id

				obj.fontFamily = '0'
				Msg.writeMessages(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)

				obj.style.rotate = parseInt(arr[3], 10)
				obj.body = removeQuote(arr[6])

				switch (parseInt(arr[2], 10)) {
					case 1:
						obj.style.fontSize = 6
						break
					case 2:
						obj.style.fontSize = 7
						break
					case 3:
						obj.style.fontSize = 8
						break
					default:
						obj.style.fontSize = 12
				}

				Object.addObj(obj)
			},
			parseBLOCK(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'block',
					typeObj: 'block',
					cls: ['bardcode_container-block'],
					clsPreview: 'bardcode_container-block-preview',
				})
				obj.style.fontFamily = Fonts.default_font.name

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi

				obj.w =
					Math.abs(parseInt(arr[2], 10) - parseInt(arr[0], 10)) / Memory.dpi
				obj.h =
					Math.abs(parseInt(arr[3], 10) - parseInt(arr[1], 10)) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxW = obj.w
				obj.pxH = obj.h

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.font_family_id = Fonts.default_font.id
				obj.fontFamily = '0'
				Msg.writeMessages(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)

				switch (parseInt(arr[5], 10)) {
					case 1:
						obj.style.rotate = 90
						break
					case 2:
						obj.style.rotate = 180
						break
					case 3:
						obj.style.rotate = 270
						break
					default:
						obj.style.rotate = 0
				}
				obj.style.position = arr[9]

				switch (parseInt(arr[4], 10)) {
					case 1:
						obj.style.fontSize = 6
						break
					case 2:
						obj.style.fontSize = 7
						break
					case 3:
						obj.style.fontSize = 8
						break
					default:
						obj.style.fontSize = 12
				}
				obj.body = removeQuote(arr[11])
				Object.addObj(obj)
			},
			parseBARCODE(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'barcode',
					typeObj: 'barcode',
				})
				if (str.match(/EAN13/)) {
					obj.typeBarcode = 'ean13'
					obj.fakeBody = '978020137962'
				} else if (str.match(/128/)) {
					obj.typeBarcode = 'code128'
					obj.fakeBody = 'barcode046037210206'
				} else {
					throw new Error('Найдена ошибка в типе barcode')
				}

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi
				obj.h = parseInt(arr[3], 10) / Memory.dpi
				obj.human_readable = parseInt(arr[4], 10)
				obj.human_readable_visible = obj.human_readable > 0
				obj.style.position = parseInt(arr[4], 10)
				obj.style.rotate = parseInt(arr[5], 10)
				obj.w = parseInt(arr[6], 10)

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxFakeX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.pxW = obj.w
				obj.pxH = Math.round(obj.h)
				obj.body = removeQuote(arr[8])
				Object.addObj(obj)
			},
			parseQRCODE(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'qrcode',
					typeObj: 'barcode',
					typeBarcode: 'qrcode',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
					w: 10,
					h: 10,
					pxW: 10,
					pxH: 10,
				})

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi

				obj.style.rotate = parseInt(arr[5], 10)

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm

				obj.body = removeQuote(arr[8])

				obj.fakeBody = 'barcode046037210206'
				Object.addObj(obj)
			},
			parsePUTBMP(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'img',
					typeObj: 'img',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
					body: '#',
					id: 999,
					w: 10,
					h: 10,
					pxW: 10,
					pxH: 10,
				})

				obj.x = (parseInt(arr[0], 10) * Memory.mm) / Memory.dpi
				obj.y = (parseInt(arr[1], 10) * Memory.mm) / Memory.dpi

				obj.pxX = obj.x
				obj.pxY = obj.y

				Msg.writeMessages(
					'Изображение не загружено, пожалуйста, передобавьте его вручную.'
				)

				Object.addObj(obj)
			},
			parseBOX(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'Бокс',
					typeObj: 'box',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
				})
				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi
				obj.w =
					Math.abs(parseInt(arr[0], 10) - parseInt(arr[2], 10)) / Memory.dpi
				obj.h =
					Math.abs(parseInt(arr[1], 10) - parseInt(arr[3], 10)) / Memory.dpi
				obj.line_thickness = parseInt(arr[4], 10) / Memory.dpi
				obj.borderRadius = parseInt(arr[5], 10)

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxW = obj.w
				obj.pxH = obj.h

				Object.addObj(obj)
			},
			parseBAR(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'Линия',
					typeObj: 'lines',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
				})

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi
				obj.w = parseInt(arr[2], 10) / Memory.dpi
				obj.h = parseInt(arr[3], 10) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxW = obj.w
				obj.pxH = obj.h

				Object.addObj(obj)
			},
		}

		const ezplParser = {
			test(str) {
				return /\^Q/.test(str)
			},
			parse(str) {
				const arr = str
					.trim()
					.split('^')
					.map(v => String(v).trim())
				arr.shift()
				let i = 0
				const count = arr.length
				const unprocessed = []
				while (i < count) {
					if (/^Q/.test(arr[i])) {
						let s = arr[i].replace(/^Q/, '').split(',')
						s[0] && Memory.heigthLabelChange(parseInt(s[0], 10))
						s[1] && Memory.gapLabelChange(parseInt(s[1], 10))
					} else if (/^H/.test(arr[i])) {
						Memory.heigthLabelChange(parseInt(arr[i].replace(/^H/, ''), 10))
					} else if (/^W/.test(arr[i])) {
						Memory.widthLabelChange(parseInt(arr[i].replace(/^W/, ''), 10))
					} else if (/^R/.test(arr[i])) {
						Memory.labelRefX(parseInt(arr[i].replace(/^R/, ''), 10))
					} else if (/^L/.test(arr[i])) {
						this.parseContent(arr[i].replace(/^L/, ''))
					} else {
						unprocessed.push(arr[i])
					}
					i++
				} //*/
				setUnprocessed(v => ({ ...v, unprocessedKey: unprocessed }))
			},
			genObj(def = {}) {
				return {
					id: createID(),
					zIndex: 2,
					active: true,
					editSize: false,
					editSizeW: false,
					editSizeH: false,
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
					style: {
						boxShadow: 'none',
					},
					...def,
				}
			},
			parseContent(str) {
				const lines = str
					.trim()
					.split(/\n/)
					.map(v => String(v).trim())
				const count = lines.length
				let i = 0
				const unprocessed = []
				while (i < count) {
					let obj = this.genObj()
					if (/^AT.?,/.test(lines[i])) {
						this.textElement(obj, lines[i].replace(/^AT/, ''))
					} else if (/^XRB/.test(lines[i])) {
						this.datamatrixElement(
							obj,
							lines[i].replace(/^XRB/, ''),
							lines[i + 1]
						)
						setSelectedDM(true)
						i++
					} else if (/^W/.test(lines[i])) {
						this.qrcodeElement(obj, lines[i].replace(/^W/, ''), lines[i + 1])
						i++
					} else if (/^Y/.test(lines[i])) {
						this.putbmpElement(obj, lines[i].replace(/^Y/, ''))
					} else if (/^BE/.test(lines[i])) {
						this.barcodeElementEAN13(obj, lines[i].replace(/^BE/, ''))
					} else if (/^BQ/.test(lines[i])) {
						this.barcodeElementCode128(obj, lines[i].replace(/^BQ/, ''))
					} else if (/^L/.test(lines[i])) {
						this.barElement(obj, lines[i].replace(/^L/, ''))
					} else {
						unprocessed.push(lines[i])
					}
					lines[i] != 'E' && Object.addObj(obj)
					i++
				} //*/
				setUnprocessed(v => ({ ...v, unprocessedBody: unprocessed }))
			},
			textElement(obj, str) {
				obj.name = 'text'
				obj.typeObj = 'text'
				obj.w = 'fit-content'
				obj.h = 'fit-content'
				obj.pxW = 'fit-content'
				obj.pxH = 'fit-content'
				obj.style.fontFamily = Fonts.default_font.name

				const arr = str.split(',').map(v => String(v).trim())

				obj.x = arr[1] / Memory.dpi
				obj.y = arr[2] / Memory.dpi
				obj.style.rotate = arr[6]
				obj.body = arr[9]

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.pxY = obj.y * Memory.mm
			},
			datamatrixElement(obj, str, body) {
				obj.name = 'datamatrix'
				obj.typeObj = 'barcode'
				obj.typeBarcode = 'datamatrix'
				const arr = str.trim().split(',')

				obj.x = (parseInt(arr[0], 10) * Memory.mm) / Memory.dpi
				obj.y = (parseInt(arr[1], 10) * Memory.mm) / Memory.dpi
				obj.w = parseInt(arr[2].replace(/[^\d]/, ''), 10)
				obj.h = obj.w
				obj.style.rotate = parseInt(arr[3].replace(/[^\d]/, ''), 10)

				obj.size = obj.w
				obj.min_size = obj.w / Memory.dpi
				obj.pxW = obj.w
				obj.pxH = obj.h
				obj.pxX = obj.x
				obj.pxY = obj.y
				obj.body = body
				obj.fakeBody = fakeBodyDM
			},
			putbmpElement(obj, str) {
				obj.name = 'img'
				obj.typeObj = 'img'
				obj.body = '#'
				obj.id = 999
				obj.w = 10
				obj.h = 10
				obj.pxW = 10
				obj.pxH = 10
				const arr = str.split(',').map(v => String(v).trim())

				obj.x = (parseInt(arr[0], 10) * Memory.mm) / Memory.dpi
				obj.y = (parseInt(arr[1], 10) * Memory.mm) / Memory.dpi
				obj.pxX = obj.x
				obj.pxY = obj.y
				Msg.writeMessages(
					'Изображение не загружено, пожалуйста, передобавьте его вручную.'
				)
			},
			barElement(obj, str) {
				obj.name = 'Линия'
				obj.typeObj = 'lines'
				obj.style.rotate = 0

				const arr = str.split(',').map(v => String(v).trim())

				const p1 = [
					parseInt(arr[1], 10) / Memory.dpi,
					parseInt(arr[2], 10) / Memory.dpi,
				]
				const p2 = [
					parseInt(arr[4], 10) / Memory.dpi,
					parseInt(arr[5], 10) / Memory.dpi,
				]

				obj.x = Math.min(p1[0], p2[0])
				obj.y = Math.min(p1[1], p2[1])

				const x = Math.max(p1[0], p2[0])
				const y = Math.max(p1[1], p2[1])

				const dx = Math.abs(x - obj.x)
				const dy = Math.abs(y - obj.y)

				obj.w = y === 0 || dy === 0 ? dx : parseInt(arr[3], 10) / Memory.dpi
				obj.h = x === 0 || dx === 0 ? dy : parseInt(arr[3], 10) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm

				obj.pxW = obj.w
				obj.pxH = obj.h
			},
			barcodeElement(obj, str, type) {
				const arr = str.split(',').map(v => String(v).trim())

				obj.x = parseInt(arr[1], 10) / Memory.dpi
				obj.y = parseInt(arr[2], 10) / Memory.dpi

				obj.w = parseInt(arr[4], 10)
				obj.h = parseInt(arr[5], 10) / Memory.dpi

				obj.human_readable = parseInt(arr[7], 10)
				obj.human_readable =
					obj.human_readable === 1 || obj.human_readable === 2
						? 1
						: obj.human_readable === 3 || obj.human_readable === 4
						? 2
						: obj.human_readable === 5 || obj.human_readable === 6
						? 3
						: 0

				obj.human_readable_visible = obj.human_readable > 0

				obj.style.rotate = parseInt(arr[6], 10)
				obj.style.position = 'left'
				obj.body = arr[8]

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxH = Math.round(obj.h)
			},
			barcodeElementEAN13(obj, str) {
				obj.name = 'barcode'
				obj.typeObj = 'barcode'
				obj.typeBarcode = 'ean13'
				obj.human_readable_visible = false
				obj.fakeBody = '978020137962'
				this.barcodeElement(obj, str, 'EAN13')
			},
			barcodeElementCode128(obj, str) {
				obj.name = 'barcode'
				obj.typeObj = 'barcode'
				obj.typeBarcode = 'code128'
				obj.human_readable_visible = false
				obj.fakeBody = 'barcode046037210206'
				this.barcodeElement(obj, str, '128')
			},
			qrcodeElement(obj, str, body) {
				obj.name = 'qrcode'
				obj.typeObj = 'barcode'
				obj.typeBarcode = 'qrcode'
				obj.w = 10
				obj.h = 10
				obj.pxW = 10
				obj.pxH = 10

				const arr = str.split(',').map(v => String(v).trim())

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi
				obj.style.rotate = parseInt(arr[8], 10)

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxX = obj.x * Memory.mm

				obj.pxFakeY = obj.y * Memory.mm
				obj.pxY = obj.y * Memory.mm

				obj.body = body
				obj.fakeBody = 'barcode046037210206'
			},
		}

		const importString = () => {
			if (refTextImport.current.value < 10) {
				return
			}
			try {
				if (ezplParser.test(refTextImport.current.value)) {
					ezplParser.parse(refTextImport.current.value)
				} else if (tsplParser.test(refTextImport.current.value)) {
					tsplParser.parse(refTextImport.current.value)
				}
			} catch (e) {
				console.log(e)
				Msg.writeMessages(e.message)
			}
		}

		// Из файла
		const txtRef = useRef()

		const handlerTxtFile = e => {
			const reader = new FileReader()
			reader.onload = () => {
				console.log(reader.result)
				refTextImport.current.innerHTML = reader.result
			}
			reader.readAsText(e.target.files[0])
			console.log(e.target.files)
		}

		useEffect(() => {
			console.log(unprocessedKey)
		}, [unprocessedKey])
		useEffect(() => {
			console.log(unprocessedBody)
		}, [unprocessedBody])
		return (
			<div
				className='import_container bar_label'
				style={{ background: Theme.background }}
			>
				<p className='import_container_title'>Импорт шаблона</p>
				<h3>
					<div>Необработанные ключи: {unprocessedKey.join(' ')}</div>
					<div>Необработанное тело: {unprocessedBody.join(' ')}</div>
				</h3>
				<textarea
					ref={refTextImport}
					placeholder='Скопируйте в данное поле текст шаблона для принтера, на языке TSPL или EZPL (В разработке)...'
					className='import_container_body'
				></textarea>

				<div className='import_container_btn_container'>
					<BtnVer1 onClick={importString}>Импортировать</BtnVer1>
					<BtnVer1 onClick={() => setImportC(false)}>Закрыть </BtnVer1>
					<BtnVer1 onClick={() => txtRef.current.click()}>
						Из файла .txt{' '}
					</BtnVer1>
				</div>
				<input
					onChange={handlerTxtFile}
					className='hidden'
					ref={txtRef}
					type='file'
				/>
			</div>
		)
	}
)
