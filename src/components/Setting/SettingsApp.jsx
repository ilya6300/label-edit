import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import config from '../../config.json'
import Theme from '../../store/Theme'
import { LabelPrintSettingRow } from '../../UI/label/LabelPrintSettingRow'
import { ItemRowSettingApp } from './ItemRowSettingApp'

export const SettingsApp = observer(() => {
	const setThemeFunc = async () => {}
	const [apiHostFlag, setApiHostFlag] = useState(false)
	const [apiHost, setApiHost] = useState(
		localStorage.getItem('api.host') || config.url_api
	)
	const setApi = host => {
		localStorage.setItem('api.host', host)
		setApiHostFlag(false)
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
				value={apiHost}
				option={apiHost}
				onChange={e => setApiHost(e.target.value)}
				onClick={() => setApi(apiHost)}
			/>
		</ul>
	)
})
