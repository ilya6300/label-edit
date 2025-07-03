import { BtnVer1 } from '../btn/BtnVer1'

export const LabelPrintSettingRow = props => {
	return (
		<li className='printer_setting_row'>
			{props.name}
			{!props.flag ? (
				<span className='printer_setting_row_value' onClick={props.onClickFlag}>
					{props.option}
				</span>
			) : (
				<label>
					<input
						type={props.type}
						className='printer_setting_row_inpt'
						placeholder={props.option}
						value={props.value}
						onChange={props.onChange}
					/>
					<BtnVer1 onClick={props.onClick}>Ок</BtnVer1>
				</label>
			)}
		</li>
	)
}
