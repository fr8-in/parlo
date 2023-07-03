import { useFrappeGetDocList } from 'frappe-react-sdk'
import { useShowHideWithRecord } from '../../../lib/hooks'
import PaymentAccordian from '../../../common/paymentAccordian'
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

interface TripSupplierPaymentDetailsProps {
  indentName: any
  indentData:any
}
/**
 * @author Prasanth.M
 * @props refer interface TripSupplierPaymentDetailsProps
 * @returns Jsx.Element TripSupplierPaymentDetails
 */
const IndentCustomerPaymentDetails = (props: TripSupplierPaymentDetailsProps) => {
  const { indentName , indentData } = props

  const showHideInitial = {
    showDetailModal: false,
    detailModalData: {}
  }
  const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)

  const { data: indent_data } = useFrappeGetDocList<any>(
    'Indent Payment', {
    fields: [     
    "amount",
    "creation",
    "date",
    "name",
    "payment_mode",
    "payment_type",
    "remarks",
    "status",
    "company_bank.ifsc_code",
    "company_bank",
    "indent.add_charge",
    "indent.reduce_charge",
    "payment.ref_no",
    "indent.balance",],
    filters: [["indent", "=", indentName]]

  })

  const payment = get(indentData,'received',null)
  const balance = get(indentData,'balance',null)
  const customer_price = get(indentData,'customer_price',null)
  const add_charge = get(indentData,'add_charge',null)
  const reduce_charge = get(indentData,'reduce_charge',null)
  const payable = (customer_price + add_charge + reduce_charge)

  const modifiedArray = !isEmpty(indent_data) ? indent_data.map((obj:any) => {
    const { comapany_bank  , ...rest } = obj;
    return { ...rest, bank: comapany_bank , price : 0 };
  }) : []
  
  return (
    <PaymentAccordian data={modifiedArray} payable={payable} payment={payment} balance={balance} title="Customer Payment" />
  )
}

export default IndentCustomerPaymentDetails