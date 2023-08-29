import { Box, Button } from "@mui/material"
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { message } from "antd";
import { InputController } from "../../../common/form/InputController";
import { useFrappePostCall } from "frappe-react-sdk";

interface FormProp {
    customer_name: string | null,
    pan: String | null,
}

interface AddCustomerProps {
    onClose: any
    series: string
    customer: string
    callBack: Function
}

const AddCustomer = (props: AddCustomerProps) => {
    const { onClose, customer, callBack, series } = props
    const initialForm = {
        customer_name: null,
    }

    useEffect(() => {
        setValue('customer_name', customer)
    }, [customer])

    const { call, error ,loading} = useFrappePostCall('parlo.trip.addCustomer.get_or_add_series_customer')

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

            const customerInput = {
                ...value,
                series
            }

            await call({ addSeriesCustomerInput: customerInput }).then(
                (result: any) => {
                    console.log({ result: result?.message })
                    message.success('Customer added successfully')
                    callBack(result?.message)
                }
            ).catch(error => {

                const httpStatusText = error?.httpStatusText

                if (httpStatusText == 'CONFLICT') {
                    message.error('Customer already exists')
                } else {
                    message.error(error?.message)
                }
            });
    }

    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Customer</h5>
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
                        name='customer_name'
                        label='Customer Name'
                        required
                        control={control}
                        validate={validateTruck}
                        placeholder="Enter Customer Name"
                    />
                    <InputController
                        name='pan'
                        label='PAN'
                        control={control}
                        placeholder="Enter PAN"
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
        </div>
    )
}

const validateTruck = (truck: string) => {
    const truckLen = truck?.trim()?.length
    if (truckLen <= 0) {
        return "Enter valid Truck";
    }
}

export default AddCustomer;