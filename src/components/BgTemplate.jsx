import { observer } from 'mobx-react-lite'

import { storeBg } from '../store/BG'

export const BgTemplate = observer(() => {
	if (!storeBg.image) {
		return null
	}
	return (
		<div className='barcode_bg_container'>
			<img src={storeBg.image} />
		</div>
	)
})
