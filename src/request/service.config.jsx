import axios from 'axios'
import config from '../config.json'
import Memory from '../store/Memory'

export const request = axios.create({
	baseURL: localStorage.getItem('api.host') || config.url_api,
})
request.interceptors.request.use(config => {
	Memory.exchangeFlag(true)
	return config
})
request.interceptors.response.use(
	config => {
		Memory.exchangeFlag(false)
		return config
	},
	e => {
		Memory.exchangeFlag(false)
		throw e
	}
)
