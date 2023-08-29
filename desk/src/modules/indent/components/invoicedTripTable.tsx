import { useFrappeGetDocList } from 'frappe-react-sdk';
import { Trip } from '../../../lib/types/trip';
import React from 'react';
import IndentTable from './indentTable';


interface Props {
    items:Array<string>
}

const InvoiceTripTable = (props: Props) => {
    const { items } = props;
    
    const { data, isLoading, mutate } = useFrappeGetDocList<Trip>(
        'Customer Invoice Indent',
        {
            fields: [
                "indent.cases",
                "indent.confirmed_at",
                "indent.creation",
                "indent.destination",
                "indent.id",
                "indent.idx",
                "indent.modified",
                "indent.modified_by",
                "indent.name",
                "indent.owner",
                "indent.series",
                "indent.source",
                "indent.customer",
                "indent.customer_price",
                "indent.weight",
                "indent.workflow_state",
                "indent.add_charge",
                "indent.reduce_charge",
                "indent.received",
                "indent.rate_type",
                "indent.balance",
            ],
            filters: [['customer_invoice', 'in', items]]
        }
    )
    
    return (
        <IndentTable data={data} tabKey='Invoice' loading={isLoading} mutate={mutate} />    
    )
}

export default InvoiceTripTable
