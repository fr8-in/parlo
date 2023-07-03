import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd'
import { FuelRequestType } from '../../../lib/types/trip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Stack from '@mui/material/Stack';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Loading } from '../../../common/loading';

interface ConfrimFuelRequestToFilledModalProps {
  open: boolean;
  onClose: () => void;
  dataSource: Array<FuelRequestType>;
  mutate: Function;
  handleReset:Function
}
/**
 * @author Prasanth.M
 * @returns Jsx.Element ConfrimFuelRequestToFilledModal
 */
const ConfrimFuelRequestToFilledModal = (props: ConfrimFuelRequestToFilledModalProps) => {
  const { open, onClose, dataSource , mutate , handleReset} = props

  const fuelRequestNames: Array<{ name: string }> = dataSource.map(data => { return { name: data.name } })
  const { call, loading } = useFrappePostCall('parlo.trip.api.payments.fill_fuel_request.fill_fuel_request');

  //Click Handlers
  const onClickConfirm: any = async () => {
    await call({
      fill_fuel_request_input: {
        fuel_requests: fuelRequestNames
      }
    }).then(
      (request: any) => {
        message.success("Request Successfully Processed!")
        mutate()
        handleReset()
        onClose()
      }
    )
  }
  return (
    <Modal
      open={open}
      onCancel={loading ? undefined : onClose}
      onOk={onClickConfirm}
      okText={"Confirm"}
      okButtonProps={{
        disabled: loading
      }}
      title={
        <span className='flex flex-row items-center gap-2'>
          <ErrorOutlineIcon color='warning' />
          Confirm Request
        </span>
      }
      okType='default'
      centered
      width={500}
    >
      {
        loading ? <Loading /> :
          <Stack maxHeight={200} padding={3}>
            Are you to confirm the selecetd Fuel Request to Filled ?
          </Stack>
      }
    </Modal>
  )
}

export default ConfrimFuelRequestToFilledModal