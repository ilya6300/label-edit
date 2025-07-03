import { makeAutoObservable } from 'mobx'

class Message {
	constructor() {
		makeAutoObservable(this)
	}
	// Сообщения
	messageVisible = true

	id_message = 0

	messages = []

	// message
	writeMessages = message => {
		const dublicate = this.messages.find(
			m =>
				m.message ===
				message
					.replace(/[{}"']/gm, '')
					.replace(/[:]/gm, ': ')
					.replace(/,/gm, ', ')
		)
		if (!dublicate) {
			this.messages = [
				...this.messages,
				{
					type: '',
					id_message: ++this.id_message,
					message: message
						.replace(/[{}"']/gm, '')
						.replace(/[:]/gm, ': ')
						.replace(/,/gm, ', '),
				},
			]
		}
	}

	deleteMessage = id => {
		this.messages = this.messages.filter(m => m.id_message !== id.id_message)
	}

	sendMessage = (message, type = '') => {
		const dublicate = this.messages.find(
			m =>
				m.message ===
				message
					.replace(/[{}"']/gm, '')
					.replace(/[:]/gm, ': ')
					.replace(/,/gm, ', ')
		)
		if (!dublicate) {
			this.messages = [
				...this.messages,
				{
					type,
					id_message: ++this.id_message,
					message: message
						.replace(/[{}"']/gm, '')
						.replace(/[:]/gm, ': ')
						.replace(/,/gm, ', '),
				},
			]
		}
	}
	error = message => {
		this.sendMessage(message, 'error')
	}
	success = message => {
		this.sendMessage(message, 'success')
	}
	danger = message => {
		this.sendMessage(message, 'danger')
	}
}

export const storeMessage = new Message()
