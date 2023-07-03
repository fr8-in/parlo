import { Box } from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PaymentType } from '../modules/trip/components/initialForm'
import { InputController } from './form/InputController'
import { useShowHide } from '../lib/hooks'
import SelectDate from './select/selectDate'
import moment from 'moment'
import constants from '../lib/constants'
import SelectController from './form/selectController'
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk'
import SelectSupplierBank from './select/selectSupplierBank'
import SelectCompanyBank from './select/selectCompanyBank'

interface Props {
    id: string
    onSubmit: SubmitHandler<PaymentType>,
    supplier?: string
    disableMode?:boolean;
    hideSupplierBank?:boolean;
    company_bank?:string;
}
const BookPaymentForm = (props: Props) => {
    const { id, onSubmit, supplier = '' , disableMode , hideSupplierBank , company_bank} = props
    const initial_show_hide = {
        showDate: false,
        showSupplierBank: false,
        showCompanyBank: false
    }
    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    const customerFilter: Filter[] = supplier?.length >= 3 ? [] : [['name', '!=', `CPS`]]
    const { data } = useFrappeGetDocList('Payment Mode', { fields: ["*"], filters: [...customerFilter] })
    const options = data?.map((fs: any) => ({ value: fs.name, label: fs.name }))

    const { data: bank } = useFrappeGetDocList<any>('Supplier Bank', {
        fields: ["*"],
        filters: [["supplier", '=', supplier]]
    })

    const primary = bank?.find((s_bank: any) => s_bank.is_primary)?.name

    const initialForm: PaymentType = {
        mode: "Bank",
        date: moment().format(constants.DDMMMYYHHmm),
        company_bank: company_bank || '',
        supplier_bank: '',
        ref_no: '',
        remorks: '',
        amount: null
    }
    const
        { control,
            handleSubmit,
            getValues,
            setValue,
            watch } = useForm<PaymentType>({
                mode: "onChange",
                reValidateMode: "onChange",
                defaultValues: initialForm
            })

    const onDateChange = (date: any) => {
        console.log({ date, format: moment(date).format(constants.DDMMMYYHHmm) })
        setValue("date", moment(date).format(constants.DDMMMYYHHmm));
    };

    return (
        <>
            <Box margin={0}
                component="form"
                autoComplete="off"
                id={id}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                    <InputController
                        name='date'
                        label='Date'
                        required
                        control={control}
                        handleClick={() => onShow("showDate")}
                        endIcon={"calendar"}
                    />
                    <SelectController
                        control={control}
                        name={'mode'}
                        select_option={options}
                        placeholder="Select Mode"
                        label="Mode"
                        required
                        disable={disableMode}
                    />
                    {watch('mode') === 'Bank' ?
                        <>
                            <InputController
                                control={control}
                                name={'company_bank'}
                                handleClick={() => onShow('showCompanyBank')}
                                placeholder="Select company a/c"
                                label="Company Bank"
                                required={watch('mode') === 'Bank'}
                            />
                            {supplier ? <InputController
                                control={control}
                                name={'supplier_bank'}
                                handleClick={() => onShow('showSupplierBank')}
                                placeholder="Select supplier a/c"
                                label="Supplier Bank"
                                required={hideSupplierBank ? false : watch('mode') === 'Bank'}
                                hidden={hideSupplierBank}
                            /> : null}
                            <InputController
                                name={'ref_no'}
                                label='Ref. No'
                                placeholder="Enter reference no"
                                required
                                control={control}
                            />
                        </>
                        : null}
                    <InputController
                        name={'remorks'}
                        label='Remarks'
                        placeholder="Enter remarks"
                        control={control}
                    />
                </div>
            </Box>
            {visible.showDate ? (
                <SelectDate
                    onOpen={() => onShow('showDate')}
                    onClose={onHide}
                    dateTime={getValues("date")}
                    callBack={onDateChange}
                    open={visible.showDate} />
            ) : null}
            {visible.showSupplierBank ?
                <SelectSupplierBank
                    callBack={setValue}
                    open={visible.showSupplierBank}
                    keyName={'supplier_bank'}
                    supplierBank={bank}
                    supplier_name={supplier}
                    onOpen={() => onShow('showSupplierBank')}
                    onClose={onHide}
                /> : null
            }
            {visible.showCompanyBank ?
                <SelectCompanyBank
                    callBack={setValue}
                    open={visible.showCompanyBank}
                    keyName={'company_bank'}
                    onOpen={() => onShow('showSupplierBank')}
                    onClose={onHide}
                /> : null
            }
        </>
    )
}

export default BookPaymentForm