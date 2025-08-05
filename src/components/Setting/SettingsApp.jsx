import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import config from '../../config.json'
import Theme from '../../store/Theme'
import { LabelPrintSettingRow } from '../../UI/label/LabelPrintSettingRow'
import { ItemRowSettingApp } from './ItemRowSettingApp'

export const SettingsApp = observer(() => {
	const setThemeFunc = async () => {}
	const [apiHostFlag, setApiHostFlag] = useState(false)
	const [apiPortFlag, setApiPortFlag] = useState(false)
	const [apiHost, setApiHost] = useState(
		localStorage.getItem('api.host') || config.url_api
	)
	const [apiSplit, setApiSplit] = useState(
		apiHost.replace('http://', '').replace('/api/v1/', '').split(':')
	)
	const handleApiHost = (i, val) => {
		if (i === 0) {
			setApiSplit([val, apiSplit[1]])
		} else if (i === 1) {
			setApiSplit([apiSplit[0], val])
		}
	}

	useEffect(() => {
		setApiSplit(
			apiHost.replace('http://', '').replace('/api/v1/', '').split(':')
		)
	}, [apiHost])

	const setApi = () => {
		const newApiHost = `http://${apiSplit.join(':')}/api/v1/`
		setApiHost(newApiHost)
		setApiHostFlag(false)
		setApiPortFlag(false)
		localStorage.setItem('api.host', newApiHost)
		window.location.reload()
	}
	return (
		<ul className='printer_setting_column' style={{}}>
			<ItemRowSettingApp
				name='Тёмная тема'
				active={Theme.black_theme}
				onClick={Theme.setTheme}
			/>
			<LabelPrintSettingRow
				type='text'
				name='api-адрес:'
				flag={apiHostFlag}
				onClickFlag={() => setApiHostFlag(!apiHostFlag ? true : false)}
				value={apiSplit[0]}
				option={apiSplit[0]}
				onChange={e => handleApiHost(0, e.target.value)}
				onClick={() => setApi()}
			/>
			<LabelPrintSettingRow
				type='text'
				name='api-порт:'
				flag={apiPortFlag}
				onClickFlag={() => setApiPortFlag(!apiPortFlag ? true : false)}
				value={apiSplit[1]}
				option={apiSplit[1]}
				onChange={e => handleApiHost(1, e.target.value)}
				onClick={() => setApi()}
			/>
		</ul>
	)
})
