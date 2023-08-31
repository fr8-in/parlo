import { Modal, message } from 'antd'
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk'
import { Indent } from '../../../lib/types/indent'
import IndentTable from './indentTable'
import { Box, Button } from '@mui/material'
import { sumBy } from 'lodash'
import AddressForm from './addressForm'
import CourierForm from './courierForm'
import { useForm } from 'react-hook-form'
import constants from '../../../lib/constants'
import moment from 'moment'
import { useEffect, useState } from 'react'

interface Props {
    open: boolean
    onClose: any
    items: Array<string>
    parentMutate:Function
}

interface FormType {
    company_address_name:string
    company_address: string
    customer_address_name: string
    customer_address: string
    from_gst: string
    to_gst: string
    courier_name: string
    courier_date: string
    docket_no: string
    dispatched_by: string
    remarks: string
}

const IndentInvoice = (props: Props) => {
    const { open, onClose, items, parentMutate } = props
    const { data, isLoading, mutate } = useFrappeGetDocList<Indent>(
        'Indent',
        {
            fields: [
                "name",
                "creation",
                "owner",
                "idx",
                "series",
                "customer",
                "consignee",
                "weight",
                "cases",
                "customer_price",
                "id",
                "source",
                "destination",
                "rate_type",
                "lr_no",
                "workflow_state",
                "way_bill_no",
                "advance",
                "billable",
                "on_delivery",
                "add_charge",
                "reduce_charge",
                "received",
                "balance",
            ],
            filters: [['name', 'in', items]]
        }
    )

    const [customer, setCustomer] = useState('')

    useEffect(()=>{
        if (data && data.length > 0 && data[0].customer) {
            setCustomer(data[0].customer)
        }
    }, [data && data.length > 0 && data[0].name])

    const { call } = useFrappePostCall('parlo.trip.api.invoice.customer_invoice.customer_invoice')
    const submitInvoice = async (form: FormType) => {
        await call({
            "customer_invoice_input": {
                indent_names: items,
                company_address: form.company_address_name,
                customer_address: form.customer_address_name,
                courier: form.courier_name,
                courier_date: form.courier_name ? form.courier_date : null,
                docket_no: form.docket_no,
                dispatched_by: form.dispatched_by,
                remarks: form.remarks
            }
        }).then(
            (result: any) => {
                message.success('Invoiced successfully')
                parentMutate()
                onClose()
            }
        ).catch(error => {
            message.error(error?.message)
        })
    }

    const amount = sumBy(data, 'balance')

    const forminitial = {
        company_address_name: '',
        company_address: '',
        customer_address_name: '',
        customer_address: '',
        from_gst: '',
        to_gst: '',
        courier: '',
        courier_name: '',
        courier_date: moment().format(constants.YYYYMMDDHHmm),
        docket_no: '',
        dispatched_by: '',
        remarks: ''
    }

    const {
        control,
        handleSubmit,
        clearErrors,
        getValues,
        setValue
    } = useForm<FormType>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: forminitial
    });

    return (
        <Modal
            open={open}
            onCancel={onClose}
            maskClosable={false}
            title={<div className='flex justify-between item-center mr-10 mb-4'>
                <h5>Invoice</h5>
                <h5 className='text-blue-600'>₹{amount || 0}</h5>
            </div>}
            footer={[
                <Button key="submit" onClick={handleSubmit(submitInvoice)} form={'indentInvoice'} variant='contained' color='secondary'>Submit</Button>
            ]}
            width={1000}
        >
            <Box
                component="form"
                autoComplete="off"
                className="flex flex-col justify-between"
                id="indentInvoice"
            >
                <div className='grid grid-cols-1 md:grid-cols-2 my-2 gap-2'>
                    <AddressForm control={control} setValue={setValue} customer={customer} clearErrors={clearErrors} />
                    <CourierForm control={control} getValues={getValues} setValue={setValue} />
                </div>
            </Box>
            <IndentTable mutate={mutate} data={data} loading={isLoading} tabKey='Delivered' />
        </Modal>
    )
}

export default IndentInvoice
