import React from 'react'
import { Modal, message } from 'antd'
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk'
import { Trip } from '../../../lib/types/trip'
import TripTable from './tripTable'
import { Button } from '@mui/material'
import { sumBy } from 'lodash'

interface Props {
    open: boolean
    onClose: any
    items: Array<string>
}

const Invoice = (props: Props) => {
    const { open, onClose, items } = props

    const { data, mutate } = useFrappeGetDocList<Trip>(
        'Trip',
        {
            fields: [
                "cases",
                "confirmed_at",
                "creation",
                "destination",
                "driver",
                "id",
                "idx",
                "modified",
                "modified_by",
                "name",
                "owner",
                "series",
                "source",
                "supplier",
                "truck",
                "supplier_price",
                "weight",
                "workflow_state",
                "add_charge",
                "reduce_charge",
                "paid",
                "balance",
            ],
            filters: [['name', 'in', items]]
        }
    )

    const { call } = useFrappePostCall('parlo.trip.api.invoice.supplier_invoice.supplier_invoice')
    const submitInvoice = async () => {
        await call({ "supplier_invoice_input": { "trip_names": items } }).then(
            (result: any) => {
                message.success('Invoiced successfully')
                mutate()
                onClose()
            }
        ).catch(error => {
            message.error(error?.message)
        })
    }

    const amount = sumBy(data,'balance')

    return (
        <Modal
            open={open}
            title={<div className='flex justify-between item-center mr-10 mb-4'>
                <h5>Invoice</h5>
                <h5 className='text-blue-600'>₹{amount || 0}</h5>
            </div>}
            footer={[
                <Button key="submit" onClick={submitInvoice} variant='contained' color='secondary'>Submit</Button>
            ]}
            onCancel={onClose}
            className="mobile_overlay"
            width={900}
        >
            <TripTable dataSource={data} hide_filters />
        </Modal>
    )
}

export default Invoice
