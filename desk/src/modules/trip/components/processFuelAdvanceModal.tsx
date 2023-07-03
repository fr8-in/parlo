import { Stack, Button } from '@mui/material';
import { message, Modal } from 'antd'
import { useFrappePostCall } from 'frappe-react-sdk';
import moment from 'moment';
import BookPaymentForm from '../../../common/bookPaymentForm';
import { Loading } from '../../../common/loading';
import { FuelRequestType } from '../../../lib/types/trip';
import util from '../../../lib/utils';
import FuelRequestTable from './fuelRequestTable';
import { PaymentType } from './initialForm';

interface ProcessFuelAdvanceModaProps {
    open: boolean; // boolean to handle opening and closing of modal
    handleCancel: () => void; // function to handle close of modal
    dataSource: Array<FuelRequestType>; // Selected Request from table.
    mutate: Function;
    handleReset?:Function;
}
/**
 * @author Prasanth
 * @param props refer interface ProcessFuelAdvanceModaProps
 * @returns JSX.Element
 */
const ProcessFuelAdvanceModal = (props: ProcessFuelAdvanceModaProps) => {
    const { open, handleCancel, dataSource , mutate , handleReset } = props
   
    const { call , loading } = useFrappePostCall('parlo.trip.api.payments.fuel_payment.fuel_payment');

    const fuel_request_names:string[] = dataSource.map(data => data.name)

    const handleSubmit: any = async (form: PaymentType) => {
        if (fuel_request_names.length) {
            await call({
                fuel_payment_input : {
                    trip_fuel_names :fuel_request_names,
                    supplier :dataSource[0].fuel_station,
                    supplier_bank: form.supplier_bank,
                    company_bank: form.company_bank,
                    ref_no: form.ref_no,
                    date: util.epr_date_time(moment()),
                    remarks: form.remorks || "",
                    payment_mode: form.mode
                }
            }).then(
                (result: any) => {
                    message.success('Request Successfully Processed')
                    mutate()
                    if(handleReset){ handleReset() }
                    handleCancel()
                }
            ).catch(
                (error: any) => {
                    message.error(error?.message)
                }
            )
        }
    }
    return (
        <Modal
            title="Process Fuel Advance"
            open={open}
            onOk={handleSubmit}
            footer={
                <Button
                    key="submit"
                    variant='contained'
                    color='secondary'
                    form={'processFuelAdvanceForm'}
                    type='submit'
                    disabled={false}
                >Submit</Button>
            }
            onCancel={handleCancel}
            centered
            width={1000}
        >
          <Stack maxHeight={500} minHeight={300} sx={{ overflow: 'auto', padding: 1 }}>
          { loading ? <Loading /> :<>
           <BookPaymentForm id="processFuelAdvanceForm" onSubmit={handleSubmit} supplier={dataSource[0].supplier} />
                <FuelRequestTable mutate={mutate} dataSource={dataSource} hideActions hideFilters showTotalAmount />
                 </>}
            </Stack>
        </Modal>
    )
}

export default ProcessFuelAdvanceModal