import { Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { message, Modal } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputController } from '../../../common/form/InputController'
import UploadButtonWithPreview from '../../../common/uploadButtonWithPreview'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'




interface FormProps {
    charge_type: string
    supplier_amount: number | null
    remarks: string
}
const initialForm = {
    charge_type: "",
    supplier_amount: null,
    remarks: ""
}

interface Props {
    mutate: any
    handleCancel: any
    open: any
    chargeData: any
    onOpen?: any
    fromIndent?:boolean
}

const EditChargesType = (props: Props) => {

    const { handleCancel, open, chargeData, mutate , fromIndent} = props

    const { control,
        handleSubmit,
        getValues,
        setValue } = useForm<FormProps>({
            mode: "onChange",
            reValidateMode: "onChange",
            defaultValues: initialForm
        })

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const common = { maxWidth: 800, margin: '0 auto' }
    const desktop = { ...common, top: 20 }
    const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }

    const { updateDoc } = useFrappeUpdateDoc()

    const onSubmit = async () => {
        const supplierAmount = getValues("supplier_amount")
        const remarks = getValues("remarks")
        //This component is a shared component.
        //If its fromIndent the indent charges table is updated else the Trip charge table will be updated.
            if(fromIndent){
                await updateDoc('Indent Charge List', chargeData.name, { amount: supplierAmount, remarks: remarks }).then(
                    (response:any)=>{
                        message.success("Updated Successfully!")
                        mutate()
                        handleCancel()
                    }
                ).catch(err => message.error(err?.message))
            }else{
                await updateDoc('Trip Charge', chargeData.name, { supplier_amount: supplierAmount, remarks: remarks }).then(
                    (response:any)=>{
                        message.success("Updated Successfully!")
                        mutate()
                        handleCancel()
                    }
                ).catch(err => message.error(err?.message))
            }
    };

    useEffect(() => {
        setValue("charge_type", chargeData?.charge_type)
        setValue("supplier_amount", chargeData?.amount)
        setValue("remarks", chargeData?.remarks)
    }, [chargeData?.charge_type])
    return (
        <>
            <Modal
                open={open}
                title={"Edit Charges"}
                footer={null}
                style={isMobile ? mobile : desktop}
                width={isMobile ? '100%' : '60%'}
                onCancel={handleCancel}
                className="mobile_overlay"
            >
                <Box margin={0}
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='mt-12 '>
                        <Grid container columnSpacing={1}>
                            <InputController
                                control={control}
                                name={'charge_type'}
                                required
                                disable
                                endIcon="select"
                                label="Charge Type" />
                            <InputController
                                control={control}
                                name={'supplier_amount'}
                                required
                                label="Supplier Amount" />
                            <InputController
                                control={control}
                                name={'remarks'}
                                required
                                label="Remarks" />
                        </Grid>
                        <h3>Upload Charges Images</h3>
                        <div className='mt-4'>
                            {/* <UploadButtonWithPreview /> */}
                        </div>
                    </div>
                    <div>
                        <Button variant="contained"
                            color="secondary"
                            type="submit"
                            fullWidth>
                            Submit
                        </Button>
                    </div>
                </Box>
            </Modal></>
    )
}

export default EditChargesType
