import { Icon } from './Icon'
interface ChevronProps {
	className?: string
}
export function Chevron(props: ChevronProps) {
	//return <Icon {...props}>{'\2193'}</Icon>
	return <Icon {...props}>{'&#8595'}</Icon>
}
