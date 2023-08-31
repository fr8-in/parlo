import { Button, Chip, Stack, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputController } from '../../../common/form/InputController';
import { useShowHide } from '../../../lib/hooks';
import AddMaterialType from './components/addMaterialType';
import SelectConsignee from '../../../common/select/selectConsignee';
import SelectCustomer from '../../../common/select/selectCustomer';
import SelectSeries from '../../../common/select/selectSeries';
import constants from '../../../lib/constants';
import SelectDate from '../../../common/select/selectDate';
import moment from 'moment';
import SelectRateType from '../../../common/select/selectRateType';
import isEmpty from 'lodash/isEmpty';
import AddMaterialTable from './components/addMaterialTable';
import { useFrappeCreateDoc, useFrappePostCall, useFrappeUpdateDoc } from 'frappe-react-sdk';
import util from '../../../lib/utils';
import { TruckType } from '../../../lib/types/indent';
import BackButton from '../../../common/backButton';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { get, sumBy } from 'lodash';
import SelectLocation from '../../../common/select/selectLocation';
import { setAdvanceDeilveryToNull, setCalculatablesToInitial , setIndentFormValues, setIndentSeries } from './components/indentFormHelpers';
import { CreateIndentPropsInterface, CreateIndentFormInterface, StateTypeInterface, initialState, MaterialTypeInterface } from '../../../lib/types/createIndent';

const createIndentInitialForm = {
    date: moment().format(constants.DDMMMYYHHmm),
    series: "",
    customer: "",
    consignee: "",
    from: "",
    delivery: "",
    select: "",
    customer_price: null,
    weight: null,
    cases: null,
    unit_price: null,
    rate_type_name: "",
    rate_type: null,
    on_delivery: null,
    billable: null,
    advance: null
}

