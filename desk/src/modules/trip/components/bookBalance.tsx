import { Modal, message } from 'antd'
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk'
import { Button } from '@mui/material'
import InvoiceTable from './invoiceTable'
import { get, groupBy, isEmpty, sumBy } from 'lodash'
import { PaymentType } from './initialForm'
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
    const [supplier, setSupplier] = useState('')

    const { data, mutate } = useFrappeGetDocList<any>(
        'Supplier Invoice', {
        fields: ['*'],
        filters: [["name", "in", items]],
    })

    const { data: sit_data } = useFrappeGetDocList<SIT_TYPE>(
        'Supplier Invoice Trip',
        {
            fields: [
                "supplier_invoice",
                "trip.id",
                "trip.name",
                "trip.balance",
                "trip.paid_at"
            ],
            filters: [['supplier_invoice', 'in', items]]
        }
    )

    useEffect(()=>{
        setAmount(sumBy(sit_data, 'balance'))
        setSupplier(get(data, '[0].supplier', null))
    }, [!isEmpty(sit_data) && get(sit_data, '[0].name', null), !isEmpty(data) && get(data, '[0].name', null)])

    const group_sit = groupBy(sit_data, 'supplier_invoice')
    const invoices = Object.entries(group_sit)?.map(([key, value]: any) => {
        return ({
            invoice_name: key,
            trips: value?.filter((_v: any) => _v.paid_at === null)?.map((_v: any) => ({ id: _v.id, name: _v.name, amount: _v.balance }))
        })
    })

    const { call } = useFrappePostCall('parlo.trip.api.invoice.supplier_balance_payment.supplier_balance_payment')

    const submitInvoice: any = async (form: PaymentType) => {
        await call({
            balance_payment_input: {
                payment_mode: form.mode,
                remarks: form.remorks || "",
                date: util.epr_date_time(moment(form.date)),
                ref_no: form.ref_no,
                supplier_bank: form.supplier_bank,
                company_bank: form.company_bank,
                invoices: invoices
            }
        }).then(
            (_: any) => {
                message.success('Booked successfully')
                mutate()
                onClose()
            }
        ).catch(error => {
            message.error(error?.message)
        }) 
    }

    return (
        <Modal
            open={open}
            title={<div className='flex justify-between item-center mr-10 mb-4'>
                <h5>Trip Balance Booking</h5>
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
            <div className='my-4'>
            <BookPaymentForm id="invoiceBalanceBooking" onSubmit={submitInvoice} supplier={supplier} />
            <InvoiceTable dataSource={data} is_model />
            </div>
        </Modal>
    )
}

export default BookBalance
