import { Box, Button, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { message } from "antd";

interface FormProp {
    address: string
    pan: string
    gst: string
    short_name: string
}
interface ErrorProp {
    address: boolean
    pan: boolean
    gst: boolean
    short_name: boolean
}

interface Props {
    onClose: any
    callBack: Function
    name: string
    mutate: Function
}

/**
 * Don't use form this component coming under another form
 * Nested forms not allowed
 * @param props Refer interface
 * @returns state based Add Company Address form
 */

const AddCompanyAddress = (props: Props) => {
    const { onClose, callBack, name, mutate } = props
    const initialForm: FormProp = {
        address: '',
        pan: '',
        gst: '',
        short_name: ''
    }

    const [form, setForm]= useState<FormProp>(initialForm)
    const initialError:ErrorProp = { address: false, pan: false, gst:false, short_name: false }
    const [error, setError] = useState<ErrorProp>(initialError)

    useEffect(()=>{
        setForm({...form, short_name:name})
    },[])


    const { loading, createDoc } = useFrappeCreateDoc()

    const changeHandler = (e:any) => {
        setForm({...form, [e.target.name]: e.target.value })
        setError(initialError)
    }

    const onSubmit = async () => {
        if ((!form.address || !form.pan || !form.gst || !form.short_name)) {
            setError({ ...error, address: form.address === '', pan: form.pan === '', gst: form.gst === '', short_name: form.short_name === '' })
        } else {
            try {
               await createDoc('Company Address', form)
                callBack(form)
                mutate()
            } catch (error: any) {
                const httpStatusText = error?.httpStatusText
                if (httpStatusText == 'CONFLICT') {
                    message.error('Address already exists')
                } else {
                    message.error(error?.message)
                }
            }
        }
    }

    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Company Address</h5>
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
                        name='address'
                        label='Address'
                        placeholder="Enter address"
                        value={form.address}
                        onChange={changeHandler}
                        error={error.address}
                        helperText={error.address ? 'Address required!' : ' '}
                    />
                    <TextField
                        required
                        name='pan'
                        label='PAN'
                        placeholder="Enter PAN"
                        onChange={changeHandler}
                        value={form.pan}
                        error={error.pan}
                        helperText={error.pan ? 'PAN required!' : ' '}
                    />
                    <TextField
                        required
                        name='gst'
                        label='GSTIN'
                        onChange={changeHandler}
                        placeholder="Enter GSTIN"
                        value={form.gst}
                        error={error.gst}
                        helperText={error.gst ? 'GSTIN required!' : ' '}
                    />
                    <TextField
                        required
                        name='short_name'
                        label='Name'
                        onChange={changeHandler}
                        placeholder="Enter name"
                        value={form.short_name}
                        error={error.short_name}
                        helperText={error.short_name ? 'Name required!' : ' '}
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

export default AddCompanyAddress;
