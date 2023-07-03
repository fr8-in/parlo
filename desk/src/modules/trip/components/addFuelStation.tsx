import { Box, Button, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { message } from "antd";

interface FormProp {
    supplier_name: string | null
    tax_id: string
}
interface ErrorProp {
    supplier_name: boolean
    tax_id: boolean
}

interface Props {
    onClose: any
    supplier_data: Array<any>
    callBack: Function
    supplier_name: string
}

/**
 * Don't use form this component coming under another form
 * Nested forms not allowed
 * @param props Refer interface
 * @returns state based Supplier add from
 */

const AddFuelStation = (props: Props) => {
    const { onClose, supplier_data, callBack, supplier_name } = props
    const initialForm = {
        supplier_name: '',
        tax_id: '',
    }

    const [form, setForm]= useState<FormProp>(initialForm)
    const initialError = { supplier_name: false, tax_id: false }
    const [error, setError] = useState<ErrorProp>(initialError)

    useEffect(() => {
        setForm({
            ...form, supplier_name })
    }, [])


    const { loading, createDoc } = useFrappeCreateDoc()

    const changeHandler = (e:any) => {
        setForm({...form, [e.target.name]: e.target.value })
        setError(initialError)
    }

    const onSubmit = async () => {
        if ((!form.supplier_name || !form.tax_id)) {
            setError({ ...error, supplier_name: form.supplier_name === '', tax_id: form.tax_id === '' })
        } else {
            try {
                await createDoc('Supplier', { ...form, supplier_group: 'Raw Material', supplier_type: 'Company' })
                callBack(form.supplier_name)
                onClose()
            } catch (error: any) {
                const httpStatusText = error?.httpStatusText
                if (httpStatusText == 'CONFLICT') {
                    message.error('Account already exists')
                } else {
                    message.error(error?.message)
                }
            }
        }
    }

    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Fuel Station</h5>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <Box
                sx={{ width: '100%', mb: 2,display:'flex' ,flex:1,flexDirection:'column',justifyContent:'space-between'}}
            >
                <div className="flex flex-col justify-between">
                    <TextField
                        required
                        name='supplier_name'
                        label='Station Name'
                        placeholder="Enter station name"
                        value={form.supplier_name}
                        onChange={changeHandler}
                        error={error.supplier_name}
                        helperText={error.supplier_name ? 'Station name required!' : ' '}
                    />
                    <TextField
                        required
                        name='tax_id'
                        label='PAN'
                        placeholder="Enter PAN"
                        onChange={changeHandler}
                        value={form.tax_id}
                        error={error.tax_id}
                        helperText={error.tax_id ? 'PAN required!' : ' '}
                    />
                </div>
                <Button
                    sx={{ width: '100%'}}
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={onSubmit}
                >Submit</Button>
            </Box>
        </div>
    )
}

export default AddFuelStation;