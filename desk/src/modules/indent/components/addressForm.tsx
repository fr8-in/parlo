import React from 'react'
import { InputController } from '../../../common/form/InputController'
import { useShowHide } from '../../../lib/hooks'
import SelectCompanyAddress, { CompanyAddressType } from '../../../common/select/selectCompanyAddress'
import SelectCustomerAddress from '../../../common/select/selectCustomerAddress'

interface Props {
    control: any
    setValue:Function
    customer:string
    clearErrors: Function
}
const AddressForm = (props: Props) => {
    const { control, setValue, customer, clearErrors } = props
    const initial = { showFrom: false, showTo: false }
    const { visible, onHide, onShow } = useShowHide(initial)

    const handleCompanyAddress = (value: CompanyAddressType) => {
        setValue('company_address', value.address)
        setValue('company_address_name', value.name)
        setValue('from_gst', value.gst)
        clearErrors()
        onHide()
    }
    const handleCustomerAddress = (value: CompanyAddressType) => {
        setValue('customer_address', value.address)
        setValue('customer_address_name', value.name)
        setValue('to_gst', value.gst)
        clearErrors()
        onHide()
    }

    return (
        <div>
            <h5 className='mb-2'>Address</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-2'>
                <InputController
                    name="company_address"
                    endIcon='select'
                    control={control}
                    placeholder='Select From'
                    label="From"
                    required
                    handleClick={() => onShow('showFrom')}
                />
                <InputController
                    name="from_gst"
                    control={control}
                    disable
                    label="GSTIN"
                />
                <InputController
                    name="customer_address"
                    endIcon='select'
                    control={control}
                    required
                    placeholder='Select To'
                    label="To"
                    handleClick={() => onShow('showTo')}
                />
                <InputController
                    name="to_gst"
                    control={control}
                    disable
                    label="GSTIN"
                />
            </div>
            {visible.showFrom ? (
                <SelectCompanyAddress
                    open={visible.showFrom}
                    onClose={onHide}
                    onOpen={() => onShow('showFrom')}
                    callBack={handleCompanyAddress}
                />
            ) : null}
            {visible.showTo ? (
                <SelectCustomerAddress
                    open={visible.showTo}
                    onClose={onHide}
                    onOpen={() => onShow('showTo')}
                    callBack={handleCustomerAddress}
                    customer={customer}
                />
            ) : null}
        </div>
    )
}

export default AddressForm
