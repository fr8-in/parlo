import { Button } from '@mui/material'
import { message } from 'antd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFrappeUpdateDoc } from 'frappe-react-sdk';
import moment from 'moment';
import { useEffect } from 'react'
import SelectDate from '../../../common/select/selectDate';
import constants from '../../../lib/constants';
import { useShowHide } from '../../../lib/hooks';
import util from '../../../lib/utils';

interface Props {
    tripData: any
    mutate: any
}

const TripDelivered = (props: Props) => {

    const { tripData, mutate } = props;

    const initial_show = {
        showDate: false
    }
    const { visible, onHide, onShow } = useShowHide(initial_show)

    const { updateDoc, error, isCompleted, loading } = useFrappeUpdateDoc()

    const disabled = tripData?.is_lr_updated !== 0
    const status = tripData?.workflow_state

    useEffect(() => {
        if (error != null) {
            message.error("Error while updating")
        }

    }, [isCompleted])


    const handleUpdate = async (event: any) => {
        try {
            await updateDoc('Trip', tripData.name, { delivered_at: util.now });
            message.success('Delivered updated successfully')
            mutate()
        } catch (e) {
            message.error("error while updating")
        }
    };

    const handleRemove = async () => {
        try {
            await updateDoc('Trip', tripData.name, { delivered_at: null });
            message.success('Delivered removed successfully')
            mutate()
        } catch (e) {
            message.error("error while updating")
        }
    }

    const dateTime = moment().format(constants.YYYYMMDDHHmm)

    return (
        <div>
            {status == "Confirmed" ?
                <Button variant="contained"
                    color="secondary"
                    id='date'
                    type="submit"
                    disabled={disabled}
                    sx={{borderRadius: 40}}
                    startIcon={<CheckCircleIcon/>}
                    onClick={() => onShow("showDate")}
                >
                    Delivered
                </Button>
                : status == 'POD Pending' ? 
                <Button 
                variant="outlined"
                    color="error"
                    id='remove'
                    type="submit"
                    sx={{borderRadius: 40}}                    startIcon={<CancelIcon/>}
                    onClick={() => handleRemove()}
                >
                    Delivered 
                </Button>
                    : null}

            {visible.showDate ?
                <SelectDate open={visible.showDate} onClose={onHide} onOpen={() => onShow("showDate")} callBack={handleUpdate} dateTime={dateTime} /> : null}
        </div>
    )
}

export default TripDelivered