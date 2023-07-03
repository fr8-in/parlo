import { Box, Button } from "@mui/material"
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { message } from "antd";
import { InputController } from "../../../common/form/InputController";
import { useFrappePostCall } from "frappe-react-sdk";
import { useShowHide } from "../../../lib/hooks";
import SelectCity from "../../../common/selectCity";

interface FormProp {
    consignee_name: string | null,
    pan: String | null,
    city: String | null,
    contact: string | null,
    pincode: number | null,
    company_code: string | null
}

interface AddConsigneeProps {
    onClose: any
    customer: string
    consignee: string
    callBack: Function
}

const AddConsignee = (props: AddConsigneeProps) => {
    const { onClose, customer, consignee, callBack } = props

    const initialForm = {
        consignee_name: null,
        city: null,
        contact: null,
        pincode: null,
        company_code: null
    }

    const { call, error, loading } = useFrappePostCall('parlo.trip.addConsignee.get_or_add_customer_consignee')

    useEffect(() => {
        setValue('consignee_name', consignee)
    }, [customer])

    const {
        control,
        handleSubmit,
        setValue
    } = useForm<FormProp>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });


    const onSubmit = async (value: any) => {

        const consigneeInput ={
            ...value,
            customer
        }

        console.log({consigneeInput});
        
        await call({ addCustomerConsigneeInput: consigneeInput }).then(
            (result: any) => {
                console.log({ result: result?.message })
                message.success('Consignee added successfully')
                callBack(result?.message)
            }
        ).catch(error => {

            const httpStatusText = error?.httpStatusText

            if (httpStatusText == 'CONFLICT') {
                message.error('Consignee already exists')
            } else {
                message.error(error?.message)
            }
        });

    }

    const initial_show_hide = {
        showCity: false,
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    const onSelectCity = (city:any) => {
        console.log({city});
        setValue('city', city?.name)
    }


    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Consignee</h5>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: '100%', mb: 2, display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}
            >
                <div className="flex flex-col justify-between">
                    <InputController
                        name='consignee_name'
                        label='Consignee Name'
                        required
                        tabIndex={"1"}
                        control={control}
                        validate={validateName}
                        placeholder="Enter Consignee Name"
                    />
                    <InputController
                        name='company_code'
                        label='Company code'
                        control={control}
                        tabIndex={"2"}
                        placeholder="Enter company code"
                    />                    
                    <InputController
                        name='pan'
                        label='PAN'
                        upperCase
                        validate={panValidator}
                        control={control}
                        tabIndex={"3"}
                        placeholder="Enter PAN"
                    />
                    <InputController
                        name='contact'
                        label='Mobile'
                        control={control}
                        placeholder="Enter mobile"
                    />
                    <InputController
                        name='city'
                        label='City'
                        control={control}
                        endIcon={"select"}
                        handleClick={() => onShow("showCity")}
                        placeholder="Select City"
                    />            

                    <InputController
                        name='pincode'
                        label='Pincode'
                        control={control}
                        placeholder="Enter pincode"
                    />            

                </div>
                <Button
                    sx={{ width: '100%' }}
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    type="submit"
                >Submit</Button>
            </Box>
            {visible.showCity ? (
                <SelectCity
                    onClose={onHide}
                    open={visible.showCity}
                    onOpen={() => onShow('showCity')}
                    placeholder="Search Source (Min 3 Letters)"
                    callBack={onSelectCity}
                />
            ) : null}
        </div>
    )
}

const validateName = (truck: string) => {
    const truckLen = truck?.trim()?.length
    if (truckLen <= 0) {
        return "Enter valid name";
    }
}

export default AddConsignee;


export const panValidator = (panNo: string) => {
    let regex = new RegExp(/^[A-Za-z]{5}\d{4}[A-Za-z]$/)
    if (regex.test(panNo) == false && panNo) {
        return "Enter valid PAN Number";
    }
}