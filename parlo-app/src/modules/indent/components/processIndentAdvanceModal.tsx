import { Stack, Button } from '@mui/material';
import { message, Modal } from 'antd'
import { useFrappePostCall } from 'frappe-react-sdk';
import moment from 'moment';
import BookPaymentForm from '../../../common/bookPaymentForm';
import { Loading } from '../../../common/loading';
import { IndentPaymentRequestType } from '../../../lib/types/trip';
import util from '../../../lib/utils';
import { PaymentType } from '../../trip/components/initialForm';
import IndentPaymentRequestTable from './indentPaymentRequestTable';

interface ProcessIndentAdvanceModalProps {
    open: boolean; // boolean to handle opening and closing of modal
    handleCancel: () => void; // function to handle close of modal
    dataSource: Array<IndentPaymentRequestType>; // Selected Request from table.
    mutate: Function
    handleReset?: Function;
}
/**
 * @author Prasanth
 * @param props refer interface ProcessIndentAdvanceModalProps
 * @returns JSX.Element
 */
const ProcessIndentAdvanceModal = (props: ProcessIndentAdvanceModalProps) => {
    const { open, handleCancel, dataSource, mutate, handleReset } = props
    
    const {call , loading} = useFrappePostCall('parlo.trip.api.payments.book_customer_request.book_customer_request');

    const indentname = dataSource.map((data:IndentPaymentRequestType)=> data.name)
    const handleSubmit: any = async (form: PaymentType) => {
      await  call({
            book_customer_request_input: {
                "customer" :dataSource[0].customer,
                "indent_payment_names": indentname,
                "payment_mode":form.mode,
                "remarks": form.remorks || "",
                "date": util.epr_date_time(moment()),
                "ref_no": form.ref_no,
                "company_bank": form.company_bank,
            }
        }).then((response:any)=>{
            message.success("Processed Successfully")
            mutate()
            if(handleReset){
                handleReset()
            }
            handleCancel()
        }).catch(err => message.error(err?.message))
    }
    return (
        <Modal
            title="Process Advance"
            open={open}
            onOk={handleSubmit}
            footer={
                <Button
                    key="submit"
                    variant='contained'
                    color='secondary'
                    form={'processIndentForm'}
                    type='submit'
                    disabled={false}
                >Submit</Button>
            }
            onCancel={handleCancel}
            centered
            width={1000}
        >
            <Stack maxHeight={500} minHeight={300} sx={{ overflow: 'auto', padding: 1 }}>
                {loading ? <Loading /> : <>
                    <BookPaymentForm id="processIndentForm" onSubmit={handleSubmit} hideSupplierBank company_bank={dataSource[0].company_bank} />
                    <IndentPaymentRequestTable dataSource={dataSource} mutate={mutate} hideActions hideFilters showTotalAmount showEditIcon={false}/>
                </>
                }
            </Stack>
        </Modal>
    )
}

export default ProcessIndentAdvanceModal