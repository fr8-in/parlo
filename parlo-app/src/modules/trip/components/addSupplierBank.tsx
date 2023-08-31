import { Box, Button, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import { message } from "antd";

interface FormProp {
    supplier: string | null,
    account_no: string | null
    ifsc_code: string
    beneficinary: string
    is_primary: boolean
}
interface ErrorProp {
    account_no: boolean
    ifsc_code: boolean
    beneficinary: boolean
}

interface Props {
    onClose: any
    bank_data: Array<any>
    callBack: Function
    supplier_name: string
    account_no: string
}

/**
 * Don't use form this component coming under another form
 * Nested forms not allowed
 * @param props Refer interface
 * @returns state based Supplier bank add from
 */

const AddSupplierBank = (props: Props) => {
    const { onClose, bank_data, callBack, supplier_name, account_no } = props
    const initialForm = {
        supplier: '',
        account_no: '',
        ifsc_code: '',
        beneficinary: '',
        is_primary: false
    }

    const [form, setForm]= useState<FormProp>(initialForm)
    const initialError = { account_no: false, ifsc_code: false, beneficinary:false }
    const [error, setError] = useState<ErrorProp>(initialError)

    useEffect(() => {
        setForm({
            ...form, supplier: supplier_name, is_primary: !bank_data?.length, account_no })
    }, [])


    const { loading, createDoc } = useFrappeCreateDoc()

    const changeHandler = (e:any) => {
        setForm({...form, [e.target.name]: e.target.value })
        setError(initialError)
    }

    const onSubmit = async() => {
        if ((!form.account_no || !form.ifsc_code || !form.beneficinary)) {
            setError({ ...error, account_no: form.account_no === '', ifsc_code: form.ifsc_code === '', beneficinary: form.beneficinary === '' })
        } else {
            try {
                await createDoc('Supplier Bank', form)
                callBack({name:form.account_no})
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
                <h5 className="font-bold">Add Supplier Bank</h5>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <Box
                sx={{ width: '100%', mb: 2,display:'flex' ,flex:1,flexDirection:'column',justifyContent:'space-between'}}
            >
                <div className="flex flex-col justify-between">
                    <TextField
                        name='supplier'
                        label='Supplier'
                        value={form.supplier}
                        required
                        disabled
                        helperText={' '}
                    />
                    <TextField
                        required
                        name='account_no'
                        label='Account No'
                        placeholder="Enter account no"
                        value={form.account_no}
                        onChange={changeHandler}
                        error={error.account_no}
                        helperText={error.account_no ? 'Account no required!' : ' '}
                    />
                    <TextField
                        required
                        name='ifsc_code'
                        label='IFSC'
                        placeholder="Enter IFSC"
                        onChange={changeHandler}
                        value={form.ifsc_code}
                        error={error.ifsc_code}
                        helperText={error.ifsc_code ? 'IFSC required!' : ' '}
                    />
                    <TextField
                        required
                        name='beneficinary'
                        label='Beneficinary'
                        onChange={changeHandler}
                        placeholder="Enter beneficinary"
                        value={form.beneficinary}
                        error={error.beneficinary}
                        helperText={error.beneficinary ? 'Beneficinary required!' : ' '}
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

export default AddSupplierBank;