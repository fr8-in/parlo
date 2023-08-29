
import { Button, Grid, useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { message, Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { InputController } from '../../../common/form/InputController'
import { useShowHide } from '../../../lib/hooks'
import SelectChargeType from '../../../common/select/selectChargeType'
import UploadButtonWithPreview from '../../../common/uploadButtonWithPreview'
import { useFrappeCreateDoc } from 'frappe-react-sdk'

interface FormProps {
    charge_type: string
    supplier_amount: any
    remarks: string
}
const initialForm = {
    charge_type: "",
    supplier_amount: null,
    remarks: ""
}

interface Props {
    callBack: Function
    onClose: any
    tripName: any
    open: boolean
    is_reduce?: boolean
    fromIndent?:boolean
    indentName?:string
}

const AddCharges = (props: Props) => {

    const { onClose, tripName, open, callBack, is_reduce , fromIndent , indentName} = props;

    const { control, handleSubmit, getValues, setValue } = useForm<FormProps>({
            mode: "onChange",
            reValidateMode: "onChange",
            defaultValues: initialForm
        })

    const initial = {
        showChargeType: false
    };
    const { visible, onHide, onShow } = useShowHide(initial);

    const handleSeries = (value: any) => {
        setValue("charge_type", value);
    };

    const { createDoc } = useFrappeCreateDoc()

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const common = { maxWidth: 800, margin: '0 auto' }
    const desktop = { ...common, top: 20 }
    const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }

    const onSubmit = async () => {
        const chargeInput = {
            charge_type: getValues("charge_type"),
            supplier_amount: is_reduce ? -getValues("supplier_amount") : getValues("supplier_amount"),
            remarks: getValues("remarks"),
            trip: tripName
        }

        const indentChargeInput = {
            charge_type: getValues("charge_type"),
            amount: is_reduce ? -getValues("supplier_amount") : getValues("supplier_amount"),
            remarks: getValues("remarks"),
            indent: indentName
        }

        //This is a shared component 
        //If its from indent then charges will be added to Indent Charge else to Trip Charge.
        if(fromIndent){
            await createDoc( 'Indent Charge List', indentChargeInput)
            .then(res =>{ 
                message.success("New Charges Added!")
                onClose()
                callBack()
            })
            .catch(error => {
                message.error(error?.message)
                onClose()
                callBack()
            })
        }else{
            await createDoc( 'Trip Charge', chargeInput)
            .then(res =>{ 
                message.success("New Charges Added!")
                onClose()
                callBack()
            })
            .catch(error => {
                message.error(error?.message)
                onClose()
                callBack()
            })
        }
    }

    return (

        <Modal
            open={open}
            title={is_reduce ? "Reduce Charge" : "Add Charge"}
            footer={null}
            style={isMobile ? mobile : desktop}
            width={isMobile ? '100%' : '60%'}
            onCancel={onClose}

            className="mobile_overlay"
        >
            <Box margin={0}
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >

                <div className='mt-6' >
                    <Grid container columnSpacing={1}>

                        <InputController
                            control={control}
                            name={'charge_type'}
                            required
                            endIcon="select"
                            handleClick={() => onShow("showChargeType")}
                            label="Charge Type" />


                        <InputController
                            control={control}
                            name={'supplier_amount'}
                            required
                            label={fromIndent ? "Amount" : "Supplier Amount"}/>

                        <InputController
                            control={control}
                            name={'remarks'}
                            required
                            label="Remarks" />
                    </Grid>
                    {/* <h3>Upload Charges Images</h3>
                    <div className='mt-4'>
                        <UploadButtonWithPreview />
                    </div> */}
                </div>
                <div>
                    <Button variant="contained"
                        color="secondary"
                        type="submit"
                        fullWidth>
                        Submit
                    </Button>
                    {visible.showChargeType ?
                        <SelectChargeType callBack={handleSeries} open={visible.showChargeType} onClose={onHide} onOpen={() => onShow("showChargeType")} />
                        : null}
                </div>
            </Box>
        </Modal>
    )
}

export default AddCharges
