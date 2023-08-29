import IndentTable from './indentTable';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { Trip } from '../../../lib/types/trip';

interface Props {
    items:Array<string>
}
const IndentPaymentTable = (props: Props) => {
    const { items } = props;
    const { data, isLoading, mutate } = useFrappeGetDocList<Trip>(
        'Indent Payment',
        {
            fields: [
                "amount",
                "indent.cases",
                "indent.confirmed_at",
                "indent.creation",
                "indent.id",
                "indent.idx",
                "indent.modified",
                "indent.modified_by",
                "indent.name",
                "indent.owner",
                "indent.series",
                "indent.source",
                "indent.destination",
                "indent.customer",
                "indent.consignee",
                "indent.weight",
                "indent.workflow_state",
                "indent.way_bill_no",
                "indent.lr_no",
                "indent.trip",
                "indent.rate_type",
                "indent.customer_price",
                "indent.add_charge",
                "indent.reduce_charge",
                "indent.received",
                "indent.balance",
            ],
            filters: [['payment', 'in', items]]
        }
    )
    
    return (
        <>
            <IndentTable data={data} loading={isLoading} tabKey={"Payment"} mutate={mutate} />
        </>
    )
}

export default IndentPaymentTable
