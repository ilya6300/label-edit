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
		<ul className='printer_setting_column'>
			<ItemRowSettingApp
				name='Тёмная тема'
				active={Theme.black_theme}
				onClick={Theme.setTheme}
			/>
			<LabelPrintSettingRow
				type='text'
				name='Адрес БД:'
				flag={apiHostFlag}
				onClickFlag={() => setApiHostFlag(!apiHostFlag ? true : false)}
				value={apiSplit[0]}
				option={apiSplit[0]}
				onChange={e => handleApiHost(0, e.target.value)}
				onClick={() => setApi()}
			/>
			<LabelPrintSettingRow
				type='text'
				name='Порт сервиса печати:'
				flag={apiPortFlag}
				onClickFlag={() => setApiPortFlag(!apiPortFlag ? true : false)}
				value={apiSplit[1]}
				option={apiSplit[1]}
				onChange={e => handleApiHost(1, e.target.value)}
				onClick={() => setApi()}
			/>
			<LabelPrintSettingRow name='Версия:' option='01:08-08-2025' />
			<li className='setting_info_row'>
				Вы можете открыть редактор эткеток в браузере любого компьютера, в
				рамках одной локальной сети. Для этого в браузере пропишите ip-адрес
				компьютера и порт 13724 через двоеточие. (Пример: 192.168.1.10:13724)
			</li>
		</ul>
	)
})
