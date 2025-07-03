const hasOwn = {}.hasOwnProperty

function parseValue(arg) {
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

function appendClass(val, newClass) {
	if (!newClass) {
		return val
	}

	if (val) {
		return val + ' ' + newClass
	}

	return val + newClass
}

export function cls(...args) {
	return args.reduce((acc, arg) => appendClass(acc, parseValue(arg)), '')
}
