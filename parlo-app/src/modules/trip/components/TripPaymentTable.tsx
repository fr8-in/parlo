import TripTable from './tripTable';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { Trip } from '../../../lib/types/trip';

interface Props {
    items:Array<string>
}
const TripPaymentTable = (props: Props) => {
    const { items } = props;
    const { data, isLoading, mutate } = useFrappeGetDocList<Trip>(
        'Trip Payment',
        {
            fields: [
                "amount",
                "trip.cases",
                "trip.confirmed_at",
                "trip.creation",
                "trip.destination",
                "trip.driver",
                "trip.id",
                "trip.idx",
                "trip.modified",
                "trip.modified_by",
                "trip.name",
                "trip.owner",
                "trip.series",
                "trip.source",
                "trip.supplier",
                "trip.truck",
                "trip.supplier_price",
                "trip.weight",
                "trip.workflow_state",
                "trip.add_charge",
                "trip.reduce_charge",
                "trip.paid",
                "trip.balance",
            ],
            filters: [['payment', 'in', items]]
        }
    )
    
    return (
        <>
            <TripTable hide_filters dataSource={data} is_payment_tab />
        </>
    )
}

export default TripPaymentTable
