import { Box, Button } from "@mui/material"
import { InputController } from "../../../common/form/InputController";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import SelectRateType from "../../../common/select/selectRateType";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { message } from "antd";
import { useShowHide } from "../../../lib/hooks";

interface FormProp {
    truck_no: string | null,
    truck_type: string | null
    category: string
}

interface AddTruckProps {
    onClose: any
    truck_no: string
    callBack: Function
}

const AddTruck = (props: AddTruckProps) => {
    const { onClose, truck_no, callBack } = props
    const initialForm = {
        truck_no: null,
        truck_type: null,
        category: "Market"
    }

    const initial_show_hide = {
        showTruckType: false,
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    useEffect(() => {
        setValue('truck_no', truck_no)
    }, [truck_no])

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        clearErrors,
    } = useForm<FormProp>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    const { loading, createDoc } = useFrappeCreateDoc()

    const onChangeTruckType = (truckType: any) => {
        setValue('truck_type', truckType?.name)
        clearErrors()
    }

    const onSubmit = async (value: any) => {
        try {
            createDoc('Truck', {
                number: value.truck_no?.toUpperCase(),
                truck_type: value.truck_type,
                category: 'Market',
                truck_status:'Waiting for load'
            })
            callBack({ number: value.truck_no, truck_type: value.truck_type })
        } catch (error: any) {

            const httpStatusText = error?.httpStatusText

            if (httpStatusText == 'CONFLICT') {
                message.error('Truck already exists')
            } else {
                message.error(error?.message)
            }
        }

    }

    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Truck</h5>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: '100%', mb: 2,display:'flex' ,flex:1,flexDirection:'column',justifyContent:'space-between'}}
            >
                <div className="flex flex-col justify-between">
                    <InputController
                        name='truck_no'
                        label='Truck No'
                        required
                        upperCase
                        control={control}
                        validate={validateTruck}
                        placeholder="Enter Truck No"
                    />
                    <InputController
                        required
                        name='truck_type'
                        label='Truck Type'
                        control={control}
                        handleClick={() => onShow('showTruckType')}
                        placeholder="Select Truck Type"
                    />
                    <InputController
                        required
                        name='category'
                        label='Category'
                        control={control}
                        disable
                    />
                </div>

                <Button
                    sx={{ width: '100%'}}
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    type="submit"
                >Submit</Button>
            </Box>
            {
                visible.showTruckType ? <SelectRateType isTruck={true} callBack={onChangeTruckType} open={visible.showTruckType} onClose={onHide} onOpen={() => onShow("showTruckType")} selected={getValues('truck_type')} /> : null
            }
        </div>
    )
}

const validateTruck = (truck: string) => {
    const truckLen = truck?.trim()?.length

    if (truckLen <= 0) {
        return "Enter valid Truck";
    }
}

export default AddTruck;