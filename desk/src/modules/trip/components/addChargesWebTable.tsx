import { Button } from '@mui/material'
import { Table } from 'antd'
import { useEffect } from 'react'
import { useShowHideWithRecord } from '../../../lib/hooks'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditChargesType from './editCharges'
import ChargeDetailPreview from './chargeDetailPreview'


interface data {
    charge_type:string;
    remarks:string;
    amount:number;
}
interface Props {
    refetch: number
    mutate:Function
    data:Array<data>
    fromIndent?:any
}

const AddChargesWebTable = (props: Props) => {
    const { refetch , mutate , data , fromIndent} = props;

    const initial = {
        showDetail: false,
        showEditCharges: false, charges: null
    };


    const { object, handleHide, handleShow } = useShowHideWithRecord(initial);
    const handleEdit = (charges: any) => {
        handleShow("showEditCharges", "", "charges", charges)
    };

    useEffect(()=>{
        mutate()
    }, [refetch])


    const columns = [
        {
            title: "Charge Type",
            dataIndex: "charge_type",
            width: "25%"
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            width: "45%"
        },
        {
            title: "Price",
            dataIndex: "amount",
            width: "18%"
        },
        {
            title: "Actions",
            width: "12%",
            render: (record: data) => {
                return (<>
                    <Button
                        onClick={record.charge_type === 'Price' ? undefined :(e) => handleEdit(record)}
                        disabled={record.charge_type === 'Price'}
                        color='secondary'
                        title="editCharges" type='button' endIcon={<DriveFileRenameOutlineIcon />} />
                </>)
            }
        }
    ]
    return (

        <>

            <Table columns={columns}
                dataSource={data}
                rowKey={(record:any)=>record.name}
                pagination={false}
                size="small"
            />
            {object.showDetail ? (
                    <ChargeDetailPreview
                        open={object.showDetail}
                        chargesData={object.charges}
                        onOpen={() =>  handleShow("showDetail", "", "charges", object.charges)} handleCancel={handleHide} />

                ) : null
            }
            {object.showEditCharges ? (
                    <EditChargesType
                        open={object.showEditCharges}
                        chargeData={object.charges}
                        mutate={mutate}
                        fromIndent={fromIndent}
                        onOpen={() => handleShow("showEditCharges", "", "charges", object.charges)} handleCancel={handleHide} />

                ) : null
            }
        </>
    )
}

export default AddChargesWebTable