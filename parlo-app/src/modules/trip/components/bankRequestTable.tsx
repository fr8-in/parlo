import { message, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import sorterObject from '../../../common/sorterObject'
import { BankRequestType } from '../../../lib/types/trip'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton'
import searchObject from '../../../common/searchObject'
import { useWindowSize } from '../../../lib/hooks/useWindowSize'
import isEmpty from 'lodash/isEmpty'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import util from '../../../lib/utils'
import constants from '../../../lib/constants'
import EditableCell from '../../../common/editableCell'
import { useNavigate } from 'react-router-dom'

interface BankRequestTableProps {
    dataSource: Array<BankRequestType>;
    sorter?:any;
    handleSorter?:Function;
    search?:any;
    searchHandler?:Function;
    actionsDisabled?:boolean;
    hideActions?:boolean;
    hideFilters?:boolean;
    showTotalAmount?:boolean;
    rowSelection?:any;
    mutate:Function;
}
/**
 * @author Prasanth.M
 * @returns JSX.Element BankRequestTable
 */
const BankRequestTable = (props: BankRequestTableProps) => {
    const { dataSource , sorter , handleSorter , 
        actionsDisabled , search , searchHandler , 
        hideActions , hideFilters , showTotalAmount , 
        rowSelection , mutate } = props
    
    const { updateDoc, error, isCompleted, loading } = useFrappeUpdateDoc()
    const { height } = useWindowSize()
    const tableHeight:number = height - 130
    const navigate = useNavigate()

        //Click Handlers
        const handleDeleteAction:any = async (name:string) =>{
               await updateDoc('Trip Payment',name,{deleted_at: util.epr_date_time(moment()) , status : constants.STATUS_CANCELLED })
               .then(
                (response:any)=>{
                    message.success("Updated!")
                    mutate()
                }
               ).catch(error=> message.error(error?.message))
        }

        const handleEditAction:any = async( name:string , amount:number ) => {
            await updateDoc('Trip Payment' , name , { amount : amount }
            ).then(
                (response:any)=>{
                    message.success("Amount updated!")
                    mutate()
                }
            ).catch(
                error => message.error(error?.message)
            )
        }

        const navigateToTripDetail = (tripName:string) => {
            navigate(`/trip/${tripName}`)
        }


    const columns:ColumnsType<any> = [
        {
            title: 'Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
            width:"20%",
            ...(hideFilters ? {} : sorterObject('payment_type', sorter, handleSorter)),
        },
        {
            title: 'Created at',
            dataIndex: 'creation',
            key: 'creation',
            width:"10%",
            render:(creation:string)=>(creation ? moment(creation).format('DD-MMM-YY') : null)
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            width:"20%",
            ...(hideFilters ? {} :sorterObject('supplier', sorter, handleSorter)),
            ...(hideFilters ? {} :searchObject('supplier', search, searchHandler))
        },
        {
            title: 'Supplier Bank',
            dataIndex: 'supplier_bank',
            key: 'supplier_bank',
            width:"13%"
        },
        {
            title: 'Trip Id',
            key: 'trip_id',
            ...(hideFilters ? {} :sorterObject('trip_id', sorter, handleSorter)),
            render: (record:any) => (<p onClick={()=>navigateToTripDetail(record?.trip)} className='text-xs text-blue-500 cursor-pointer'>{record?.trip_id}</p>)
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            ...(hideFilters ? {} :sorterObject('amount', sorter, handleSorter)),
            render:(amount,record)=>(<EditableCell showEditIcon={!hideActions} onSubmit={(value:any)=>handleEditAction(record?.name,parseInt(value))} label={amount?.toString()} text={amount?.toString()} />)

        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed:'right',
            key: 'action',
            render: (_, record) => (<IconButton size='small' color='error' disabled={actionsDisabled || loading } onClick={()=>handleDeleteAction(record?.trip)} aria-label="delete">
                <HighlightOffIcon fontSize='small' />
            </IconButton>)
        },
    ];


    const tableColumns:ColumnsType<any> = hideActions ?  columns.filter((col:any) => col.dataIndex !== 'action') : columns
    const totalAmount:number = (!isEmpty(dataSource) && showTotalAmount)  ? dataSource.reduce((total, data) => total + data.amount, 0) : 0;

    return (
        <div>
            <Table 
            size='small' 
            pagination={false} 
            dataSource={dataSource} 
            columns={tableColumns} 
            rowSelection={rowSelection} 
            rowKey={(record)=>record.name}
            scroll={{ x: 800 , y:tableHeight}} 
            footer={ showTotalAmount ? () => (
                <p className='text-right items-center gap-3'>
                    <span className='font-medium text-sm'>Total</span>
                    <span className='text-zinc-500 font-semibold text-sm'> | </span>
                    <span className='text-blue-400 text-sm'>{totalAmount}</span>
                </p>
              ) : undefined}
            />
        </div>
    )
}

export default BankRequestTable