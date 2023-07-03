import { message, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import sorterObject from '../../../common/sorterObject'
import { FuelRequestType } from '../../../lib/types/trip'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton'
import searchObject from '../../../common/searchObject'
import { useWindowSize } from '../../../lib/hooks/useWindowSize'
import isEmpty from 'lodash/isEmpty'
import filterObject from '../../../common/filterObject'
import constants from '../../../lib/constants'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import util from '../../../lib/utils'
import { Stack } from '@mui/system'
import { EditOutlined } from '@ant-design/icons'
import colors from '../../../lib/colors'
import { useShowHideWithRecord } from '../../../lib/hooks'
import EditFuelRequest from './editFuelRequest'
import { useNavigate } from 'react-router-dom'

interface FuelRequestTableProps {
    dataSource: Array<FuelRequestType>;
    sorter?: any;
    handleSorter?: Function;
    search?: any;
    searchHandler?: Function;
    actionsDisabled?: boolean;
    hideActions?: boolean;
    hideFilters?: boolean;
    showTotalAmount?: boolean;
    rowSelection?: any
    handleFilter?: Function
    mutate: Function;
}
/**
 * @author Prasanth.M
 * @returns JSX.Element BankRequestTable
 */
const FuelRequestTable = (props: FuelRequestTableProps) => {
    const { dataSource, sorter, handleSorter,
        actionsDisabled, search, searchHandler,
        hideActions, hideFilters, showTotalAmount,
        rowSelection, handleFilter, mutate } = props

    const showHideInitial: { showFuelRequestEditModal: boolean; fuelRequestRecord: any } = {
        showFuelRequestEditModal: false,
        fuelRequestRecord: {}
    }
    const navigate = useNavigate()
    const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)
    const { updateDoc, error, isCompleted, loading } = useFrappeUpdateDoc()

    const { height } = useWindowSize()
    const tableHeight: number = height - 130

    //Click Handlers
    const handleDeleteAction: any = async (name: string) => {
        if (name != "") {
            await updateDoc('Trip Fuel', name, { deleted_at: util.epr_date_time(moment()), status: constants.STATUS_CANCELLED })
                .then(
                    (response: any) => {
                        message.success("Updated!")
                        mutate()
                    }
                ).catch(error => message.error(error?.message))
        }
    }

    const handleEditAction: any = (record: FuelRequestType) => {
        handleShow('showFuelRequestEditModal', '', 'fuelRequestRecord', record)
    }

    const navigateToTripDetail = (tripName:string) => {
        navigate(`/trip/${tripName}`)
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            width: "10%",
            ...(hideFilters ? {} : sorterObject('supplier', sorter, handleSorter)),
            ...(hideFilters ? {} : searchObject('supplier', search, searchHandler))
        },
        {
            title: 'Station Name',
            dataIndex: 'fuel_station',
            key: 'fuel_station',
            width: "15%",
            ...(hideFilters ? {} : sorterObject('fuel_station', sorter, handleSorter)),
            ...(hideFilters ? {} : searchObject('fuel_station', search, searchHandler))
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: "8%",
            ...(hideFilters ? {} : filterObject({
                key: 'status',
                options: constants.FUEL_REQUEST_STATUS_FILTER,
                value: search.status,
                handleFilter: handleFilter
            }))
        },
        {
            title: 'Created at',
            dataIndex: 'creation',
            key: 'creation',
            width: "8%",
            render: (creation: string) => (creation ? moment(creation).format('DD-MMM-YY') : null)
        },
        {
            title: 'Created by',
            dataIndex: 'owner',
            key: 'owner',
            width: "10%",
        },
        {
            title: 'Trip Id',
            key: 'trip_id',
            width: "10%",
            ...(hideFilters ? {} : sorterObject('trip_id', sorter, handleSorter)),
            render: (record:any) => (<p onClick={()=>navigateToTripDetail(record?.trip)} className='text-xs text-blue-500 cursor-pointer'>{record?.trip_id}</p>)
        },
        {
            title: 'Litre',
            dataIndex: 'fuel_lts',
            key: 'fuel_lts',
            width: "8%",
        },
        {
            title: 'Rate',
            dataIndex: 'fuel_rate',
            key: 'amount',
            width: "8%",
        },

        {
            title: 'Fuel Total',
            dataIndex: 'fuel_amount',
            key: 'fuel_amount',
            ...(hideFilters ? {} : sorterObject('fuel_amount', sorter, handleSorter)),
            width: "11%",
        },
        {
            title: 'Cash',
            dataIndex: 'cash',
            key: 'cash',
            width: "8%",
        },
        {
            title: 'Total',
            dataIndex: 'total',
            render: (_, record) => (record?.fuel_amount + record?.cash || '-'),
            width: "8%",
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            key: 'action',
            width: "10%",
            render: (_, record) => (
                <Stack flexDirection={"row"}>
                    <IconButton size='small' color='secondary' onClick={() => handleEditAction(record)} aria-label="delete">
                        <EditOutlined />
                    </IconButton>
                    <IconButton size='small' color={'error'} onClick={() => handleDeleteAction(record?.name)} disabled={actionsDisabled || loading} aria-label="delete">
                        <HighlightOffIcon fontSize='small' />
                    </IconButton>
                </Stack>
            )
        },
    ];


    const tableColumns: ColumnsType<any> = hideActions ? columns.filter((col: any) => col.dataIndex !== 'action') : columns
    const totalAmount: number = (!isEmpty(dataSource) && showTotalAmount) ? dataSource.reduce((total, data) => total + data.fuel_amount + data.cash, 0) : 0;

    return (
        <div>
            <Table
                size='small'
                pagination={false}
                dataSource={dataSource}
                columns={tableColumns}
                rowSelection={rowSelection}
                rowKey={(record) => record.name}
                scroll={{ x: 1200, y: tableHeight }}
                footer={showTotalAmount ? () => (
                    <p className='text-right items-center gap-3'>
                        <span className='font-medium text-sm'>Total</span>
                        <span className='text-zinc-500 font-semibold text-sm'> | </span>
                        <span className='text-blue-400 text-sm'>{totalAmount}</span>
                    </p>
                ) : undefined}
            />
            {
                object.showFuelRequestEditModal ? (
                    <EditFuelRequest
                        fuel_record={object.fuelRequestRecord}
                        open={object.showFuelRequestEditModal}
                        onClose={handleHide}
                        mutate={mutate} />
                ) : null
            }
        </div>
    )
}

export default FuelRequestTable