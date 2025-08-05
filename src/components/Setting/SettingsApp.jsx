import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import config from '../../config.json'
import Theme from '../../store/Theme'
import { BtnVer1 } from '../../UI/btn/BtnVer1'
import { ItemRowSettingApp } from './ItemRowSettingApp'

export const SettingsApp = observer(() => {
	const setThemeFunc = async () => {}
	const [apiHostFlag, setApiHostFlag] = useState(false)
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

	const setApi = host => {
		const newApiHost = `http://${apiSplit.join(':')}/api/v1/`
		setApiHost(newApiHost)
		localStorage.setItem('api.host', newApiHost)
		window.location.reload()
		setApiHostFlag(false)
	}
	return (
		<ul className='printer_setting_column' style={{}}>
			<ItemRowSettingApp
				name='Тёмная тема'
				active={Theme.black_theme}
				onClick={Theme.setTheme}
			/>
			<li className='printer_setting_row'>
				<span>api-адрес:</span>
				{!apiHostFlag ? (
					<span
						className='printer_setting_row_value'
						onClick={() => setApiHostFlag(true)}
					>
						{apiHost}
					</span>
				) : (
					<label>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '2px',
							}}
						>
							<input
								type='text'
								className='printer_setting_row_inpt'
								placeholder={apiHost}
								value={apiSplit[0]}
								style={{
									width: 'auto',
									marginRight: 0,
								}}
								onChange={e => handleApiHost(0, e.target.value)}
							/>
							<span>:</span>
							<input
								type='text'
								className='printer_setting_row_inpt'
								placeholder={apiHost}
								value={apiSplit[1]}
								style={{
									width: 50,
									marginRight: 0,
								}}
								onChange={e => handleApiHost(1, e.target.value)}
							/>
							<BtnVer1 onClick={() => setApi(apiHost)}>Ок</BtnVer1>
						</div>
					</label>
				)}
			</li>
		</ul>
	)
})
