import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { BtnControl } from '../features/control/BtnControl'
import service from '../request/service'
import Memory from '../store/Memory'
import Object from '../store/Object'
import Templates from '../store/Templates'
import Theme from '../store/Theme'
import { AddContainer } from './AddContainer'
import { BarLabel } from './BarLabel'
import { StartAddFonts } from './fonts/StartAddFonts'
import { ImportCompanent } from './import/ImportCompanent'
import { ImportContainerDMList } from './import/ImportContainerDMList'
import { Label } from './Label'
import { Loader } from './Loader'
import { BrowserNotSupported } from './messages/BrowserNotSupported'
import { ContainerPostDownloader } from './messages/ContainerPostDownloader'
import { ExchangeWithServer } from './messages/ExchangeWithServer'
import { MessagesContainer } from './messages/MessagesContainer'
import { ServerError } from './ServerError'
import { Setting } from './Setting/Setting'
import { GetTemplate } from './templates/GetTemplate'

export const Editor = observer(() => {
	const [browserNotSupportedFlag, setBrowserNotSupportedFlag] = useState(false)

	useEffect(() => {
		service.getFonts()
	}, [])

	useEffect(() => {
		setNoFonts(false)
	}, [!service.fontsLoading])

	// Класс мм сетки
	const [clsMM, setClsMM] = useState('none')
	const [setting, setSetting] = useState(false)
	const [noFonts, setNoFonts] = useState(false)
	const [importC, setImportC] = useState(false)
	const [visibleTemplates, setVisibleTemplates] = useState(false)
	const [flagPreview, setFlagPrevier] = useState(false)
	const [flagPrinter, setFlagPrinter] = useState(false)
	const [flagApp, setFlagApp] = useState(true)
	const [selectedDM, setSelectedDM] = useState(false)
	if (!browserNotSupportedFlag) {
		return (
			<div className='editor_container'>
				<MessagesContainer />
				{Memory.exchange ? <ExchangeWithServer /> : <></>}
				<BtnControl />
				{!service.fontsLoading && !service.errorNetwork ? (
					<>
						{!noFonts ? (
							<>
								<BarLabel
									setVisibleTemplates={setVisibleTemplates}
									visibleTemplates={visibleTemplates}
									setFlagPrevier={setFlagPrevier}
									flagPreview={flagPreview}
									// clsMM={clsMM}
									// setClsMM={setClsMM}
									setImportC={setImportC}
									setSetting={setSetting}
									setting={setting}
									setFlagPrinter={setFlagPrinter}
									flagApp={flagApp}
									setFlagApp={setFlagApp}
								/>
								{visibleTemplates ? (
									<GetTemplate setVisibleTemplates={setVisibleTemplates} />
								) : (
									<div
										style={{ color: Theme.color }}
										className='editor_list_viewer'
									>
										{importC ? (
											<ImportCompanent
												selectedDM={selectedDM}
												setSelectedDM={setSelectedDM}
												setImportC={setImportC}
											/>
										) : (
											<></>
										)}
										{selectedDM ? (
											<ImportContainerDMList setSelectedDM={setSelectedDM} />
										) : (
											<></>
										)}
										{!service.fontsLoading ? <AddContainer /> : <></>}
										{Memory.post_download_flag ? (
											<ContainerPostDownloader />
										) : (
											<></>
										)}
										<Label
											flagPreview={flagPreview}
											setFlagPrevier={setFlagPrevier}
											clsMM={clsMM}
											setClsMM={setClsMM}
										/>
										{setting ? (
											<Setting
												flagPrinter={flagPrinter}
												setFlagPrinter={setFlagPrinter}
												flagApp={flagApp}
												setFlagApp={setFlagApp}
											/>
										) : (
											<></>
										)}
									</div>
								)}
								{
									<button
										style={{ width: '50px' }}
										onClick={() =>
											console.log(
												'objects',
												toJS(Object.objects),
												'obj',
												toJS(Object.obj),
												'downloaded_template',
												toJS(Templates.downloaded_template),
												'Object.download_objects',
												toJS(Object.download_objects),
												'this.preview_templates',
												toJS(Templates.preview_templates),
												'Object.objects_preview',
												toJS(Object.objects_preview)
											)
										}
									>
										Check model
									</button>
								}
							</>
						) : (
							<StartAddFonts />
						)}
					</>
				) : !service.fontsLoading && service.errorNetwork ? (
					<ServerError />
				) : (
					<Loader />
				)}
			</div>
		)
	}
	if (browserNotSupportedFlag) {
		return <BrowserNotSupported />
	}
})
