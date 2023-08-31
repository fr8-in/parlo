import { Box, Button } from "@mui/material"
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { message } from "antd";
import { InputController } from "../../../common/form/InputController";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import SelectState from "../../../common/selectState";
import { useShowHide } from "../../../lib/hooks";

interface FormProp {
    city: string | null,
    state: String | null,
}

interface AddCityProps {
    onClose: any
    city: string
    callBack: Function
}

const AddCity = (props: AddCityProps) => {
    const { onClose, city, callBack } = props
    const initialForm = {
        city: null,
        state: null
    }

    useEffect(() => {
        setValue('city', city)
    }, [city])


    const {
        control,
        handleSubmit,
        setValue
    } = useForm<FormProp>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    const { loading, createDoc, error, isCompleted, reset } = useFrappeCreateDoc()

    const onSelectState = (state: any) => {
        console.log({ state });
        setValue('state', state?.name)
    }


    const onSubmit = async (value: FormProp) => {

        const cityInput = {
            "name1": value.city,
            "state": value.state
        }

        await createDoc('City', cityInput).then((res:any) => {
            message.success("City created successfully")
            console.log({res});
            
            callBack(res)
        }).catch(error => {

            const httpStatusText = error?.httpStatusText

            if (httpStatusText == 'CONFLICT') {
                message.error('Consignee already exists')
            } else {
                message.error(error?.message)
            }
        })



    }

    const initial_show_hide = {
        showCity: false,
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)


    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add City</h5>
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
                        name='city'
                        label='City Name'
                        required
                        control={control}
                        placeholder="Enter City Name"
                    />
                    <InputController
                        name='state'
                        label='State'
                        required
                        endIcon="select"
                        control={control}
                        placeholder="Enter State"
                        handleClick={() => onShow("showState")}
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

            {visible.showState ? (
                <SelectState
                    onClose={onHide}
                    open={visible.showState}
                    onOpen={() => onShow('showState')}
                    placeholder="Search Source (Min 3 Letters)"
                    callBack={onSelectState}
                />
            ) : null}
        </div>
    )
}

export default AddCity;