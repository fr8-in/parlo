import React, { ChangeEvent, useState } from 'react'
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk'
import { useShowHide } from '../../../lib/hooks';
import { RowType, SorterType } from '../../../lib/types/trip';
import isEmpty from 'lodash/isEmpty';
import InvoiceFabMenu from './invoiceFabMenu';
import BookBalance from './bookBalance';
import InvoiceTable from './invoiceTable';

interface SearchType { 
    name: string, 
    status: Array<string> 
    supplier: string
}
const InvoiceTableContainer = () => {
    const initialSearch: SearchType = { name: '', status: ["Open"], supplier:'' }
    const [search, setSearch] = useState(initialSearch)

    const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
        setSearch({ ...search, [key]: e.target.value })
    }

    const invoiceInitial: RowType = {
        names: [],
        items: []
    }
    const [selected, setSelected] = useState<RowType>(invoiceInitial)

    const initial = { showInvoice: false };
    const { visible, onHide, onShow } = useShowHide(initial);
    const idFilter: Filter[] = search.name?.length >= 3 ? [['name', 'like', `%${search.name}%`]] : []
    // if row selected customer name equl or like 
    const supplierFilter: Filter[] = search.supplier?.length >= 3 ? [['supplier', selected.items.length > 0 ? '=' : 'like', selected.names.length > 0 ? search.supplier  : `%${search.supplier}%`]] : []

    const sorterInitial: SorterType = { field: "name", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
        setSorter({ ...sorter, field, order })
    }

    const { data, mutate } = useFrappeGetDocList<any>(
        'Supplier Invoice', {
        fields: ['*'],
            filters: [["status", "in", search.status], ...idFilter, ...supplierFilter],
        orderBy: sorter.order ? sorter : sorterInitial
    })

    const onStatusFilter = (data: any) => {
        setSearch({ ...search, status: data })
    }

    
    const handleReset = () => { setSelected(invoiceInitial) }
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        setSearch({ ...search, supplier: (selectedRows.length > 0 ? selectedRows[0].supplier : '')})
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
