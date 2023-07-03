import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import EditTripIndent from '../components/editTripIndent'
import TripItemContainer from '../components/tripItemContainer'

interface Props {
    tripName: any
    tripWorkflow: string
    indentUpdate: any
}
const TripDetailIndent = (props: Props) => {

    const { tripName, tripWorkflow,indentUpdate } = props
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    return (
        <div>
            {isMobile ?
                <EditTripIndent tripName={tripName} indentUpdate={indentUpdate}/>
                : <TripItemContainer name={tripName} tripWorkflow={tripWorkflow} indentUpdate={indentUpdate}/>}
        </div>
    )
}

export default TripDetailIndent