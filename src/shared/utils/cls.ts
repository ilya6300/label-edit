const hasOwn = {}.hasOwnProperty

function parseValue(arg: any): string | number {
	if (typeof arg === 'string' || typeof arg === 'number') {
		return arg
	}
	if (typeof arg !== 'object') {
		return ''
	}
	if (Array.isArray(arg)) {
		return cls.apply(null, arg)
	}
	if (
		arg.toString !== Object.prototype.toString &&
		!arg.toString.toString().includes('[native code]')
	) {
		return arg.toString()
	}
	let classes = ''
	for (let key in arg) {
		if (hasOwn.call(arg, key) && arg[key]) {
			classes = appendClass(classes, key)
		}
	}
	return classes
}

function appendClass(val: string, newClass: string | number): string {
	if (!newClass) {
		return val
	}

	if (val) {
		return val + ' ' + newClass
	}

	return val + newClass
}

export function cls(...args: any[]): string {
	return args.reduce((acc, arg) => appendClass(acc, parseValue(arg)), '')
}
