import React, { ChangeEvent, useState } from 'react'
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk'
import { useShowHide } from '../../../lib/hooks';
import { RowType, SorterType } from '../../../lib/types/trip';
import isEmpty from 'lodash/isEmpty';
import InvoiceTable from './invoiceTable';
import InvoiceFabMenu from '../../trip/components/invoiceFabMenu';
import BookBalance from './bookBalance';
// import InvoiceFabMenu from './invoiceFabMenu';
// import BookBalance from './bookBalance';
// import InvoiceTable from './invoiceTable';

interface SearchType { 
    name: string, 
    status: Array<string> 
    customer: string
}
const InvoiceTableContainer = () => {
    const initialSearch: SearchType = { name: '', status: ["Open"], customer:'' }
    const [search, setSearch] = useState(initialSearch)

    const invoiceInitial: RowType = {
        names: [],
        items: []
    }
    const [selected, setSelected] = useState<RowType>(invoiceInitial)

    const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
        setSearch({ ...search, [key]: e.target.value })
    }

    const initial = { showInvoice: false };
    const { visible, onHide, onShow } = useShowHide(initial);

    const idFilter: Filter[] = search.name?.length >= 3 ? [['name', 'like', `%${search.name}%`]] : []
    // if row selected customer name equl or like 
    const customerFilter: Filter[] = search.customer?.length >= 3 ? [['customer', selected.names.length > 0 ? '=' : 'like', selected.names.length > 0 ? search.customer : `%${search.customer}%`]] : []

    const sorterInitial: SorterType = { field: "name", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
        setSorter({ ...sorter, field, order })
    }

    const { data, mutate } = useFrappeGetDocList<any>(
        'Customer Invoice', {
        fields: ['*'],
            filters: [["status", "in", search.status], ...idFilter, ...customerFilter],
        orderBy: sorter.order ? sorter : sorterInitial
    })

    const onStatusFilter = (data: any) => {
        setSearch({ ...search, status: data })
    }

   

    
    const handleReset = () => { setSelected(invoiceInitial) }
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        setSearch({ ...search, customer: (selectedRows.length > 0 ? selectedRows[0].customer : '')})
        setSelected({ ...selected, names: selectedRowKeys, items: selectedRows })
    }
    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: selected.names,
        onChange: onSelectChange,
        getCheckboxProps: (record: any) => ({disabled: record.status !== 'Open'})
    }

    return (
        <>
            <InvoiceTable
                dataSource={data}
                sorter={sorter}
                search={search}
                handleSorter={handleSorter}
                handleSearch={handleSearch}
                rowSelection={rowSelection}
                handleFilter={onStatusFilter}
            />
            {(isEmpty(selected.names)) ? null : (
                <InvoiceFabMenu selected={selected} reset={handleReset} onShow={onShow} mutate={mutate} />
            )}
            {visible.showBalanceBooking ? <BookBalance open={visible.showBalanceBooking} onClose={onHide} items={selected.names} /> : null}
        </>
    )
}

export default InvoiceTableContainer
