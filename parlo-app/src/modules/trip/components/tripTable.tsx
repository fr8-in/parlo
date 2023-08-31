
import { message, Modal, Space, Table } from 'antd'
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Button, IconButton } from '@mui/material';
import { useShowHideWithRecord, useWindowSize } from '../../../lib/hooks';
import TripItemContainer from './tripItemContainer';
import util from '../../../lib/utils';
import constants from '../../../lib/constants';
import { useNavigate } from 'react-router-dom';
import searchObject from '../../../common/searchObject';
import sorterObject from '../../../common/sorterObject';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import TripPayment from './tripPayment';

interface Props {
    dataSource: any
    hide_filters?: boolean
    sorter?: any
    search?: any
    handleSorter?: Function
    handleSearch?: Function
    rowSelection?: any
    is_payment_tab?: boolean
    tabKey?:string
    is_assigned_tab?:boolean
}

const TripTable = (props: Props) => {
    const { dataSource, hide_filters, handleSorter, handleSearch, rowSelection, sorter, search, is_payment_tab, tabKey , is_assigned_tab} = props;
    const initial = { showCharges: false, tripName: null }
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
    const navigate = useNavigate()

    const onPressCall = (mobile: any) => {
        util.callNow(mobile)
        if (!mobile) {
            message.error("Mobile number does not exist")
        }

    }

    /**
     * @author Prasanth.M
     * @function onClickEditIcon
     * @description When the edit icon is clicked  from saved (Key = Assigned) tab , the user will be navigated to the confirm load screen.
     * @param name 
     */
    const onClickEditIcon = (name:any) =>{
        if(is_assigned_tab){
            navigate(`/trip/assigned/${name}?assignTrip=true`)
        }else{
            handleShow('showCharges', '', 'tripName', name)
        }
    }


    const { height } = useWindowSize()
    const tableHeight = height - 130
    const columns: any = [
        ...(hide_filters ? [] : [{
            title: "Action",
            render: (record: any) => {
                return (
                    <Space>
                        <IconButton hidden={is_assigned_tab} size='small' onClick={() => onPressCall(record?.cell_number)}>
                            <LocalPhoneIcon color='secondary' fontSize='small' />
                        </IconButton>
                         <IconButton color='secondary' size='small' disabled={!!record.invoiced_at} onClick={() => onClickEditIcon(record.name)}>
                            <DriveFileRenameOutlineIcon fontSize='small' />
                        </IconButton>
                    </Space>
                )
            },
            width: rowSelection ? "6%" : "4%",
            fixed: "left"
        }]),
        {
            title: "ID",
            render: (record: any) => {
                return <Button size='small' color='secondary' onClick={() => is_assigned_tab ? undefined :  navigate(`/trip/${record?.name}`)}>{record?.id}</Button>
            },
            width: "7%",
            ...(hide_filters ? {} : sorterObject("id", sorter, handleSorter)),
            ...(hide_filters ? {} : searchObject('id', search, handleSearch))
        },
        {
            title: "Status",
            dataIndex: "workflow_state",
            width: "6%"
        },
        {
            title: "Created",
            dataIndex: "creation",
            width: "6%",
            ...(hide_filters ? {} : sorterObject("creation", sorter, handleSorter)),
            render: (text: string) => util.formatDate(text, constants.DDMMMYY)

        },
        {
            title: "Source",
            dataIndex: "source",
            width: "7%",
            ...(hide_filters ? {} : searchObject("source", search, handleSearch))
        },
        {
            title: "Destination",
            dataIndex: "destination",
            width: "7%",
            ...(hide_filters ? {} : searchObject("destination", search, handleSearch))
        },
        {
            title: "I.Count",
            dataIndex: "indent_count",
            width: "5%",
        },
        {
            title: "Truck No",
            dataIndex: "truck",
            width: "7%"
        },
        {
            title: "Supplier",
            dataIndex: "supplier",
            width: "8%",
            ellipsis: {
                showTitle: true,
            },
            ...(hide_filters ? {} : searchObject("supplier", search, handleSearch))
        },
        {
            title: "Created by",
            dataIndex: "owner",
            width: "6%",
            ellipsis: true
        },
        {
            title: "Cases",
            dataIndex: "cases",
            width: "4%",
        },
        {
            title: "Weight",
            dataIndex: "weight",
            width: "4%",
        },
        {
            title: "Price(₹)",
            dataIndex: "supplier_price",
            align: 'right',
            width: "5%",
            ...sorterObject("supplier_price", sorter, handleSorter),
        },
     ...( is_assigned_tab ? [] : [   {
            title: "Charges(₹)",
            width: "9%",
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
            align: 'right',
            render: (record: any) => <span>{record.supplier_price + record.add_charge + record.reduce_charge}</span>,
            width: "5%"
        },
        {
            title: "Paid(₹)",
            dataIndex: "paid",
            align: 'right',
            width: "5%"
        },
        {
            title: "Balance(₹)",
            dataIndex: "balance",
            align: 'right',
            width: "6%"
        },
        ...(is_payment_tab ? [{
            title: "Booked(₹)",
            dataIndex: "amount",
            align:'right',
            width: "6%"
        }] : [])])
        // ...(hide_filters ? [{
        //     title: "Document",
        //     key:'Document',
        //     render: (record: any) => {
        //         return (
        //             <IconButton size='small' onClick={() => { }}>
        //                 <UploadFileIcon color='secondary' fontSize='small' />
        //             </IconButton>
        //         )
        //     },
        //     fixed: 'right' as FixedType,
        //     width: "5%"
        // }] : [])
    ]

    const hide_rowselection = (hide_filters || tabKey === 'All' || tabKey === 'Active' || tabKey =="Assigned")

    return (
        <>
            <Table columns={columns}
                size="small"
                expandable={hide_filters ? undefined : {
                    expandedRowRender: (record) => <TripItemContainer name={record.name} />,
                }}
                dataSource={dataSource}
                pagination={false}
                rowKey={record => record.name}
                scroll={{ x: 1500, y: tableHeight }}
                rowSelection={hide_rowselection ? undefined : rowSelection}
            />
            {object.showCharges ? (
                <Modal
                    maskClosable={false}
                    open={object.showCharges}
                    onCancel={handleHide}
                    width={700}
                    footer={[<Button onClick={handleHide} key={"close"}>Close</Button>]}
                >
                    <TripPayment tripName={object.tripName} />
                </Modal>
            ) : null}
        </>
    )
}

export default TripTable
