import type { ColumnsType } from 'antd/es/table';
import { Space, Table, message } from 'antd';
import { useShowHideWithRecord, useWindowSize } from '../../../lib/hooks';
import searchObject from '../../../common/searchObject';
import filterObject from '../../../common/filterObject';
import sorterObject from '../../../common/sorterObject';
import constants from '../../../lib/constants';
import moment from 'moment';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';
import TripPaymentTable from './TripPaymentTable';
import IndentPaymentTable from '../../indent/components/indentPaymentTable';

interface Props {
    dataSource: any
    is_model?: boolean
    sorter?: any
    search?: any
    handleSorter?: Function
    handleSearch?: Function
    rowSelection?: any
    handleFilter?: any
    mutate?: any
    type: "trip" | "indent"
}
const PaymentTable = (props: Props) => {
    const { dataSource, is_model, handleSorter, handleSearch, handleFilter, rowSelection, sorter, search, mutate, type } = props;

    const { height } = useWindowSize()
    const tableHeight = height - 130

    const { data } = useFrappeGetDocList('Payment Mode', { fields: ["*"], caches: true })
    const options = data?.map((fs: any) => ({ value: fs.name, label: fs.name }))
    const { data: type_data } = useFrappeGetDocList('Payment Type', { fields: ["*"], caches: true })
    const type_options = type_data?.map((pt: any) => ({ value: pt.name, label: pt.name }))


    const { call } = useFrappePostCall('parlo.trip.api.payments.cancel_payment.cancel_payment');

    const initial = { showCancel: false, item_name: null }
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

    const onSubmit = async (value: any) => {
        await call({
            cancel_payment_input: {
                payment_name: object.item_name
            }
        }).then(
            (result: any) => {
                console.log({ result: result?.message })
                message.success('Payment cancelled successfully')
                handleHide()
                if (mutate) { mutate() }
            }
        ).catch(error => {
            message.error(error?.message)
            handleHide()
        });
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Type',
            dataIndex: 'payment_type',
            width: '8%',
            key: 'payment_type',
            ...filterObject({ key: 'payment_type', options: type_options || [], value: search.payment_type, handleFilter })
        },
        {
            title: 'Mode',
            dataIndex: 'payment_mode',
            width: '6%',
            key: 'payment_mode',
            ...filterObject({ key: 'payment_mode', options: options, value: search.payment_mode, handleFilter })
        },
        {
            title: 'Status',
            width: '8%',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Date',
            width: '9%',
            key: 'creation',
            render: (record: any) => moment(record.creation).format(constants.DDMMMYY),
            ...sorterObject("creation", sorter, handleSorter)
        },
        ...(type === 'trip' ? [{
            title: 'T.Count',
            width: '6%',
            dataIndex: 'trip_count',
            key: 'trip_count',
            // ...sorterObject("trip_count", sorter, handleSorter)
        }] : [{
            title: 'I.Count',
            width: '6%',
            dataIndex: 'indent_count',
            key: 'indent_count',
            // ...sorterObject("trip_count", sorter, handleSorter)
        }]),
        ...(type === 'trip' ? [{
            title: 'Supplier',
            width: '10%',
            dataIndex: 'supplier',
            ellipsis: {
                showTitle: true,
            },
            key: 'supplier',
            ...(is_model ? {} : searchObject("supplier", search, handleSearch))
        }] : [{
            title: 'Customer',
            width: '10%',
            dataIndex: 'customer',
            ellipsis: {
                showTitle: true,
            },
            key: 'customer',
            ...(is_model ? {} : searchObject("customer", search, handleSearch))
        }]),
        {
            title: type === 'trip' ? 'From Bank' : 'Company Bank',
            width: '10%',
            dataIndex: 'company_bank',
            key: 'company_bank',
        },
        ...(type === 'trip' ? [{
            title: 'To Bank',
            width: '10%',
            dataIndex: 'supplier_bank',
            key: 'supplier_bank',
        }] : []),
        {
            title: 'Ref. No',
            width: '10%',
            dataIndex: 'ref_no',
            key: 'ref_no'
        },
        {
            title: "Remarks",
            dataIndex: 'remarks',
            key: 'remarks',
            width: "19%"
        },
        {
            title: 'Amount(₹)',
            width: '8%',
            dataIndex: 'amount',
            key: 'amount',
            ...sorterObject("amount", sorter, handleSorter)
        },
        {
            title: 'Action',
            width: '5%',
            key: 'action',
            fixed: 'right',
            render: (record: any) => {
                return (
                    <Space>
                        <IconButton size='small' onClick={() => handleShow('showCancel', '', 'item_name', record.name)}>
                            <HighlightOffOutlinedIcon color='error' fontSize='small' />
                        </IconButton>
                    </Space>
                )
            },
        }
    ]

    return (
        <>
            <Table columns={columns}
                size="small"
                expandable={{
                    expandedRowRender: (record) => {
                        return (type === 'trip' ? <TripPaymentTable items={[record.name]} /> : <IndentPaymentTable items={[record.name]} /> )
                },
                }}
                dataSource={dataSource}
                pagination={false}
                rowKey={record => record.name}
                scroll={{ x: 1200, y: tableHeight }}
                rowSelection={rowSelection}
            />
            {object.showCancel ? <Dialog
                open={object.showCancel}
                onClose={handleHide}
                aria-labelledby="cancel_payment"
                aria-describedby="cancel_payment_dialog"
            >
                <DialogTitle>
                    Cancel Payment
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure, you want to cancel this payment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleHide}>Close</Button>
                    <Button color='success' onClick={onSubmit} autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog> : null}
        </>
    )
}

export default PaymentTable
