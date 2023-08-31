import { Divider, Paper, Checkbox, Stack, Button, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { Trip } from '../../../lib/types/trip'
import { SourceDestination } from '../../../common/sourceDestination'
import { message, Modal, Space } from 'antd'
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { TitleAndLabel } from '../../../common/titleAndLabel'
import { UploadFile } from '@mui/icons-material'
import { useShowHide, useWindowSize } from '../../../lib/hooks'
import EditTripIndent from './editTripIndent'
import constants from '../../../lib/constants'
import util from '../../../lib/utils'
import { blueGrey } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

interface Props {
    tripData: Trip
    selected?: any
    onSelect?: any,
    isDetail?: boolean

}

const TripCard = (props: Props) => {

    const { tripData, selected, onSelect, isDetail = false } = props;

    const checked = selected?.trip_name?.includes(tripData?.name);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const common = { maxWidth: 1200, margin: '0 auto' }
    const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }
    const initial = {
        showEditLrEway: false
    };
    const { visible, onHide, onShow } = useShowHide(initial);

    const { height } = useWindowSize()

    const onPressCall = (mobile: any) => {
        util.callNow(mobile)
        if (mobile) {
            message.error("Mobile number does not exist")
        }
    }
    const navigate = useNavigate()

    const handleTripDetail = () => {
        const tripName = tripData.name
        console.log(tripName)
        navigate(`/trip/${tripName}`)
    }
    return (
        <div >
            <Paper sx={{ p: 1 }} >
                <div className='flex justify-between items-center my-1 px-2 text-md font-normal' >
                    {!isDetail ?

                        <div className='text-xs'>
                            <Button onClick={handleTripDetail}>{tripData?.id} | {tripData?.workflow_state}</Button>
                        </div>

                        :
                        <div className=''>
                            {tripData?.id} | {tripData?.workflow_state}
                        </div>
                    }
                    <p className=''>
                        {tripData?.confirmed_at ? util.formatDate(tripData?.confirmed_at, constants.DDMMMYYHHmm) : '-'}
                    </p>
                </div>
                <Divider sx={{ mb: 1 }} />
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>

                    <Space>
                        {tripData?.workflow_state === 'Confirmed' && !isDetail ?
                            <><Checkbox
                                checked={checked}
                                onChange={() => onSelect(tripData?.name, !checked)}
                                size="small"
                                sx={{ '&.Mui-disabled': { backgroundColor: blueGrey[50] } }}
                                color="secondary" /></>
                            : null}
                        <SourceDestination className='p-2' source_name={tripData?.source} destination_name={tripData?.destination} />
                    </Space>

                    <p className='bg-slate-200 p-2 rounded-md'>&#8377; {tripData?.customer_price == null ? 0 : tripData?.customer_price}  </p>
                </Stack>
                <Divider sx={{ mt: 1 }} />

                <div className='flex px-2'>

                    <TitleAndLabel title={'Cases'} label={tripData?.cases} index={1}
                        className="border-r" />
                    <TitleAndLabel title={'Weight'} label={tripData?.weight} index={1} className="border-r " />

                    {tripData?.workflow_state === "Confirmed" ?
                        <Button
                            endIcon={<UploadFile />}
                            size="small"
                            fullWidth

                            onClick={() => onShow("showEditLrEway")}>
                            LR/E-way</Button>
                        : null}
                    {tripData?.workflow_state === "POD Pending" ?
                        <Button
                            endIcon={<UploadFile />}
                            size="small"
                            fullWidth
                            onClick={() => onShow("showEditLrEway")}>
                            POD</Button>
                        : null}

                </div>
                <Divider sx={{ mb: 1 }} />

                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} className="ml-2">
                    <div >
                        <p className='text-md font-normal' >{tripData?.truck}</p>
                        <p className='text-xs'>{tripData?.load_type}</p>
                    </div>


                    <div className='flex'>
                        <IconButton size='small' className='bg-slate-200   rounded-md ' onClick={() => onPressCall(tripData?.driver)} color="secondary" >
                            <LocalPhoneIcon />
                        </IconButton>

                    </div>
                </Stack>

            </Paper>
            {
                visible.showEditLrEway ? (
                    <Modal
                        open={visible.showEditLrEway}
                        title={"Indent"}
                        footer={null}
                        onCancel={onHide}
                        style={mobile}
                        width={isMobile ? '100%' : "50%"}
                        className="mobile_overlay"
                    >
                        <div className=''>
                            <EditTripIndent tripName={tripData?.name} tripWorkflow={tripData?.workflow_state} />
                        </div>
                    </Modal>

                ) : null
            }
        </div>
    )
}

export default TripCard