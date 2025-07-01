import { makeAutoObservable } from 'mobx'

class BG {
	constructor() {
		makeAutoObservable(this)
	}
	image = null
	setImage(img) {
		this.image = img
	}
	clear() {
		this.image = null
	}
}

export const storeBg = new BG()