const CreateIndent = (props: CreateIndentPropsInterface) => {
    const { onCreateIndent , indentDetailData } = props
    const { tripId } = useParams();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        clearErrors,
        setFocus
    } = useForm<CreateIndentFormInterface>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: createIndentInitialForm
    });
    const [state, setState] = useState<StateTypeInterface>(initialState)
    const [type,setType] = useState<string>('')

    const isIndentEdit = !isEmpty(indentDetailData)
    
    /**
     * @author Prasanth.M
     * @param indentData 
     * @description This function is used to pre populate data when it is edit indent
     */
    const preFillIndentData = async (indentData:any) => {
    console.log('indentData :', indentData);
        const items = indentData?.items
        setIndentFormValues(indentData).forEach(({name,value}) => (setValue(name , value)))
        const hrs = indentData?.expiry_at ? util.getHours(indentData?.expiry_at) : 0

        const updatedItem = !isEmpty(items) ?  items.map((item:MaterialTypeInterface) => {
            return {
              ...item,
              material_name: item.item,
              price : item.amount
            };
          }) : []
        setState((prev: StateTypeInterface) => {
                return (
                    { ... prev , materials : updatedItem , hours : hrs <= 0 ? Math.abs(hrs) : -hrs }
                )
            })
        onDateChange(indentData?.creation , indentData?.expiry_at)
        handleMaterialSum(updatedItem , indentData?.customer_price)
    }

    const { loading, createDoc, error } = useFrappeCreateDoc()

    const { updateDoc , loading:update_indent_loading } = useFrappeUpdateDoc()

    const navigate = useNavigate()

    const { call } = useFrappePostCall('parlo.trip.updateIndentInTrip.update_indent_in_trip')

    const handleIndent = async (indents: Array<string>) => {

        const updateIndentInput = {
            indents,
            trip: tripId
        }

        await call({ updateIndentInput }).then(
            (result: any) => {
                console.log({ result: result?.message })
                message.success('Indent added successfully')
                navigate(`/trip/${tripId}`)
            }
        ).catch(error => {
            message.error(error?.message)
        });
    };

    const initial_show_hide = {
        showSeries: false,
        showCustomer: false,
        showConsignee: false,
        showCustomerLocation: false,
        showConsigneeLocation: false,
        showMaterialType: false,
        showEditMaterial: false,
        showDate: false,
        showRate: false
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    const handleSeries = (value: any) => {
        // when a series is selected , if there is only one customer against the series , the customer will be auto filled.
        setIndentSeries(value).forEach(({name,value}) => (setValue(name , value)))
        clearErrors();
        setType(value?.type ? value.type : "")
    };

    const customer_watch = watch('customer')
    const delivery_watch =  watch('delivery')
    const from_watch = watch('from') 
    const rate_type_watch = watch('rate_type.name')

    const { error:unitPriceError, loading:unitPriceLoading , call:unitPriceCall } = useFrappePostCall('parlo.trip.api.indent.getUnitPrice.getUnitPrice')

    useEffect(()=>{
        if((customer_watch && from_watch && delivery_watch && rate_type_watch && type !="pm")){
            const input = {
                customer:customer_watch, rate_type : rate_type_watch , source:from_watch , destination:delivery_watch
            }
            unitPriceCall({ unitprice_input:input}).then((response)=>{
                const message = get(response,'message',0)
                setValue("unit_price",message)
            }).catch(error => console.log("ERROR", JSON.stringify(error)))
        }
    },[type != "pm" , customer_watch , delivery_watch , from_watch , rate_type_watch])


    const handleCustomer = (value: any) => {
        setValue("customer", value);
        handleConsignee(createIndentInitialForm.consignee);
        clearErrors();
    };

    const handleConsignee = (value: any) => {
        setValue("consignee", value);
        clearErrors();
    };

    const handleCustomerLocation = (value: any) => {
        setValue("from", value);
        clearErrors();
    };

    const handleConsigneeLocation = (value: any) => {
        setValue("delivery", value);
        clearErrors();
    };

    const handleMaterialSum = (materials: Array<MaterialTypeInterface> , customer_price?:number) => {
        const materialList = materials.map(material => {
            return {
                ...material,
                price: Number(material?.price),
                weight: Number(material?.weight),
                cases: Number(material?.cases)
            }
        })
        const customerPrice = sumBy(materialList, 'price') || customer_price || 0
        const weight = sumBy(materialList, 'weight')
        const cases = sumBy(materialList, 'cases')
        setValue('customer_price', customerPrice)
        setValue("weight", weight)
        setValue("cases", cases)
        calculateBillable()
    }

    const handleMaterialType = (material: MaterialTypeInterface) => {
        setState((prev: StateTypeInterface) => {
            return (
                { ...prev, materials: [...prev.materials, { ...material, id: prev.materials.length > 0 ? (prev.materials.length + 1) : 1 },] }
            )
        })

        handleMaterialSum([...state.materials, material])
        clearErrors();

    };


    const handleEditMaterialType = (material: MaterialTypeInterface) => {
        const removeMaterial = state.materials.filter((m: MaterialTypeInterface) => m.id !== material.id)
        setState((prev: any) => {
            return (
                { ...prev, materials: [...removeMaterial, material] }
            )
        })

        handleMaterialSum([...removeMaterial, material])
        clearErrors();
    }

    const handleDeleteMaterialType = (material: MaterialTypeInterface) => {
        const removeMaterial = state.materials.filter((m: MaterialTypeInterface) => m.id !== material.id)
        setState((prev: any) => {
            return (
                { ...prev, materials: removeMaterial }
            )
        })
        handleMaterialSum(removeMaterial)
        clearErrors();
    }

    const handleRateType = (value: TruckType) => {
        setCalculatablesToInitial(createIndentInitialForm).forEach(({name,value}) => (setValue(name , value)))
        setValue("rate_type", value)
        setValue("rate_type_name", value.name)
        setState({ ...state, materials: [] });
        clearErrors();
    }

    const onDateChange = (date: any , expiryAt?:any) => {
    const expiryDate =  moment( expiryAt ? expiryAt : date).add(state.hours, 'hours');
        setState((prev: any) => {
            return (
                { ...prev, date , expiryDate }
            )
        })
        setValue("date", moment(date).format(constants.DDMMMYYHHmm));
    };

    const setExpiryHours = (hrs: any) => {
        const expiryDate = moment(state.date).add(hrs, 'hours')
        setState({ ...state, hours: hrs, expiryDate })
    }

    const onSubmit = async (form: CreateIndentFormInterface) => {
        const items = isEmpty(state.materials) ? [] : state.materials?.map(material => {
            return {
                item: material?.material_name,
                weight: +material?.weight,
                cases: +material?.cases,
                amount: +material?.price,
                bill_no: material?.bill_no,
                sap_ref_no: material?.sap_ref_no,
                remarks: material?.remarks,
                unit_price: material?.unit_price,
            }
        })

        const indentInput = {
            customer: form.customer,
            consignee: form.consignee,
            from: form.from,
            to: form.delivery,
            series: form.series,
            rate_type: form.rate_type_name || form.rate_type?.name,
            indent_date: util.epr_date_time(state.date),
            expiry_at: util.epr_date_time(state.expiryDate),
            weight: form.weight,
            cases: form.cases,
            customer_price: form.customer_price,
            advance: form.advance,
            on_delivery: form.on_delivery,
            billable: form.billable,
            items
        }
        if(isIndentEdit){
            await updateDoc("Indent", indentDetailData?.name, {
              ...indentInput,
            })
              .then((result: any) => {
                message.success("Indent updated successfully");
                navigate("/indent" , { replace : true });
              })
              .catch((error) =>{
                console.log(JSON.stringify(error))
                message.error(error?.message)});
        }else{
        await createDoc('Indent', indentInput).then(res => {
            message.success("Indent created successfully")
            if (tripId) {
                handleIndent([res.name])
            } else if (onCreateIndent) {
                onCreateIndent(res.name)
            } else {
                navigate("/indent" , { replace : true });
            }

        }).catch(error => console.log('indent error', error))
    }
    }

    const ptl_load = (getValues("rate_type")?.is_per_case == 1) || (getValues("rate_type")?.is_per_kg == 1)

    //useEffects
    
    useEffect(() => {
        if (error != null) {
            message.error("error while creating")
        }
    }, [JSON.stringify(error)])

    //This useEffect is used to populate the date when the component is called from editIndent.
    //In this case the indentData will be sent from the parent component , that will be prepopulated.
    useEffect(() => {
        if (!isEmpty(indentDetailData)) {
            preFillIndentData(indentDetailData)
        }
      }, [indentDetailData]);
    

    const handleOnChangeAmount = (onChange: Function, value: any) => {
        onChange(value);
        calculateBillable()
    }

    const calculateBillable = () => {
        const advPlustoPay = +(watch("advance") || 0) + +(watch("on_delivery") || 0);
        setValue("billable", !watch("customer_price") ? null : (watch("customer_price") || 0) - advPlustoPay );
            if (!watch("customer_price")) {
                setAdvanceDeilveryToNull().forEach(({ name, value }) =>  setValue(name, value));
            }
        clearErrors();
    };
      

    const disableCustomer = !watch('series')
    const disableConsignee = !watch('customer')
    
    return (
        <div className={`max-w-3xl  mx-auto relative h-full`}>
            {!onCreateIndent ? <div className='bg-card mb-2 w-full p-1'>
                <div className="flex items-center align-baseline p-1">
                    <BackButton />
                    <h5 >{ isIndentEdit ? "Update Indent" : "Create Indent" }</h5>
                </div>
            </div> : null}

            <div className="flex flex-col w-full h-full">
                <Box
                    component="form"
                    autoComplete="off"
                    className="flex flex-col justify-between"
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <div className="overflow-y-auto scrollbar pb-8" style={{ height: onCreateIndent ? 'auto' : 'calc(100vh - 160px)' }}>

                        <div className="scrollbar bg-card w-full overflow-y-auto mb-2">

                            <div className="flex flex-row justify-between gap-2">
                                <InputController
                                    name='series'
                                    label='Book Name'
                                    endIcon={"select"}
                                    placeholder='Select Book Name'
                                    required
                                    control={control}
                                    handleClick={() => onShow("showSeries")}
                                    tabIndex={0}
                                    handleOnKeyPress={()=>onShow("showSeries")}
                                    handleOnChange={()=>onShow("showSeries")}
                                    autoFocus={true}
                                />

                                <InputController
                                    name='date'
                                    label='Date'
                                    required
                                    control={control}
                                    handleClick={() => onShow("showDate")}
                                    endIcon={"calendar"}
                                    handleOnKeyPress={()=>onShow("showDate")}
                                    tabIndex={1}
                                />
                            </div>

                            <div className="flex flex-row justify-between gap-2">

                                <InputController
                                    name='customer'
                                    label='Customer'
                                    required
                                    disable={disableCustomer}
                                    endIcon={"select"}
                                    placeholder="Select Customer"
                                    control={control}
                                    handleClick={() => disableCustomer ? message.warning('Select Book Name') : onShow("showCustomer")}
                                    handleOnKeyPress={() => disableCustomer ? message.warning('Select Book Name') : onShow("showCustomer")}
                                    tabIndex={2}
                                    handleOnChange={() => disableCustomer ? message.warning('Select Book Name') : onShow("showCustomer")}
                                />
                                <InputController
                                    name='from'
                                    label='From Location'
                                    endIcon={"select"}
                                    placeholder="From Location"
                                    control={control}
                                    required
                                    handleClick={() => onShow("showCustomerLocation")}
                                    handleOnKeyPress={() => onShow("showCustomerLocation")}
                                    tabIndex={3}
                                    handleOnChange={() => onShow("showCustomerLocation")}
                                />
                            </div>
                            <div className="flex flex-row justify-between gap-2">

                                <InputController
                                    name='consignee'
                                    label='Consignee'
                                    required
                                    placeholder="Select Consignee"
                                    endIcon={"select"}
                                    control={control}
                                    disable={disableConsignee}
                                    handleClick={() => disableConsignee ? message.warning('Select Customer') : onShow("showConsignee")}
                                    handleOnKeyPress={() => disableConsignee ? message.warning('Select Customer') : onShow("showConsignee")}
                                    tabIndex={4}
                                    handleOnChange={() => disableConsignee ? message.warning('Select Customer') : onShow("showConsignee")}
                                />

                                <InputController
                                    name='delivery'
                                    label='Delivery At'
                                    placeholder='Delivery At'
                                    endIcon={"select"}
                                    required
                                    control={control}
                                    handleClick={() => onShow("showConsigneeLocation")}
                                    handleOnKeyPress={() => onShow("showConsigneeLocation")}
                                    tabIndex={5}
                                    handleOnChange={() => onShow("showConsigneeLocation")}
                                />
                            </div>
                            <div className="flex flex-row justify-between gap-2">
                                <InputController
                                    control={control}
                                    name={'rate_type_name'}
                                    label="Rate Type"
                                    required
                                    endIcon={"select"}
                                    placeholder="Select Rate Type"
                                    handleClick={() => onShow("showRate")}
                                    handleOnKeyPress={() => onShow("showRate")}
                                    tabIndex={6}
                                    handleOnChange={() => onShow("showRate")}
                                />
                            </div>
                        </div>

                        <div className='bg-card mb-2'>
                            <Button sx={{ borderStyle: 'dashed', BorderColor: "secondary" }}
                                variant="outlined"
                                fullWidth
                                color="secondary"
                                title='Add Material'
                                startIcon="+"
                                onClick={() => onShow("showMaterialType")}
                                type={'button'}
                                tabIndex={7}
                                // disabled={watch("rate_type")?.name == null}
                            >
                                add material
                            </Button>
                            {!isEmpty(state.materials) ?
                                <div className='mt-2'>
                                    <AddMaterialTable
                                        rateType={getValues("rate_type")}
                                        dataSource={state.materials}
                                        handleEditMaterialType={handleEditMaterialType}
                                        handleDeleteMaterialType={handleDeleteMaterialType}
                                    />
                                </div>
                                : null}
                        </div>
                        <div className='bg-card mb-2'>
                            <div className='flex gap-2'>
                                <InputController
                                    control={control}
                                    name='weight'
                                    tabIndex={8}
                                    disable={ptl_load || watch("rate_type") == null}
                                    label='Total Weight'
                                />
                                <InputController
                                    control={control}
                                    disable={ptl_load || watch("rate_type") == null}
                                    name='cases'
                                    tabIndex={9}
                                    label='Total Cases'
                                    handleClick={()=>setFocus("cases")}
                                />
                                <InputController
                                    control={control}
                                    disable={true}
                                    name='unit_price'
                                    hidden
                                />
                                <InputController control={control}
                                    name='customer_price'
                                    // required={isCustomerPriceRequired}
                                    disable={ptl_load || watch("rate_type") == null}
                                    tabIndex={10}
                                    label='Customer Price'
                                    handleOnChange={handleOnChangeAmount}
                                />
                            </div>
                            <div className='flex gap-2'>
                                <InputController
                                    control={control}
                                    disable={!watch('customer_price') || watch("rate_type") == null}
                                    name='advance'
                                    label='Advance'
                                    handleOnChange={handleOnChangeAmount}
                                    validate={(value: string) => {
                                        if (parseInt(value, 10) + +(watch('on_delivery') || 0) > +(watch('customer_price') || 0)) {
                                            return "Advance + To Delivery is greater than Customer price!"
                                        }
                                    }}
                                    tabIndex={11}
                                />
                                <InputController
                                    control={control}
                                    name='on_delivery'
                                    disable={!watch('customer_price') || watch("rate_type") == null}
                                    label='On Delivery'
                                    handleOnChange={handleOnChangeAmount}
                                    validate={(value: string) => {
                                        if (parseInt(value, 10) + +(watch('advance') || 0) > +(watch('customer_price') || 0)) {
                                            return "Advance + To Delivery is greater than Customer price!"
                                        }
                                    }}
                                    tabIndex={12}
                                />
                                <InputController control={control}
                                    name='billable'
                                    readOnly
                                    disable
                                    label='Billable'
                                    handleOnChange={handleOnChangeAmount}
                                    tabIndex={13}
                                />
                            </div>

                            <div className="flex min-w-full p-2 bg-slate-50 rounded-md justify-between">
                                <p className='text-sm'>{`Expiry time: ${moment(state.expiryDate).format('DD-MMM-YY HH:mm')}`}</p>
                                <Stack direction="row" spacing={1} className="ml-4" >
                                    <Chip
                                        label="12"
                                        size='small'
                                        variant={state.hours !== 12 ? "outlined" : "filled"}
                                        onClick={() => setExpiryHours(12)}
                                        color={state.hours === 12 ? "secondary" : "default"}
                                        tabIndex={14}

                                    />
                                    <Chip
                                        label="24"
                                        size='small'
                                        variant={state.hours !== 24 ? "outlined" : "filled"}
                                        onClick={() => setExpiryHours(24)}
                                        color={state.hours === 24 ? "secondary" : "default"}
                                        tabIndex={15}
                                    />
                                    <Chip
                                        label="48"
                                        size='small'
                                        variant={state.hours !== 48 ? "outlined" : "filled"}
                                        onClick={() => setExpiryHours(48)}
                                        color={state.hours === 48 ? "secondary" : "default"}
                                        tabIndex={16}
                                    />
                                </Stack>

                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0">
                            <Button variant="contained"
                                tabIndex={17}
                                color="secondary"
                                type="submit"
                                fullWidth >
                                {
                                    loading || update_indent_loading ? <CircularProgress color='inherit' size={10} /> : isIndentEdit ? "Update Indent" : "Create Indent"
                                }
                            </Button>
                        </div>
                    </div >

                </Box>
                {visible.showSeries ? (
                    <SelectSeries onOpen={() => onShow('showSeries')}
                        onClose={onHide}
                        open={visible.showSeries}
                        callBack={handleSeries} />
                ) : null}
                {visible.showCustomer ? (
                    <SelectCustomer onOpen={() => onShow('showCustomer')}
                        onClose={onHide}
                        open={visible.showCustomer}
                        series={getValues("series")}
                        callBack={handleCustomer} />
                ) : null}
                {visible.showConsignee ? (
                    <SelectConsignee onOpen={() => onShow('showConsignee')}
                        onClose={onHide}
                        open={visible.showConsignee}
                        customer={getValues("customer")}
                        callBack={handleConsignee} />
                ) : null}
                {visible.showCustomerLocation ? (
                    <SelectLocation
                        onOpen={() => onShow('showCustomerLocation')}
                        onClose={onHide}
                        open={visible.showCustomerLocation}
                        callBack={handleCustomerLocation} />
                ) : null}
                {visible.showConsigneeLocation ? (
                    <SelectLocation
                        onOpen={() => onShow('showConsigneeLocation')}
                        onClose={onHide}
                        open={visible.showConsigneeLocation}
                        callBack={handleConsigneeLocation} />
                ) : null}

                {visible.showMaterialType ? (
                    <AddMaterialType
                        onOpen={() => onShow('showMaterialType')}
                        onClose={onHide}
                        open={visible.showMaterialType}
                        callBack={handleMaterialType}
                        rateType={getValues("rate_type")}
                        unit_price={getValues('unit_price')}
                    />
                ) : null}

                {visible.showDate ? (
                    <SelectDate
                        onOpen={() => onShow('showDate')}
                        onClose={onHide}
                        dateTime={getValues("date")}
                        callBack={onDateChange}
                        open={visible.showDate} />
                ) : null}
                {visible.showRate ? (
                    <SelectRateType
                        callBack={handleRateType}
                        open={visible.showRate}
                        onClose={onHide}
                        isTruck={false}
                        onOpen={() => onShow("showRate")}
                        selected={getValues("rate_type_name")} />
                ) : null
                }
            </div>
        </div>
    )
}


export default CreateIndent


