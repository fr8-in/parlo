import { message, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import sorterObject from '../../../common/sorterObject'
import { IndentPaymentRequestType } from '../../../lib/types/trip'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton'
import searchObject from '../../../common/searchObject'
import { useWindowSize } from '../../../lib/hooks/useWindowSize'
import isEmpty from 'lodash/isEmpty'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import util from '../../../lib/utils'
import EditableCell from '../../../common/editableCell'
import constants from '../../../lib/constants'
import filterObject from '../../../common/filterObject'
import { useNavigate } from 'react-router-dom'

interface IndentPaymentRequestTableProps {
    dataSource: Array<IndentPaymentRequestType>;
    sorter?:any;
    handleSorter?:Function;
    search?:any;
    searchHandler?:Function;
    actionsDisabled?:boolean;
    hideActions?:boolean;
    hideFilters?:boolean;
    showTotalAmount?:boolean;
    rowSelection?:any
    handleFilter?:Function
    mutate: Function;
    showEditIcon?:boolean
}
/**
 * @author Prasanth.M
 * @props refer IndentPaymentRequestTableProps
 * @returns JSX.Element IndentPaymentRequestTable
 */
const IndentPaymentRequestTable = (props: IndentPaymentRequestTableProps) => {
    const {  dataSource ,  sorter ,  handleSorter , 
        actionsDisabled , search , searchHandler , 
        hideActions , hideFilters , showTotalAmount , 
        rowSelection , handleFilter , mutate , showEditIcon} = props
    
    const navigate = useNavigate()
    const { updateDoc, error, isCompleted, loading } = useFrappeUpdateDoc()
    
    const { height } = useWindowSize()
    const tableHeight:number = height - 130

    //Click Handlers
    const handleDeleteAction:any = async (name:string) =>{
        if(name!=""){
           await updateDoc('Indent Payment',name,{deleted_at: util.epr_date_time(moment()) , status : constants.STATUS_CANCELLED })
           .then(
            (response:any)=>{
                message.success("Updated!")
                mutate()
            }
           ).catch(error => message.error(error?.message))
        }
    }

    const handleEditAction:any = async( name:string , amount:number ) => {
        await updateDoc('Indent Payment' , name , { amount : amount }
        ).then(
            (response:any)=>{
                message.success("Amount updated!")
                mutate()
            }
        ).catch(
            error => message.error(error?.message)
        )
    }

    const columns:ColumnsType<any> = [
        {
            title: 'Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
            width:"20%",
            ...(hideFilters ? {} : sorterObject('payment_type', sorter, handleSorter)),
            ...(hideFilters ? {} : filterObject({
                key: 'payment_type',
                options: constants.INDENT_PAYMENT_REQUEST_TYPE,
                value: search.payment_type,
                handleFilter: handleFilter
            }))
        },
        {
            title: 'Created at',
            dataIndex: 'creation',
            key: 'creation',
            width:"15%",
            render:(creation:string)=>(creation ? moment(creation).format('DD-MMM-YY') : null)
        },
        {
            title: 'Created By',
            dataIndex: 'owner',
            key: 'owner',
            width:"15%",
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            width:"13%",
            ...(hideFilters ? {} :sorterObject('customer', sorter, handleSorter)),
            ...(hideFilters ? {} :searchObject('customer', search, searchHandler))
        },
        {
            title: 'Indent Id',
            key: 'indent_id',
            width:"10%",
            ...(hideFilters ? {} :sorterObject('trip_id', sorter, handleSorter)),
            render:(record:any)=>(<p onClick={()=>navigate(`/indent/${record?.indent}`)} className='text-xs text-blue-500 cursor-pointer'>{record?.indent_id}</p>),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width:"10%",
            ...(hideFilters ? {} :sorterObject('amount', sorter, handleSorter)),
            render:(amount,record)=>(<EditableCell showEditIcon={showEditIcon} onSubmit={(value:any)=>handleEditAction(record?.name,parseInt(value))} label={amount?.toString()} text={amount?.toString()} />)

        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed:'right',
            key: 'action',
            render: (_, record) => (<IconButton disabled={actionsDisabled || loading } onClick={()=>handleDeleteAction(record?.name)} aria-label="delete">
                <HighlightOffIcon color={actionsDisabled ? 'disabled' : 'error'} />
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
            scroll={{ x: 200 , y:tableHeight}} 
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

export default IndentPaymentRequestTable