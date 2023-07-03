import { Typography } from '@mui/material';
import { Modal } from 'antd'
import moment from 'moment';
import { PaymentDetailsType } from '../lib/types/trip';


interface PaymentDetailModalProps {
  open: boolean;
  onClose: () => void;
  paymentData:PaymentDetailsType
}
/**
 * @author Prasanth.M
 * @props refer interface PaymentDetailModalProps
 * @returns Jsx.Element PaymentDetailModal
 */
const PaymentDetailModal = (props: PaymentDetailModalProps) => {
  const { onClose, open , paymentData } = props

  const { payment_type , amount , creation , date , payment_mode , bank , ifsc_code , add_charge , reduce_charge , ref_no , remarks } = paymentData
  const data = [
    {
      label: "TYPE",
      value: payment_type
    },
    {
      label: "AMOUNT",
      value: amount
    },
    {
      label: "REQUEST DATE",
      value: creation ? moment(creation).format('DD-MMM-YY') : null
    },
    {
      label: "PAYMENT DATE",
      value: date ? moment(creation).format('DD-MMM-YY') : null
    },
    {
      label: "MODE",
      value: payment_mode 
    },
    {
      label: "ACCOUNT NO",
      value: bank
    },
    {
      label: "IFSC",
      value: ifsc_code
    },
    {
      label: "ADD CHARGES",
      value: add_charge
    },
    {
      label: "REDUCE CHARGES",
      value: reduce_charge
    },
    {
      label: "REF NO",
      value: ref_no
    },
    {
      label: "REMARKS",
      value: remarks
    }
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Payment Details"
    >
      <div className='mt-6'>
      {
        data.map(data => 
        <div className='flex flex-col bg-slate-100 rounded-md p-2 pl-2 mb-2'>
          <Typography variant='caption' fontWeight={600} color={"GrayText"}>{data.label}</Typography>
          <Typography variant='caption' fontWeight={500}>{ data.value || '-' }</Typography>
        </div>)
      }
      </div>
    </Modal>
  )
}

export default PaymentDetailModal