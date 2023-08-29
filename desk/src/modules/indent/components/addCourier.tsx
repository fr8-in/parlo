import { Box, Button, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { message } from "antd";

interface FormProp {
    name: string
}
interface ErrorProp {
    name: boolean
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
 * @returns state based Add Courier from
 */

const AddCourier = (props: Props) => {
    const { onClose, callBack, name, mutate } = props
    const initialForm: FormProp = {
        name: ''
    }

    const [form, setForm]= useState<FormProp>(initialForm)
    const initialError:ErrorProp = { name: false }
    const [error, setError] = useState<ErrorProp>(initialError)

    useEffect(()=>{
        setForm({...form, name:name})
    },[])


    const { loading, createDoc } = useFrappeCreateDoc()

    const changeHandler = (e:any) => {
        setForm({...form, [e.target.name]: e.target.value })
        setError(initialError)
    }

    const onSubmit = async () => {
        if (!form.name) {
            setError({ ...error, name: form.name === '' })
        } else {
            try {
               await createDoc('Courier', {name1:form.name})
                callBack(form)
                mutate()
            } catch (error: any) {
                const httpStatusText = error?.httpStatusText
                if (httpStatusText == 'CONFLICT') {
                    message.error('Courier name already exists')
                } else {
                    message.error(error?.message)
                }
            }
        }
    }

    return (
        <div className="p-3 pt-0 gap-3 h-full">
            <div className="flex justify-between items-center h-16 gap-3 mb-4">
                <h5 className="font-bold">Add Courier</h5>
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
                        name='name'
                        label='Name'
                        placeholder="Enter name"
                        value={form.name}
                        onChange={changeHandler}
                        error={error.name}
                        helperText={error.name ? 'Name required!' : ' '}
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

export default AddCourier;