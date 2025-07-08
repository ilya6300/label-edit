import { Editor } from './components/Editor'
import { Messages } from './features/messages/Messeges'
// import { d } from "../src/data.ini";
import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'
import Theme from './store/Theme'

const App = observer(() => {
	useLayoutEffect(() => {
		Theme.getBlackTheme()
		// console.log("d", d);
	}, [])

	return (
		<>
			<div
				style={{ background: Theme.background }}
				className='App'
				style={{
					width: '100vw',
					padding: '0 1rem',
				}}
			>
				<Editor />
			</div>
			<Messages />
		</>
	)
})

export default App
