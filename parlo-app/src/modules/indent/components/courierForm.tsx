import React from 'react'
import { InputController } from '../../../common/form/InputController'
import { useShowHide } from '../../../lib/hooks'
import SelectDate from '../../../common/select/selectDate'
import moment from 'moment'
import constants from '../../../lib/constants'
import SelectCourier from '../../../common/select/selectCourier'
import SelectUser from '../../../common/select/selectUser'

interface Props {
    control: any
    getValues:Function
    setValue:Function
}
const CourierForm = (props:Props) => {
    const { control, getValues, setValue } = props
    const initial = { showDate: false, showCourier: false, showUser: false }
    const { visible, onShow, onHide} = useShowHide(initial)

    const onDateChange = (date: any) => {
        setValue("courier_date", moment(date).format(constants.DDMMMYYHHmm));
    };

    const handleCourierChange = (value: any) => {
        setValue('courier_name', value.name)
        onHide()
    }
    const handleUserChange = (value: any) => {
        setValue('dispatched_by', value.name)
        onHide()
    }

    return (
        <div>
            <h5 className='mb-2'>Address</h5>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2'>
                <InputController
                    name='courier_date'
                    label='Date'
                    control={control}
                    handleClick={() => onShow("showDate")}
                    endIcon={"calendar"}
                />
                <InputController
                    name="courier_name"
                    endIcon='select'
                    control={control}
                    placeholder='Select courier'
                    label="Courier"
                    handleClick={() => onShow("showCourier")}
                />
                <InputController
                    name="docket_no"
                    control={control}
                    placeholder='Enter docket no'
                    label="Docket No"
                />
                <InputController
                    name="dispatched_by"
                    endIcon='select'
                    control={control}
                    placeholder='Select dispatched by'
                    label="Dispatched By"
                    handleClick={() => onShow("showUser")}
                />
                <div className='col-span-1 sm:col-span-2'>
                <InputController
                    name={'remarks'}
                    label='Remarks'
                    multiline
                    placeholder="Enter remarks"
                    control={control}
                /></div>
            </div>
            {visible.showDate ? (
                <SelectDate
                    onOpen={() => onShow('showDate')}
                    onClose={onHide}
                    dateTime={getValues("courier_date")}
                    callBack={onDateChange}
                    open={visible.showDate} />
            ) : null}
            {visible.showCourier ? (
                <SelectCourier
                    open={visible.showCourier}
                    onClose={onHide}
                    onOpen={() => onShow('showCourier')}
                    callBack={handleCourierChange}
                />
            ) : null}
            {visible.showUser ? (
                <SelectUser
                    open={visible.showUser}
                    onClose={onHide}
                    onOpen={() => onShow('showUser')}
                    callBack={handleUserChange}
                />
            ) : null}
        </div>
    )
}

export default CourierForm