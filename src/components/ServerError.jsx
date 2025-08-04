import { useEffect, useState } from 'react'
import config from '../config.json'
import serverErrorImg from '../img/servererror.png'
import Memory from '../store/Memory'
import Theme from '../store/Theme'
import { BtnVer1 } from '../UI/btn/BtnVer1'

export const ServerError = () => {
	useEffect(() => {
		Memory.exchangeFlag(false)
	}, [])

	const [apiHost, setApiHost] = useState(
		localStorage.getItem('api.host') || config.url_api
	)
	const setApi = host => {
		localStorage.setItem('api.host', host)
		window.location.reload()
	}
	return (
		<div className='error_container'>
			<p className='error_text' style={{ color: Theme.color }}>
				Сервер этикеток недоступен попробуйте позже
			</p>
			<>
				Настройки api{' '}
				<input
					className='printer_setting_row_inpt'
					value={apiHost}
					onChange={e => setApiHost(e.target.value)}
				/>
				<BtnVer1 onClick={() => setApi(apiHost)}>Обновить</BtnVer1>
			</>
			<img
				className='img_error'
				src={serverErrorImg}
				alt=''
				srcset=''
				style={{ filter: Theme.black_theme ? 'invert(1)' : 'none' }}
			/>
		</div>
	)
}
