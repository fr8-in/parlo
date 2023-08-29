import { Card } from '@mui/material';
import { useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { Router, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../common/backButton';
import { Trip } from '../../../lib/types/trip';
import TripCard from '../components/tripCard';
import StyledTabIndentPayment from '../components/styledTabIndentPayment';
import TripTimeLine from '../components/tripTimeLine';
import DeleteIcon from '@mui/icons-material/Delete';
import get from 'lodash/get';
import util from '../../../lib/utils';
import moment from 'moment';
import { message } from 'antd';
import constants from '../../../lib/constants';
const TripDetail = () => {
  
  let { tripName } = useParams();
  const navigate = useNavigate();
  const { data, mutate } = useFrappeGetDoc<Trip>(
    'Trip',
    tripName
  );

  const tripData: any = data

  const paid = get(tripData,'paid',null)
  const status = get(tripData,'status',null)

  const { updateDoc , loading } = useFrappeUpdateDoc()
  const onClickDeleteIcon: () => void = async () => {
    if (tripName) {
      await updateDoc('Trip', tripName, { deleted_at: util.epr_date_time(moment()) }).then(
        ( response: any ) => {
        message.success("Updated!")
        navigate('/')}
      ).catch(error => message.error(error?.message))
    }
  }

  const enableDeleteIcon = paid == 0 && status == constants.TRIP_STATUS.CONFIRMED && !loading

  return (

    <>

      <div className="max-w-3xl mx-auto relative" style={{ height: 'calc(100vh - 90px)' }}>
        <Card sx={{ mb: 1 }}>
          <div className='flex p-2 gap-2 flex-row items-center'>
            <div className='mt-1'>
              <BackButton />
            </div>
            <h5 className='mt-1'>Trip Detail</h5>
            <div className='ml-auto'>
            {enableDeleteIcon ?  <DeleteIcon color={"warning"} onClick={onClickDeleteIcon}/> : null }
            </div>
          </div>
        </Card>
        <TripCard tripData={tripData} isDetail={true} />

        <div className="bg-card my-3 ">
          <TripTimeLine tripData={tripData}  mutate={mutate}/>
        </div>

        <div className='bg-card'>
          <StyledTabIndentPayment tripData={tripData} tripName={tripName} mutate={mutate} tripWorkflow={tripData?.workflow_state}/>
        </div>
      </div>
    </>

  )
}

export default TripDetail