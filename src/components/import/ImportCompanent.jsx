import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { BtnVer1 } from '../../UI/btn/BtnVer1'
import Fonts from '../../store/Fonts'
import Memory from '../../store/Memory'
import Msg from '../../store/Msg'
import Object from '../../store/Object'
import Theme from '../../store/Theme'

export const ImportCompanent = observer(
	({ setImportC, selectedDM, setSelectedDM }) => {
		const refTextImport = useRef()
		const parseSplit = str => {
			return str
				.trim()
				.split(',')
				.map(v => v.trim())
		}
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
		const removeQuote = str => str.replace(/^"/, '').replace(/"$/, '')

		const removeSpace = string => {
			return string.replace(/ |mm/g, '')
		}
		const regAttributeLabel = (string, flagTwo) => {
			if (!flagTwo) {
				const regString = new RegExp(`${string}\\d*`)
				const regEquation = String(
					removeSpace(refTextImport.current.value).match(regString)
				)
				if (regString) {
					if (regEquation === 'DIRECTION0') {
						return 1
					}
					return Number(regEquation.match(/\d{2}|\d/))
				}
			} else {
				const regCheckDirection = new RegExp(`${string}.*`)
				// const regString = new RegExp(`${string}\\d*,\\d*`);
				const regString = new RegExp(`${string}\\d*(\\w*\\.\\d*\\w*)?,\\d*`)
				const regEquation = String(
					removeSpace(refTextImport.current.value).match(regString)
				)
				console.log(
					'regAttributeLabel',
					regString,
					string,
					refTextImport.current.value,
					regEquation
				)
				if (
					String(
						removeSpace(refTextImport.current.value).match(regCheckDirection)
					) === 'DIRECTION0'
				) {
					return Memory.labelDirection2(0)
				} else {
					if (regEquation.match(`\\.`)) {
						console.log('1111 ===> .....')
						const regReplaceOne = String(regEquation.match(`\\d*(,\\.\\d)?$`))
						const regReplaceTwo = regReplaceOne.match(`^\\d*`)
						console.log('=====>', String(regReplaceTwo))
						return String(regReplaceTwo)
					} else {
						const regReplace = new RegExp(`${string}\\d*,`)
						const h = regEquation.replace(regReplace, '')
						console.log(h.replace(/[,.]/g, ''))
						return h.replace(/[,.]/g, '')
					}
				}
			}
		}

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

		const regAttributeElement = (string, reg, el) => {
			const regStringEl = new RegExp(`${string}${reg}`)
			const regEquation = String(removeSpace(el).match(regStringEl))
			return Number(regEquation.match(/\d{1,4}$/g))
		}

		// const regDMRchange = (el) => {
		//   if (el.match(/,r\d{1,3}/g)) {
		//     const string = el.replace(/,r\d{1,3}/g, "");
		//     const regString = String(
		//       string.match(/\d*,\d*,\d*,\d*,[Cc]126,x\d*,\d{1,3}/)
		//     );
		//     return Number(regString.match(/\d{1,4}$/g));
		//   } else {
		//     const regString = String(
		//       el.match(/\d*,\d*,\d*,\d*,[Cc]126,x\d*,\d{1,3}/)
		//     );
		//     return Number(regString.match(/\d{1,4}$/g));
		//   }
		// };

		const regBodyElement = (string, reg, el, text) => {
			const regStringEl = new RegExp(`${string}\\s?${reg}`)
			if (el.match(/@1/)) return '@1'
			if (text) {
				const regBody = String(el.match(/"[^"]*"$/))
				return String(regBody.replace(/"$|"$\s|^"|\s^"/g, ''))
			} else {
				const regEquation = String(removeSpace(el).match(reg))

				const regBody = String(regEquation.match(/".*"$/g))
				return String(regBody.replace(/"$|"$\s|^"|\s^"/g, ''))
			}
		}

		const datamatrixElement = async (obj, el) => {
			// dm
			obj.x =
				(regAttributeElement('DMATRIX', `\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxX = obj.x
			obj.y =
				(regAttributeElement('DMATRIX', `\\d*,\\d*`, el) * Memory.mm) /
				Memory.dpi
			obj.pxY = obj.y
			// obj.w = regAttributeElement("DMATRIX", `\\d*,\\d*,\\d*`, el);
			if (
				regAttributeElement(
					'DMATRIX',
					`\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*`,
					el
				) === 0
			) {
				console.log(111111)

				obj.w = 6
			} else {
				console.log(22222)
				obj.w = regAttributeElement(
					'DMATRIX',
					`\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*`,
					el
				)
			}
			obj.h = obj.w
			obj.size = obj.w
			obj.min_size = obj.w / Memory.dpi
			obj.pxW = obj.w
			obj.pxH = obj.w
			obj.style.rotate = String(
				regAttributeElement(
					'DMATRIX',
					`\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*,r\\d*`,
					el
				)
			)
			obj.body = regBodyElement('DMATRIX', `".*"`, el)
			obj.fakeBody = fakeBodyDM
		}

		const textElement = (obj, el) => {
			obj.x = regAttributeElement('TEXT', `\\d*`, el) / Memory.dpi
			obj.pxFakeX = obj.x * Memory.mm
			obj.pxX = obj.x * Memory.mm
			obj.y = regAttributeElement('TEXT', `\\d*,\\d*`, el) / Memory.dpi
			obj.pxFakeY = obj.y * Memory.mm
			obj.pxY = obj.y * Memory.mm
			obj.font_family_id = Fonts.default_font.id
			if (
				Number(regAttributeElement('TEXT', `\\d*,\\d*,\\s?"\\d*`, el)) === 2
			) {
				obj.style.fontSize = 7
			} else if (
				Number(regAttributeElement('TEXT', `\\d*,\\d*,\\s?"\\d*`, el)) === 0
			) {
				obj.style.fontSize = 12
			} else if (
				Number(regAttributeElement('TEXT', `\\d*,\\d*,\\s?"\\d*`, el)) === 1
			) {
				obj.style.fontSize = 6
			} else if (
				Number(regAttributeElement('TEXT', `\\d*,\\d*,\\s?"\\d*`, el)) === 3
			) {
				obj.style.fontSize = 8
			} else if (
				Number(regAttributeElement('TEXT', `\\d*,\\d*,\\s?"\\d*`, el)) === 4
			) {
				obj.style.fontSize = 12
			}
			obj.w = 12
			obj.pxW = 12
			obj.h = 6
			obj.pxH = 6
			obj.fontFamily = '0'
			Msg.writeMessages(
				'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
			)
			obj.style.rotate = regAttributeElement(
				'TEXT',
				`\\d*,\\d*,\\s?"[\\dA-Za-z]",\\d*`,
				el
			)
			obj.body = regBodyElement(
				'TEXT',
				`\\d*,\\d*,\\s?"[А-Яа-яьЬъЪыЫёЁйЙA-Za-z-_\\d.]*",\\d*,\\d*,\\d*,\\d?,\\s?(".+")|@1`,
				el,
				true
			)
		}

		const blockElement = (obj, el) => {
			obj.x = regAttributeElement('BLOCK', `\\d*`, el) / Memory.mm
			obj.pxFakeX = obj.x
			obj.pxX = obj.x
			obj.y = regAttributeElement('BLOCK', `\\d*,\\d*`, el) / Memory.dpi
			obj.pxFakeY = obj.y * Memory.mm
			obj.pxY = obj.y * Memory.mm
			obj.w = regAttributeElement('BLOCK', `\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.h =
				regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.pxW = obj.w
			obj.pxH = obj.h
			obj.font_family_id = Fonts.default_font.id
			obj.fontFamily = '0'
			Msg.writeMessages(
				'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
			)
			if (
				regAttributeElement(
					'BLOCK',
					`\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
					el
				) === 0
			) {
				obj.style.rotate = 0
			} else if (
				regAttributeElement(
					'BLOCK',
					`\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
					el
				) === 1
			) {
				obj.style.rotate = '90'
			} else if (
				regAttributeElement(
					'BLOCK',
					`\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
					el
				) === 2
			) {
				obj.style.rotate = '180'
			} else if (
				regAttributeElement(
					'BLOCK',
					`\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
					el
				) === 3
			) {
				obj.style.rotate = '270'
			}
			obj.style.position = String(
				regAttributeElement(
					'BLOCK',
					`\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*,\\d*,\\d*,\\d*`,
					el
				)
			)
			if (
				Number(
					regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
				) === 2
			) {
				obj.style.fontSize = 7
			} else if (
				Number(
					regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
				) === 0
			) {
				obj.style.fontSize = 12
			} else if (
				Number(
					regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
				) === 1
			) {
				obj.style.fontSize = 6
			} else if (
				Number(
					regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
				) === 3
			) {
				obj.style.fontSize = 8
			} else if (
				Number(
					regAttributeElement('BLOCK', `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
				) === 4
			) {
				obj.style.fontSize = 12
			}
			obj.body = regBodyElement(
				'BLOCK',
				`\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?"[А-Яа-яьЬъЪыЫёЁйЙA-Za-z-_\\d.]+"\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?".*"\\s?`,
				el,
				true
			)
		}

		const putbmpElement = (obj, el) => {
			obj.x =
				(regAttributeElement('PUTBMP', `\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxX = obj.x
			obj.y =
				(regAttributeElement('PUTBMP', `\\d*,\\d*`, el) * Memory.mm) /
				Memory.dpi
			obj.pxY = obj.y
			Msg.writeMessages(
				'Изображение не загружено, пожалуйста, передобавьте его вручную.'
			)
		}

		const barcodeElement = (obj, el, barcode) => {
			obj.x = regAttributeElement('BARCODE', `\\d*`, el) / Memory.dpi
			obj.pxFakeX = obj.x * Memory.mm
			obj.pxX = obj.x * Memory.mm
			obj.y = regAttributeElement('BARCODE', `\\d*,\\d*`, el) / Memory.dpi
			obj.pxFakeY = obj.y * Memory.mm
			obj.pxY = obj.y * Memory.mm
			obj.h =
				regAttributeElement('BARCODE', `\\d*,\\d*,"${barcode}",\\d*`, el) /
				Memory.dpi
			obj.pxH = Math.round(obj.h)
			obj.human_readable = regAttributeElement(
				'BARCODE',
				`\\d*,\\d*,"${barcode}",\\d*,\\d`,
				el
			)
			obj.style.position = Number(
				regAttributeElement('BARCODE', `\\d*,\\d*,"${barcode}",\\d*,\\d`, el)
			)
			obj.style.rotate = regAttributeElement(
				'BARCODE',
				`\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*`,
				el
			)
			obj.w = regAttributeElement(
				'BARCODE',
				`\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*,\\d`,
				el
			)
			// obj.pxW = obj.w;
			obj.body = regBodyElement(
				'BARCODE',
				`\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*,\\d,"\\d*"`,
				el,
				true
			)
			if (barcode === 'EAN13') {
				obj.fakeBody = '978020137962'
			} else if (barcode === '128') {
				obj.fakeBody = 'barcode046037210206'
			}
		}

		const barElement = (obj, el) => {
			obj.x = (regAttributeElement('BAR', `\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxFakeX = obj.x
			obj.y =
				(regAttributeElement('BAR', `\\d*,\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxFakeY = obj.y
			obj.w = regAttributeElement('BAR', `\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.pxW = obj.w
			obj.h = regAttributeElement('BAR', `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.pxH = obj.h
		}

		const qrcodeElement = (obj, el) => {
			obj.x = regAttributeElement('QRCODE', `\\d*`, el) / Memory.dpi
			obj.pxFakeX = obj.x * Memory.mm
			obj.pxX = obj.x * Memory.mm
			obj.y = regAttributeElement('QRCODE', `\\d*,\\d*`, el) / Memory.dpi

			obj.style.rotate = regAttributeElement(
				'QRCODE',
				`\\d*,\\d*,[L|M|Q|H],\\d,[A|M]\\d*`,
				el
			)
			obj.pxFakeY = obj.y * Memory.mm
			obj.pxY = obj.y * Memory.mm
			obj.body = regBodyElement(
				'QRCODE',
				`\\d*,\\d*,[L?|M?|Q?|H?],\\d*,[A?|M?],\\d*,\\w{2}?,\\w{2}?,".*"`,
				el
			)
			obj.fakeBody = 'barcode046037210206'
		}

		const boxElement = (obj, el) => {
			obj.x = (regAttributeElement('BOX', `\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxX = obj.x
			obj.y =
				(regAttributeElement('BOX', `\\d*,\\d*`, el) * Memory.mm) / Memory.dpi
			obj.pxY = obj.y
			obj.w = regAttributeElement('BOX', `\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.pxW = obj.w
			obj.h = regAttributeElement('BOX', `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi
			obj.pxH = obj.h
			obj.line_thickness = regAttributeElement(
				'BOX',
				`\\d*,\\d*,\\d*,\\d*,\\d*`,
				el
			)
			obj.borderRadius = regAttributeElement(
				'BOX',
				`\\d*,\\d*,\\d*,\\d*,\\d*,\\d*`,
				el
			)
		}

		const regElement = string => {
			const el = String(string.match(/^[A-Z]*/))
			if (el) {
				const obj = {
					id: createID(),
					zIndex: 2,
					active: true,
					editSize: false,
					editSizeW: false,
					editSizeH: false,
					style: {
						boxShadow: 'none',
					},
				}
				// DataMatrix
				if (el === 'DMATRIX') {
					obj.name = 'datamatrix'
					obj.typeObj = 'barcode'
					obj.typeBarcode = 'datamatrix'
					datamatrixElement(obj, string)
					setSelectedDM(true)
					// Text
				} else if (el === 'TEXT') {
					obj.name = 'text'
					obj.typeObj = 'text'
					obj.w = 'fit-content'
					obj.h = 'fit-content'
					obj.pxW = 'fit-content'
					obj.pxH = 'fit-content'
					textElement(obj, string)
					obj.cls = ['bardcode_container-text ']
					obj.clsPreview = 'bardcode_container-text-preview'
					obj.style.fontFamily = Fonts.default_font.name
					// Block
				} else if (el === 'BLOCK') {
					obj.name = 'block'
					obj.typeObj = 'block'
					obj.cls = ['bardcode_container-block ']
					obj.clsPreview = 'bardcode_container-block-preview'
					obj.style.fontFamily = Fonts.default_font.name
					blockElement(obj, string)
					// Barcode
				} else if (el === 'BARCODE') {
					// obj.style.fontSize = 12;
					// Ean13
					if (string.match(/EAN13/)) {
						obj.name = 'barcode'
						obj.typeObj = 'barcode'
						obj.typeBarcode = 'ean13'
						barcodeElement(obj, string, 'EAN13')
						obj.human_readable_visible = false
					} else if (string.match(/128/)) {
						obj.name = 'barcode'
						obj.typeObj = 'barcode'
						obj.typeBarcode = 'code128'

						barcodeElement(obj, string, '128')
						obj.human_readable_visible = false
					} else {
						return Msg.writeMessages('Найдена ошибка в типе barcode')
					}
				} else if (el === 'PUTBMP') {
					obj.name = 'img'
					obj.typeObj = 'img'
					obj.body = '#'
					obj.id = 999
					obj.w = 10
					obj.h = 10
					obj.pxW = 10
					obj.pxH = 10
					putbmpElement(obj, string)
					obj.cls = ['bardcode_container-barcode']
					obj.clsPreview = 'bardcode_container-barcode-preview'
				} else if (el === 'BAR') {
					obj.name = 'Линия'
					obj.typeObj = 'bar'
					obj.cls = ['bardcode_container-barcode']
					obj.clsPreview = 'bardcode_container-barcode-preview'
					barElement(obj, string)
				} else if (el === 'BOX') {
					obj.name = 'Бокс'
					obj.typeObj = 'box'
					obj.cls = ['bardcode_container-barcode']
					obj.clsPreview = 'bardcode_container-barcode-preview'
					boxElement(obj, string)
				} else if (el === 'QRCODE') {
					obj.name = 'qrcode'
					obj.typeObj = 'barcode'
					obj.typeBarcode = 'qrcode'
					obj.cls = ['bardcode_container-barcode']
					obj.clsPreview = 'bardcode_container-barcode-preview'
					obj.w = 10
					obj.h = 10
					obj.pxW = 10
					obj.pxH = 10
					qrcodeElement(obj, string)
				} else {
					return
				}
				if (obj.typeObj === 'barcode') {
					obj.cls = ['bardcode_container-barcode']
					obj.clsPreview = 'bardcode_container-barcode-preview'
				}
				Object.addObj(obj)
			}
		}

		const importStringTemplate = () => {
			try {
				// Объекты
				const elemets = new RegExp(
					`DMATRIX.*|TEXT.*|BLOCK.*|EAN13.*|CODE128.*|QRCODE.*|PUTBMP.*|BOX.*|BAR.*`,
					`g`
				)
				console.log(refTextImport.current.value.match(elemets))
				refTextImport.current.value.match(elemets).forEach(string => {
					console.log(string)
					regElement(string)
				})
				setImportC(false)
			} catch (e) {
				console.log(e)
			}
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
				console.log(lines)
				lines.forEach(line => {
					if (/^DIRECTION/.test(line)) {
						this.parseDirection(line.replace(/^DIRECTION/, ''))
					} else if (/^SIZE/.test(line)) {
						this.parseSize(line.replace(/^SIZE/, ''))
					} else if (/^GAP/.test(line)) {
						this.parseGap(line.replace(/^GAP/, ''))
					} else if (/^REFERENCE/.test(line)) {
						this.parseReference(line.replace(/^REFERENCE/, ''))
					} else if (/^DMATRIX/.test(line)) {
						this.parseDmatrix(line.replace(/^DMATRIX/, ''))
					} else if (/^TEXT/.test(line)) {
						this.parseText(line.replace(/^TEXT/, ''))
					} else if (/^BLOCK/.test(line)) {
						this.parseBlock(line.replace(/^BLOCK/, ''))
					} else if (/^BARCODE/.test(line)) {
						this.parseBarcode(line.replace(/^BARCODE/, ''))
					} else if (/^QRCODE/.test(line)) {
						this.parseQrcode(line.replace(/^QRCODE/, ''))
					} else if (/^PUTBMP/.test(line)) {
						this.parsePutbmp(line.replace(/^PUTBMP/, ''))
					} else if (/^BOX/.test(line)) {
						this.parseBox(line.replace(/^BOX/, ''))
					} else if (/^BAR/.test(line)) {
						this.parseBar(line.replace(/^BAR/, ''))
					}
				})
			},
			parseDirection(str) {
				const arr = parseSplit(str).map(v => Number(v.trim()))
				setDirection(...arr)
			},
			parseSize(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setSize(...arr)
			},
			parseGap(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setGap(...arr)
			},
			parseReference(str) {
				const arr = parseSplit(str).map(v => parseInt(v, 10))
				setReference(...arr)
			},
			parseDmatrix(str) {
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
			parseText(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'text',
					typeObj: 'text',
					w: 'fit-content',
					h: 'fit-content',
					pxW: 'fit-content',
					pxH: 'fit-content',
				})

				obj.style.fontFamily = Fonts.default_font.name

				obj.x = parseInt(arr[0], 10) / Memory.dpi
				obj.y = parseInt(arr[1], 10) / Memory.dpi
				obj.w = 12
				obj.h = 6

				obj.pxFakeX = obj.x * Memory.mm
				obj.pxX = obj.x * Memory.mm
				obj.pxFakeY = obj.y * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.font_family_id = Fonts.default_font.id
				obj.pxW = obj.w
				obj.pxH = obj.h
				obj.fontFamily = '0'
				Msg.writeMessages(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)

				obj.style.rotate = parseInt(arr[3], 10)
				obj.body = removeQuote(arr[6])

				if (parseInt(arr[2], 10) === 2) {
					obj.style.fontSize = 7
				} else if (parseInt(arr[2], 10) === 0) {
					obj.style.fontSize = 12
				} else if (parseInt(arr[2], 10) === 1) {
					obj.style.fontSize = 6
				} else if (parseInt(arr[2], 10) === 3) {
					obj.style.fontSize = 8
				} else if (parseInt(arr[2], 10) === 4) {
					obj.style.fontSize = 12
				}

				Object.addObj(obj)
			},
			parseBlock(str) {
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

				obj.w = parseInt(arr[2], 10) / Memory.dpi
				obj.h = parseInt(arr[3], 10) / Memory.dpi

				obj.pxX = obj.x * Memory.mm
				obj.pxY = obj.y * Memory.mm
				obj.pxW = obj.w
				obj.pxH = obj.h

				obj.pxFakeX = obj.x
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
			parseBarcode(str) {
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
			parseQrcode(str) {
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
			parsePutbmp(str) {
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
			parseBox(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'Бокс',
					typeObj: 'box',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
				})
				obj.x = (parseInt(arr[0], 10) * Memory.mm) / Memory.dpi
				obj.y = (parseInt(arr[1], 10) * Memory.mm) / Memory.dpi
				obj.w = parseInt(arr[2], 10) / Memory.dpi
				obj.h = parseInt(arr[3], 10) / Memory.dpi
				obj.line_thickness = parseInt(arr[4], 10)
				obj.borderRadius = parseInt(arr[5], 10)

				obj.pxX = obj.x
				obj.pxY = obj.y
				obj.pxW = obj.w
				obj.pxH = obj.h

				Object.addObj(obj)
			},
			parseBar(str) {
				const arr = parseSplit(str)
				const obj = this.genObj({
					name: 'Бокс',
					typeObj: 'box',
					cls: ['bardcode_container-barcode'],
					clsPreview: 'bardcode_container-barcode-preview',
				})

				obj.x = (parseInt(arr[0], 10) * Memory.mm) / Memory.dpi
				obj.y = (parseInt(arr[1], 10) * Memory.mm) / Memory.dpi
				obj.w = parseInt(arr[2], 10) / Memory.dpi
				obj.h = parseInt(arr[3], 10) / Memory.dpi

				obj.pxFakeX = obj.x
				obj.pxFakeY = obj.y
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
				while (i < count) {
					if (/^Q/.test(arr[i])) {
						let s = arr[i].replace(/^Q/, '').split(',')
						s[0] && Memory.heigthLabelChange(parseInt(s[0], 10))
						s[1] && Memory.gapLabelChange(parseInt(s[1], 10))
					} else if (/^H/.test(arr[i])) {
						Memory.heigthLabelChange(parseInt(arr[i].replace(/^H/, ''), 10))
					} else if (/^W/.test(arr[i])) {
						Memory.heigthLabelChange(parseInt(arr[i].replace(/^W/, ''), 10))
					} else if (/^R/.test(arr[i])) {
						Memory.labelRefX(parseInt(arr[i].replace(/^R/, ''), 10))
					} else if (/^L/.test(arr[i])) {
						this.parseContent(arr[i].replace(/^L/, ''))
					}
					i++
				} //*/
			},
			genObj() {
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
				}
			},
			parseContent(str) {
				const lines = str
					.trim()
					.split(/\n/)
					.map(v => String(v).trim())
				const count = lines.length
				let i = 0
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
					}
					lines[i] != 'E' && Object.addObj(obj)
					i++
				} //*/
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

		const [fakeBodyDM, setFakeBodyDM] = useState(
			'0104603721020607215>(egukLfdK5r93zoJf'
		)

		return (
			<div
				className='import_container bar_label'
				style={{ background: Theme.background }}
			>
				<p className='import_container_title'>Импорт шаблона</p>
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
