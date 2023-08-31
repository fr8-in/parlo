import { Modal, message } from 'antd'
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk'
import { Button } from '@mui/material'
import InvoiceTable from './invoiceTable'
import { get, groupBy, isEmpty, sumBy } from 'lodash'
import BookPaymentForm from '../../../common/bookPaymentForm'
import { useEffect, useState } from 'react'
import util from '../../../lib/utils'
import moment from 'moment'

interface Props {
    open: boolean
    onClose: any
    items: Array<string>
}

interface SIT_TYPE {
    supplier_invoice: string
    id: string
    name: string
    balance: number
}

const BookBalance = (props: Props) => {
    const { open, onClose, items } = props

    const [amount, setAmount] = useState(0)
    const [customer, setCustomer] = useState<string>('')

    const { data, isValidating, mutate } = useFrappeGetDocList<any>(
        'Customer Invoice', {
        fields: ['*'],
        filters: [["name", "in", items]],
    })

    const { data: cii_data } = useFrappeGetDocList<SIT_TYPE>(
        'Customer Invoice Indent',
        {
            fields: [
                "customer_invoice",
                "indent.id",
                "indent.name",
                "indent.balance",
                "indent.received_at"
            ],
            filters: [['customer_invoice', 'in', items]]
        }
    )

    useEffect(()=>{
        setAmount(sumBy(cii_data, 'balance'))
        setCustomer(get(data, '[0].customer', null))
    }, [!isEmpty(cii_data) && get(cii_data, '[0].name', null), !isEmpty(data) && get(data, '[0].name', null)])

    const group_cii = groupBy(cii_data, 'customer_invoice')
    const invoices = Object.entries(group_cii)?.map(([key, value]: any) => {
        return ({
            invoice_name: key,
            indents: value?.filter((_v: any) => _v.received_at === null)?.map((_v: any) => ({ id: _v.id, name: _v.name, amount: _v.balance, write_off: 0 }))
        })
    })

    const { call } = useFrappePostCall('parlo.trip.api.invoice.customer_balance_payment.customer_balance_payment')

    const submitInvoice: any = async (form: any) => {
        await call({
            balance_payment_input: {
                payment_mode: form.mode,
                remarks: form.remorks || "",
                date: util.epr_date_time(moment(form.date)),
                ref_no: form.ref_no,
                company_bank: form.company_bank,
                invoices: invoices,
                customer
            }
        }).then(
            (result: any) => {
                message.success('Booked successfully')
                onClose()
                mutate()
            }
        ).catch((error:any) => {
            message.error(error?.message)
        }) 
    }

    return (
        <Modal
            open={open}
            title={<div className='flex justify-between item-center mr-10 mb-4'>
                <h5>Indent Balance Booking</h5>
                <h5 className='text-blue-600'>₹{amount || 0}</h5>
                </div>}
            footer={[
                <Button
                    key="submit"
                    variant='contained'
                    color='secondary'
                    form={'invoiceBalanceBooking'}
                    type='submit'
                >Submit</Button>
            ]}
            onCancel={onClose}
            width={1000}
        >
            <div className='mt-10 mb-4'>
            <BookPaymentForm id="invoiceBalanceBooking" onSubmit={submitInvoice} />
            <InvoiceTable dataSource={data} is_model />
            </div>
        </Modal>
    )
}

export default BookBalance
