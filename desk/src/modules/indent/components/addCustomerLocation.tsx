import { Box, Button } from "@mui/material"
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { message } from "antd";
import { InputController } from "../../../common/form/InputController";
import { useShowHide } from "../../../lib/hooks";
import SelectCity from "../../../common/selectCity";
import { useFrappePostCall } from "frappe-react-sdk";

interface FormProp {
    name: string | null,
    city: String | null,
}

interface AddCustomerProps {
    onClose: any
    customer: string
    customerLocation: string
    callBack: Function
}

const AddCustomerLocation = (props: AddCustomerProps) => {
    const { onClose, customer, callBack, customerLocation } = props
    const initialForm = {
        name: null,
        city: null
    }

    const { call, error, loading } = useFrappePostCall('parlo.trip.addCustomerLocation.get_or_add_customer_location')

    useEffect(() => {
        setValue('name', customerLocation)
    }, [customerLocation])

    const {
        control,
        handleSubmit,
        setValue
    } = useForm<FormProp>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    const onSelectCity = (city: any) => {
        console.log({ city });
        setValue('city', city?.name)

    }

    const onSubmit = async (value: any) => {
        console.log({ value });
        const customerLocationInput = {
            ...value,
            customer
        }

        await call({ addCustomerLocationInput: customerLocationInput }).then(
            (result: any) => {
                console.log({ result: result?.message })
                message.success('Customer Location added successfully')
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

    const initial_show_hide = {
        showAddCustomerLocation: false,
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)


    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Customer Location</h5>
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
                        name='name'
                        label='Name'
                        required
                        control={control}
                        placeholder="Enter Location Name"
                    />
                    <InputController
                        name='city'
                        label='Select City'
                        endIcon={"select"}
                        placeholder="Select city"
                        control={control}
                        required
                        handleClick={() => onShow("showCity")}
                    />
                </div>
                <Button
                    sx={{ width: '100%' }}
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={loading}
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


export default AddCustomerLocation;