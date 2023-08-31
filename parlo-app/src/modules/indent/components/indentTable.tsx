import { useEffect, useState } from 'react'
import { Indent } from '../../../lib/types/indent'
import searchObject from '../../../common/searchObject'
import sorterObject from '../../../common/sorterObject'
import util from '../../../lib/utils'
import constants from '../../../lib/constants'
import { useShowHideWithRecord, useWindowSize } from '../../../lib/hooks'
import { Modal, Space, Table } from 'antd'
import IndentItemContainer from './indentItemContainer'
import IconButton from '@mui/material/IconButton'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Button from '@mui/material/Button'
import TripPayment from '../../trip/components/tripPayment'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import LrEwayTab from '../../trip/components/lrEwayTab'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'

interface Props {
    data: Array<Indent> | undefined
    loading: boolean
    sorter?: any
    setSorter?: Function
    search?: any
    setSearch?: Function
    rowSelection?: any
    tabKey?: string
    mutate:Function
}
const IndentTable = (props: Props) => {
    const { data, loading, sorter, setSorter, search, setSearch, rowSelection, tabKey, mutate } = props
    console.log('data :', data);
    const { height } = useWindowSize()
    const navigate = useNavigate()

    const initial = { showCharges: false, showLrEwayTab: false, record: null }
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

    const [showSort, setShowsort] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        setShowsort(!!sorter)
        setShowSearch(!!search)
    }, [sorter, search])

    const show_column = (tabKey === 'Active' || tabKey === 'Delivered' || tabKey === 'Payment' || tabKey === 'Invoice')

    const tableHeight = height - 130
    const columns: any = [
        ...(show_column ? [{
            title: "Action",
            render: (record: any) => {
                return (
                    <Space>
                        <IconButton color='secondary' size='small' disabled={!!record.invoiced_at} onClick={() => handleShow('showCharges', '', 'record', record)}>
                            <DriveFileRenameOutlineIcon fontSize='small' />
                        </IconButton>
                        {record.workflow_state === "Confirmed" ? <IconButton title={record.lr_no || undefined} color="secondary" sx={{ alignContent: 'center' }} onClick={() => handleShow('showLrEwayTab', '', 'record', record)} size="small">
                            {record.lr_no ? (<EyeOutlined />) : <UploadOutlined />}
                        </IconButton> : null}
                    </Space>
                )
            },
            width: "5%",
            fixed: "left"
        }] : []),
        {
            title: "Id",
            render:(record:any)=>(<p onClick={()=>navigate(`/indent/${record?.name}`)} className='text-xs text-blue-500 cursor-pointer'>{record?.id}</p>),
            ...(showSort ? sorterObject('id', sorter, setSorter) : {}),
            ...(showSearch ? searchObject('id', search, setSearch) : {}),
            width: "7%"
        },
        {
            title: "Created at",
            dataIndex: "creation",
            ...(showSort ? sorterObject('creation', sorter, setSorter) : {}),
            render: (text: string) => util.formatDate(text, constants.DDMMMHHmm),
            width: "7%"
        },
        {
            title: "Status",
            dataIndex: "workflow_state",
            ellipsis: {
                showTitle: true,
            },
            width: "5%"
        },
        {
            title: "Customer",
            dataIndex: "customer",
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "5%" : "9%"
        },
        {
            title: "Source",
            // dataIndex: "source",
            render: (record: any) => (
                    <Tooltip title={record?.from}>
                        <p className='text-xs cursor-pointer truncate'>{record?.source}</p>
                    </Tooltip>
            ),
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "6%" : "9%",
            ...(showSearch ? searchObject('source', search, setSearch) : {})
        },
        {
            title: "S.Branch",
            // dataIndex: "source",
            render: (record: any) => (
                    <Tooltip title={record?.source_branch}>
                        <p className='text-xs cursor-pointer truncate'>{record?.source_branch}</p>

                    </Tooltip>
            ),
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "6%" : "9%",
            ...(showSearch ? searchObject('source_branch', search, setSearch) : {})
        },
        {
            title: "Consignee",
            dataIndex: "consignee",
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "7%" : "10%",
            ...(showSearch ? searchObject('consignee', search, setSearch) : {})
        },
        {
            title: "Destination",
            // dataIndex: "destination",
            render: (record: any) => (
                     <Tooltip title={record?.to}>
            <p className='text-xs cursor-pointer truncate'>{record?.destination}</p>
            </Tooltip>
            ),
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "5%" : "10%",
            ...(showSearch ? searchObject('destination', search, setSearch) : {})
        },
        {
            title: "D.Branch",
            render: (record: any) => (
            <Tooltip title={record?.destination_branch}>
            <p className='text-xs cursor-pointer truncate'>{record?.destination_branch}</p>
            </Tooltip>
            ),
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "5%" : "10%",
            ...(showSearch ? searchObject('destination_branch', search, setSearch) : {})
        },
        ...(show_column ? [
        {
            title: "LR",
            dataIndex: "lr_no",
            width: "4%"
        },
        {
            title: "Way Bill",
            dataIndex: "way_bill_no",
            width: "5%"
        },
        {
            title: "Trip Id",
            render: (record: any) => (<p onClick={() => navigate(`/trip/${record?.trip}`)} className='text-xs text-blue-500 cursor-pointer'>{record?.trip}</p>),
            width: "6%"
        },
        {
            title: "Truck No",
            dataIndex: "truck",
            width: "7%"
        }] : []),
        {
            title: "Created by",
            dataIndex: "owner",
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "5%" : "10%",
            ...(showSort ? sorterObject('owner', sorter, setSorter) : {})
        },
        ...(tabKey ? [] : [{
            title: "Exp.in (hrs)",
            ellipsis: {
                showTitle: true,
            },
            render: (record: any) => {
                const hrs = record.expiry_at ? util.getHours(record.expiry_at) : 0
                return (
                    <p className={`${hrs <= 0 ? 'text-green-700' : 'text-red-700'} text-[11px]`}>
                        {hrs <= 0 ? Math.abs(hrs) : `-${hrs}`}
                    </p>)
            },
            width: "5%",
            ...(showSort ? sorterObject('expiry_at', sorter, setSorter) : {})
        }]),
        {
            title: "Cases",
            dataIndex: "cases",
            width: "5%",
            ...(showSort ? sorterObject('cases', sorter, setSorter) : {})
        },
        {
            title: "Weight",
            dataIndex: "weight",
            width: "5%",
            ...(showSort ? sorterObject('weight', sorter, setSorter) : {})
        },
        {
            title: "Type",
            dataIndex: "rate_type",
            ellipsis: {
                showTitle: true,
            },
            width: show_column ? "5%" : "10%",
            ...(showSort ? sorterObject('rate_type', sorter, setSorter) : {})
        },
        {
            title: "Price(₹)",
            dataIndex: "customer_price",
            align: "right",
            width: "5%",
            ...(showSort ? sorterObject('customer_price', sorter, setSorter) : {})
        },
        ...(show_column ? [
            {
                title: "Charges(₹)",
                width: "8%",
                children: [
                    {
                        title: '(+)',
                        dataIndex: 'add_charge',
                        key: 'add_charge',
                        width: "4%",
                        align: 'center'
                    },
                    {
                        title: '(-)',
                        dataIndex: 'reduce_charge',
                        key: 'reduce_charge',
                        width: "4%",
                        align: 'center',
                    },
                ]
            },
            {
                title: "Total(₹)",
                align: "right",
                render: (record: any) => <span>{(record.customer_price || 0) + (record?.add_charge || 0) + (record?.reduce_charge || 0)}</span>,
                width: "5%"
            },
            {
                title: "Received(₹)",
                dataIndex: "received",
                align: "right",
                width: "6%"
            },
            {
                title: "Remaining(₹)",
                dataIndex: "balance",
                align: "right",
                width: "7%"
            },
        ] : []),
        ...(tabKey === 'Payment' ? [{
            title: "Booked(₹)",
            dataIndex: "amount",
            align: 'right',
            width: "6%"
        }] : [])
    ];
    return (
        <>
            <Table
                columns={columns}
                rowKey={record => record.name}
                dataSource={data}
                rowSelection={rowSelection}
                expandable={{
                    expandedRowRender: (record) => <IndentItemContainer name={record.name} />,
                }}
                size="small"
                loading={loading}
                scroll={{ x: show_column ? 1900 : 1400, y: tableHeight }}
                pagination={false}
            />
            {object.showCharges ? (
                <Modal
                    maskClosable={false}
                    open={object.showCharges}
                    onCancel={handleHide}
                    width={700}
                    footer={[
                        <Button onClick={handleHide} key={"close"}>
                            Close
                        </Button>,
                    ]}
                >
                    <TripPayment fromIndent indentName={object.record.name} indentData={object.record} />
                </Modal>
            ) : null}
            {object.showLrEwayTab ? (
                <LrEwayTab
                    open={object.showLrEwayTab}
                    handleCancel={handleHide}
                    indentId={object.record.name}
                    lrNo={object.record.lr_no}
                    eWay={object.record.way_bill_no}
                    mutate={mutate}
                />

            ) : null}
        </>
    )
}

export default IndentTable
