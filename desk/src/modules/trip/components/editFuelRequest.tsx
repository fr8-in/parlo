import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { message, Modal } from "antd";
import { useFrappeUpdateDoc } from "frappe-react-sdk";
import { useForm } from "react-hook-form";
import { InputController } from "../../../common/form/InputController";
import { FuelRequestType } from "../../../lib/types/trip";

interface EditFuelRequestProps {
    fuel_record: FuelRequestType
    open: boolean;
    onClose: () => void;
    mutate:Function;
}
interface FuelEditFormType {
    litre: number;
    rate: number;
    fuel_total: number;
    cash: number;
    entry_name:string;
}
/**
 * @author Prasanth.M
 * @param props refer EditFuelRequestProps
 * @returns 
 */
const EditFuelRequest = (props: EditFuelRequestProps) => {
    const { open, onClose , fuel_record , mutate } = props

    const initialForm: FuelEditFormType = {
        litre: fuel_record.fuel_lts,
        cash: fuel_record.cash,
        fuel_total: fuel_record.fuel_amount,
        rate: fuel_record.fuel_rate,
        entry_name:fuel_record.name
    }

    const { updateDoc , loading } = useFrappeUpdateDoc()

    const { control, handleSubmit, getValues, setValue, watch } = useForm<FuelEditFormType>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    })

    //Watchers 
    const rateWatcher = watch('rate')
    const litreWatcher = watch('litre')

    //Change Hanlder
    const onChangeRateAndLitre = (onChange: Function, value: any, rate: boolean) => {
        //fuel total = litre * rate 
        onChange(value);
        let fuel_total = 0
        if (rate) {
            fuel_total = value * litreWatcher
        } else {
            fuel_total = value * rateWatcher
        }
        setValue('fuel_total', fuel_total)
    }

    const onChangeFuelTotal = ( onChange:Function , value:any ) =>{
        //litre = fuel_total / rate 
        onChange(value)
        const litre = value / rateWatcher
        setValue('litre',litre)
    }

    const onSubmit = async (value:FuelEditFormType) => {
        const variables = {
            cash : value.cash ,
            fuel_lts : value.litre,
            fuel_rate : value.rate,
            fuel_amount : value.fuel_total
        }
       await updateDoc('Trip Fuel',value.entry_name,variables).then(
            (response:any)=>{       
                message.success("Updated Successfully!")
                mutate()
                onClose()
            }
        ).catch(
            error => message.error(error?.message)
        )
    }

    return (
        <>
            <Modal
                open={open}
                onCancel={loading ? undefined : onClose}
                title="Edit Fuel Request"
                width={800}
                footer={
                    [
                        <Button
                            key={'Cancel'}
                            variant='outlined'
                            color='secondary'
                            type='submit'
                            sx={{ right: 10 }}
                            disabled={loading}
                            onClick={onClose}>Cancel</Button>,
                        <Button
                            key="submit"
                            variant='contained'
                            color='secondary'
                            form={'editFuelRequestForm'}
                            disabled={loading}
                            type='submit'>Submit</Button>
                    ]
                }
            >
                <Box margin={0}
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                    padding={2}
                    id={'editFuelRequestForm'}
                >
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 my-3'>
                        <InputController
                            name='litre'
                            label='Litre'
                            required
                            control={control}
                            handleOnChange={(onChange:Function,value:any)=>onChangeRateAndLitre(onChange,value,false)}
                        />
                        <InputController
                            name='rate'
                            label='Rate'
                            required
                            control={control}
                            handleOnChange={(onChange:Function,value:any)=>onChangeRateAndLitre(onChange,value,true)}
                        />
                        <InputController
                            name='fuel_total'
                            label='Fuel Total'
                            required
                            control={control}
                            handleOnChange={onChangeFuelTotal}
                        />
                        <InputController
                            name='cash'
                            label='Cash'
                            required
                            control={control}
                        />
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default EditFuelRequest