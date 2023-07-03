import { Stack, Button } from '@mui/material';
import { message, Modal } from 'antd'
import { useFrappePostCall } from 'frappe-react-sdk';
import moment from 'moment';
import BookPaymentForm from '../../../common/bookPaymentForm';
import { Loading } from '../../../common/loading';
import { BankRequestType } from '../../../lib/types/trip';
import util from '../../../lib/utils';
import BankRequestTable from './bankRequestTable';
import { PaymentType } from './initialForm';

interface ProcessBankRequestModaProps {
  open: boolean; // boolean to handle opening and closing of modal
  handleCancel: () => void; // function to handle close of modal
  dataSource: Array<BankRequestType>; // Selected Request from table.
  mutate:Function
  handleReset?:Function;
}
/**
 * @author Prasanth
 * @param props refer interface ProcessBankRequestModaProps
 * @returns JSX.Element
 */
const ProcessBankRequestModal = (props: ProcessBankRequestModaProps) => {
  const { open, handleCancel, dataSource , mutate , handleReset } = props

  const { call , loading } = useFrappePostCall('parlo.trip.api.payments.supplier_payment.supplier_payment');

  const trip_payments_names: string[] = dataSource.map(data => data.name)

  const { supplier , company_bank , supplier_bank} = dataSource[0]
  const handleSubmit: any = async (form: PaymentType) => {
      await call({ supplier_payment: {
        trip_payment_names: trip_payments_names,
        supplier: supplier,
        supplier_bank: supplier_bank,
        company_bank: form.company_bank,
        ref_no: form.ref_no,
        date: util.epr_date_time(moment()),
        remarks: form.remorks || "",
        payment_mode: form.mode
      } }).then(
        (result: any) => {
          message.success('Booked successfully')
          mutate()
          if(handleReset){
            handleReset()
          }
          handleCancel()
        }
      ).catch(error => {
        message.error(error?.message)
      })
  }
  return (
    <Modal
      title="Process Bank Advance"
      open={open}
      footer={
        <Button
          key="submit"
          variant='contained'
          color='secondary'
          form={'bankAdvanceProcessForm'}
          type='submit'
          disabled={false}
        >Submit</Button>
      }
      onCancel={handleCancel}
      centered
      width={1000}
    >
      <Stack maxHeight={500} minHeight={300} sx={{ overflow: 'auto', padding:1}}>
     { loading ? <Loading/> : <>  <BookPaymentForm id="bankAdvanceProcessForm" onSubmit={handleSubmit} company_bank={company_bank} supplier={supplier} disableMode hideSupplierBank/>
        <BankRequestTable mutate={mutate} dataSource={dataSource} hideActions hideFilters showTotalAmount />
        </>
      }
      </Stack>
    </Modal>
  )
}

export default ProcessBankRequestModal