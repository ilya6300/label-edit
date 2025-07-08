export class Base {
	nativeEvent = undefined
	id = undefined
	template_id = undefined
	type = undefined
	name = "text"
	text_align = 1
	human_readable = 0
	radius = null
	line_thickness = null
	enabled = true
	pos_x = 0
	pos_y = 0,
	width = null
	height = null
	rotation = 0
	code_type = null
	font_size = 12
	font_id = 1
	image_id = null
	data = null
	
	constructor(type) {
		this.type = type
	}
	get style() {
		return {}
	}
}
