import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import { useWindowSize } from '../../../lib/hooks';
import searchObject from '../../../common/searchObject';
import filterObject from '../../../common/filterObject';
import sorterObject from '../../../common/sorterObject';
import constants from '../../../lib/constants';
import InvoiceTripTable from './invoicedTripTable';
import moment from 'moment';

interface Props {
    dataSource: any
    is_model?: boolean
    sorter?: any
    search?: any
    handleSorter?: Function
    handleSearch?: Function
    rowSelection?: any
    handleFilter?: any
}
const InvoiceTable = (props: Props) => {
    const { dataSource, is_model, handleSorter, handleSearch, handleFilter, rowSelection, sorter, search } = props;

    const { height } = useWindowSize()
    const tableHeight = height - 130

    const columns: ColumnsType<any> = [
        {
            title: 'Invoice No',
            width: '10%',
            dataIndex: 'name',
            key: 'name',
            ...(is_model ? {} : searchObject("name", search, handleSearch))
        },
        {
            title: 'Date',
            width: '9%',
            key: 'creation',
            render:(record:any)=>moment(record.creation).format(constants.DDMMMYY),
            ...sorterObject("creation", sorter, handleSorter)
        },
        {
            title: 'Customer',
            width: '10%',
            dataIndex: 'customer',
            ellipsis: {
                showTitle: true,
            },
            key: 'customer',
            ...(is_model ? {} : searchObject("customer", search, handleSearch))
        },
        {
            title: 'Courier',
            width: '8%',
            dataIndex: 'courier',
            key: 'courier',
        },
        {
            title: 'Docket',
            width: '8%',
            dataIndex: 'docket_no',
            key: 'docket_no',
        },
        {
            title: 'Dispatched',
            width: '9%',
            dataIndex: 'dispatched_by',
            key: 'dispatched_by',
        },
        {
            title: 'I.Count',
            width: '7%',
            dataIndex: 'indent_count',
            key: 'indent_count',
            ...sorterObject("indent_count", sorter, handleSorter)
        },
        {
            title: 'Cases',
            width: '6%',
            dataIndex: 'cases',
            key: 'cases',
        },
        {
            title: 'Weight',
            width: '6%',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Price(₹)',
            width: '7%',
            dataIndex: 'customer_amount',
            key: 'customer_amount',
            ...sorterObject("customer_amount", sorter, handleSorter)
        },
        {
            title: "Charges(₹)",
            children: [
                {
                    title: '(+)',
                    dataIndex: 'add_charge',
                    key: 'add_charge',
                    width: "8%",
                    align: 'center'
                },
                {
                    title: '(-)',
                    dataIndex: 'reduce_charge',
                    key: 'reduce_charge',
                    width: "8%",
                    align: 'center',
                },
            ]
        },
        {
            title: "Total(₹)",
            render: (record: any) => <span>{record.customer_amount + record.add_charge + record.reduce_charge}</span>,
            width: "7%"
        },
        {
            title: 'Received(₹)',
            width: '7%',
            dataIndex: 'received',
            key: 'received',
            ...sorterObject("received", sorter, handleSorter)
        },
        {
            title: 'Balance(₹)',
            width: '7%',
            dataIndex: 'balance',
            key: 'balance',
            ...(is_model ? { fixed: 'right' } : {}),
            ...sorterObject("balance", sorter, handleSorter)
        },
        ...(is_model ? [] : [{
            title: 'Status',
            width: '7%',
            dataIndex: 'status',
            key: 'status',
            ...filterObject({
                key: 'status',
                options: constants.INVOICE_STATUS,
                value: search.status,
                handleFilter: handleFilter
            })
        }])
    ]

    return (
        <>
            <Table columns={columns}
                size="small"
                expandable={{
                    expandedRowRender: (record) => <InvoiceTripTable items={[record.name]} />,
                }}
                dataSource={dataSource}
                pagination={false}
                rowKey={record => record.name}
                scroll={{ x: 1300, y: tableHeight }}
                rowSelection={rowSelection}
            />
        </>
    )
}

export default InvoiceTable
