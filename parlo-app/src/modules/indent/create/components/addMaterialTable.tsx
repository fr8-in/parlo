import Button from '@mui/material/Button';
import { Table } from 'antd';
import EditMaterial from './editMaterial';
import { useShowHide, useShowHideWithRecord } from '../../../../lib/hooks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton } from '@mui/material';


interface Props {
    rateType: any
    dataSource: any
    handleEditMaterialType: Function
    handleDeleteMaterialType: Function
}

interface MaterialType {
    material_name: string
    bill_no: number
    sap_ref_no: string
    cases: number
    weight: number
    unit_price: number
    price: number
    remarks: string
}

const AddMaterialTable = (props: Props) => {
    const { rateType, dataSource, handleEditMaterialType, handleDeleteMaterialType } = props;
    const initial_show_hide = {
        showEditMaterial: false
    }

    const { onShow } = useShowHide(initial_show_hide)
    const initial = { showEdit: false, showDelete: false, material: null };
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial);
    const handleEdit = (material: any) => {
        handleShow("showEdit", "", "material", material)
    };
    const columns = [
        {
            title: "Material",
            dataIndex: "material_name",
            width: 20
        },
        {
            title: "Quintal",
            dataIndex: "weight",
            width: 10
        },
        {

            title: "Case",
            dataIndex: "cases",
            width: 10

        },
        ...(rateType?.is_per_case == 1 && rateType?.is_per_kg == 1) ? [{
            title: "Per Unit",
            dataIndex: "unit_price",
            width: 15
        }] : [],
        ...(rateType?.is_per_case == 1 && rateType?.is_per_case == 1) ? [{
            title: "Price",
            dataIndex: "price",
            width: 15
        }] : [],
        {
            width: 30,
            render: (record: any) => {
                return (
                    <IconButton
                        onClick={(e) => handleEdit(record)}
                    >
                        <NavigateNextIcon />
                    </IconButton>
                )

            }
        }
    ]
    return (
        <>
            <Table columns={columns}
                dataSource={dataSource}
                rowKey={(record: MaterialType) => record?.material_name}
                size="small"
                pagination={false} />
            {
                object.showEdit ? (
                    <EditMaterial
                        onEdit={handleEditMaterialType}
                        onDelete={handleDeleteMaterialType}
                        open={object.showEdit}
                        onClose={handleHide}
                        rateType={rateType}
                        materialData={object.material}
                        onOpen={() => onShow("showEditMaterial")} />
                ) : null


            }

        </>

    )
}

export default AddMaterialTable