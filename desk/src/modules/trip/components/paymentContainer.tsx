import React, { ChangeEvent, useState } from 'react'
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk'
import { PaymentType, SorterType } from '../../../lib/types/trip';
import PaymentTable from './paymentTable';

interface SearchType { 
    customer: string, 
    supplier: string,
    payment_mode: Array<string>,
    payment_type: Array<string>
}
interface Props {
    type: "trip" | "indent"
}
const PaymentContainer = (props:Props) => {
    const {type} = props
    const initialSearch: SearchType = { customer: '', supplier: '', payment_mode: [], payment_type:[] }
    const [search, setSearch] = useState(initialSearch)
    const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
        setSearch({ ...search, [key]: e.target.value })
    }
    const customerFilter: Filter[] = search.customer?.length >= 3 ? [['customer', 'like', `%${search.customer}%`]] : []
    const supplierFilter: Filter[] = search.supplier?.length >= 3 ? [['supplier', 'like', `%${search.supplier}%`]] : []
    const modeFilter: Filter[] = search.payment_mode?.length > 0 ? [['payment_mode', 'in', search.payment_mode]] : []
    const paymentTypeFilter: Filter[] = search.payment_type?.length > 0 ? [['payment_type', 'in', search.payment_type]] : []

    const sorterInitial: SorterType = { field: "name", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
        setSorter({ ...sorter, field, order })
    }

    const typeFilter: Filter[] = type === 'indent' ? [["customer", "!=", ""]] : [["supplier", "!=", ""]]

    const { data, mutate } = useFrappeGetDocList<PaymentType>(
        'Payment', {
        fields: ['*'],
            filters: [["status", "=", "Processed"], ...typeFilter, ...customerFilter, ...supplierFilter, ...modeFilter, ...paymentTypeFilter],
        orderBy: sorter.order ? sorter : sorterInitial
    })

    const handleFilter = (data: any, key:string) => {
        setSearch({ ...search, [key]: data })
    }

    return (
        <>
            <PaymentTable
                dataSource={data}
                sorter={sorter}
                search={search}
                handleSorter={handleSorter}
                handleSearch={handleSearch}
                handleFilter={handleFilter}
                mutate={mutate}
                type={type}
            />
        </>
    )
}

export default PaymentContainer
