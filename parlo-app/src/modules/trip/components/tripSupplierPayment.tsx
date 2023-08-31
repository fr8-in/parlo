import { useFrappeGetDocList } from 'frappe-react-sdk'
import PaymentAccordian from '../../../common/paymentAccordian'
import get from 'lodash/get';
import { SupplierPaymentDetailsType } from '../../../lib/types/trip';
import isEmpty from 'lodash/isEmpty';

interface TripSupplierPaymentDetailsProps {
  tripName: string
  tripData:any
}
/**
 * @author Prasanth.M
 * @props refer interface TripSupplierPaymentDetailsProps
 * @returns Jsx.Element TripSupplierPaymentDetails
 */
const TripSupplierPaymentDetails = (props: TripSupplierPaymentDetailsProps) => {
  const { tripName , tripData } = props


  const { data: payment_data } = useFrappeGetDocList<SupplierPaymentDetailsType>(
    'Trip Payment', {
    fields: [
      "amount",
      "creation",
      "date",
      "name",
      "payment_mode",
      "payment_type",
      "remarks",
      "status",
      "supplier_bank.ifsc_code",
      "supplier_bank",
      "trip.add_charge",
      "trip.reduce_charge",
      "payment.ref_no",
      "trip.paid",
      "trip.balance",
      "trip.supplier_price"
    ],
    filters: [["trip", "=", tripName]]

  })

  const payment = get(tripData,'paid',null)
  const balance = get(tripData,'balance',null)
  const supplier_price = get(tripData,'supplier_price',null)
  const add_charge = get(tripData,'add_charge',null)
  const reduce_charge = get(tripData,'reduce_charge',null)
  const payable = (supplier_price + add_charge + reduce_charge)

  const modifiedArray = !isEmpty(payment_data) ? payment_data.map((obj:SupplierPaymentDetailsType) => {
    const { supplier_bank , supplier_price , ...rest } = obj;
    return { ...rest, bank: supplier_bank , price : supplier_price };
  }) : []
  
  return (
    <PaymentAccordian data={modifiedArray} payable={payable} payment={payment} balance={balance} title="Supplier Payment" />
  )
}

export default TripSupplierPaymentDetails