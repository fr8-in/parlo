import TripTable from './tripTable';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { Trip } from '../../../lib/types/trip';

interface Props {
    items:Array<string>
}
const InvoiceTripTable = (props: Props) => {
    const { items } = props;
    const { data, isLoading, mutate } = useFrappeGetDocList<Trip>(
        'Supplier Invoice Trip',
        {
            fields: [
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
            filters: [['supplier_invoice', 'in', items]]
        }
    )
    
    return (
        <>
            <TripTable hide_filters={true} dataSource={data} />
        </>
    )
}

export default InvoiceTripTable
