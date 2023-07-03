import { Box, Button, Card, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { InputController } from "../../../common/form/InputController";
import { useShowHide } from "../../../lib/hooks";
import SelectTruck from "../components/selectTruck";
import SelectDriver from "../components/selectDriver";
import SelectSupplier from "../components/selectSupplier";
import SelectIndent from "../components/selectIndent";
import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";
import IndentCard from "../../indent/components/indentCard";
import { Indent, SorterType } from "../../../lib/types/indent";
import { useEffect, useState } from "react";
import IndentTable from "../../indent/components/indentTable";
import { Loading } from "../../../common/loading";
import { Empty, message } from "antd";
import { get, isEmpty, sumBy } from "lodash";
import SelectCity from "../../../common/selectCity";
import BackButton from "../../../common/backButton";
import util from "../../../lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import FuelAdvance from "../components/fuelAdvance";
import { FormProp, initialForm, initial_advance } from "../components/initialForm";
import Advance from "../components/advance";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ConfirmTrip = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    let { indentIds } = useParams();

    const initialState: {
        indents: Array<Indent>
        indent_names: Array<string>
    } = {
        indents: [],
        indent_names: []
    }

    const sorterInitial: SorterType = { field: "id", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const [indent, setIndent] = useState(initialState)

    const { call, error } = useFrappePostCall('parlo.trip.confirm.confirm_trip')

    const { data, isLoading, isValidating, mutate } = useFrappeGetDocList<Indent>('Indent', {
        fields: [
            "cases",
            "confirmed_at",
            "consignee",
            "creation",
            "customer",
            "customer_price",
            "destination",
            "docstatus",
            "expiry_at",
            "from",
            "id",
            "idx",
            "modified",
            "modified_by",
            "name",
            "owner",
            "rate_type",
            "series",
            "source",
            "to",
            "weight",
            "_assign",
            "_comments",
            "_liked_by",
            "_user_tags",
            "rate_type.common_name",
            "trip",
            "rate_type.is_per_case",
            "rate_type.is_per_kg"
        ],
        filters: [["name", "in", indent.indent_names]]
    })

    const prefillSourceDestination = (data: Array<Indent>): void => {
        // Check if data array is not empty
        if (!isEmpty(data) && data.length) {
          // Extract source and destination from the first element
          const mainSource: string = data[0].source;
          const mainDestination: string = data[0].destination;
          // If there is only one element in the data array, set source and destination directly
          if (data.length === 1) {
            setValue('source', mainSource);
            setValue('destination', mainDestination);
          } else {
            // Create separate arrays for sources and destinations
            const sources: string[] = data.map((obj: Indent) => obj.source);
            const destinations: string[] = data.map((obj: Indent) => obj.destination);
            // Check if all sources are the same as the main source
            const isSameSource: boolean = sources.every((source: string) => source === mainSource);
            // Check if all destinations are the same as the main destination
            const isSameDestination: boolean = destinations.every((destination: string) => destination === mainDestination);
            // If all sources are the same, set the source
            if (isSameSource) {
              setValue('source', mainSource);
            }
            // If all destinations are the same, set the destination
            if (isSameDestination) {
              setValue('destination', mainDestination);
            }
          }
        }
      };

    const navigate = useNavigate();
    useEffect(() => {
        if (data) {
            setIndent(prev => { return { ...prev, indents: data } })
            prefillSourceDestination(data)
        }
    }, [!(data && data?.length > 0), isValidating])

    useEffect(() => {
        const indentNames = util.encryptAndDecrypt(indentIds, 'DECRYPT')
        console.log({ indentNames });
        setIndent(prev => { return { ...prev, indent_names: indentNames } })
    }, [indentIds])

    useEffect(() => {
        console.log({ lengthIndent: indent.indent_names?.length });
        mutate()
    }, [indent.indent_names?.length])

    const initial_show_hide = {
        showTruck: false,
        showSupplier: false,
        showDriver: false,
        showIndent: false
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        clearErrors,
    } = useForm<FormProp>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    const { fields: fuel, append: f_append, remove: f_remove } = useFieldArray({ control, name: "fuel_advance" });
    const { fields: advance, append: a_append, remove: a_remove } = useFieldArray({ control, name: "advance" });

    const handleTruck = (value: any) => {
        const truck = value?.number + ' - ' + value?.truck_type
        setValue("truck_no", truck);
        setValue("truck", value?.name);
        clearErrors();
    };

    const handleDriver = (driver: any) => {
        const driverName = driver?.full_name && driver?.cell_number ? `${driver?.full_name} - ${driver?.cell_number}` : driver?.full_name || driver?.cell_number
        setValue("driver_name", driverName);
        setValue('driver', driver?.name)
        clearErrors();
    };

    const handleSupplier = (supplier: any) => {
        setValue("supplier_name", supplier?.name);
        setValue("supplier", supplier?.name);
        /** If supplier change after price and advance booking below call will reset */
        setValue('supplierPrice', null)
        setValue('advance', [initial_advance])
        clearErrors();
    };

    const handleIndent = (indents: Array<string>) => {
        setIndent({ ...indent, indent_names: indents })
    };

    const onSelectSource = (source: any) => {
        setValue('source', source?.name)
    }

    const onSelectDestination = (destination: any) => {
        setValue('destination', destination?.name)
    }

    const handleIndentChange = (indent_name: string) => {
        setIndent({ ...indent, indent_names: [...indent.indent_names.filter((in_name: any) => in_name !== indent_name)] })
    }

    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        setIndent({ ...indent, indent_names: selectedRowKeys, indents: selectedRows })
    }

    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: indent.indent_names,
        onChange: onSelectChange,
        getCheckboxProps: (record: Indent) => {
            // Currently Checked items
            const is_per_case = get(indent, 'indents[0].is_per_case', null)
            const is_per_kg = get(indent, 'indents[0].is_per_kg', null)

            const name = get(indent, 'indents[0].name', null)
            const ftl = is_per_case == 0 && is_per_kg == 0
            const ptl = is_per_case == 1 || is_per_kg == 1

            const row_is_per_case = get(record, 'is_per_case', null)
            const row_is_per_kg = get(record, 'is_per_kg', null)

            const row_ftl = row_is_per_case == 0 && row_is_per_kg == 0
            const row_ptl = row_is_per_case == 1 || row_is_per_kg == 1

            return ({
                disabled: isEmpty(indent.indents) ? false : ((row_ftl && ftl) && (record?.name == name)) ? false : row_ptl && ptl ? false : true
            })
        }
    }
    const fuel_advance_arr = watch('fuel_advance')
    const fuel_total: any = fuel_advance_arr?.reduce((acc: number, { total }: any) => acc + +total, 0)
    const advance_arr: any = watch('advance')
    const advance_total: any = advance_arr?.reduce((acc: number, { amount }: any) => acc + +(amount || 0), 0)
    const total = parseInt(fuel_total, 10) + parseInt(advance_total, 10)
    const supplier_price = watch('supplierPrice') || 0
    const balance = supplier_price - total

    const onSubmit = async (form:FormProp) => {
        const fuel_advance = form.fuel_advance && form.fuel_advance.length > 0 && form.fuel_advance[0].station_name ? form.fuel_advance : null
        const advance = form.advance && form.advance.length > 0 && form.advance[0].mode ? form.advance : null
        console.log({form})
        const confirmTripInput = {
            source: form.source || '',
            destination: form.destination || '',
            truck: form.truck,
            driver: form.driver,
            supplier: form.supplier_name || '',
            supplier_price: form.supplierPrice || 0,
            customer_price: sumBy(indent.indents, 'customer_price'),
            indents: indent.indent_names,
            fuel_advance,
            advance
        }

        try {
            await call({ confirmTripInput }).then((response: any) => {
                message.success(`Load confirmed successfully`)
                navigate(`/trip/${response?.message}`)
            })

        } catch (error: any) {
            const exception = error?.exception
            if (`${exception}`.includes('Driver')) {
                message.error("Driver in active trip")
            } else if (`${exception}`.includes('Truck')) {
                message.error("Truck in active trip")
            } else {
                message.error(exception)
            }
        }
    }

    const removeAdvanceItem = (index: number) => {
        a_remove(index);
    };

    const addAdvanceItem = () => {
        a_append(initial_advance);
    };

    return (
        <div className="max-w-3xl mx-auto relative" style={{ height: 'calc(100vh - 90px)' }}>
            <Card sx={{ mb: 1 }}>
                <div className='flex p-2 gap-3'>
                    <BackButton />
                    <h3>Confirm Load</h3>
                </div>
            </Card>
            <Box
                component="form"
                autoComplete="off"
                sx={{ width: '100%' }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="overflow-y-auto scrollbar" style={{ height: 'calc(100vh - 180px)' }}>

                    <Card sx={{ p: 2, mb: 1 }}>
                        <InputController
                            name='source'
                            label='Source'
                            control={control}
                            endIcon={"select"}
                            placeholder="Select Source"
                            handleClick={() => onShow("showSource")}
                        />
                        <InputController
                            name='truck_no'
                            label='Truck No'
                            control={control}
                            endIcon={"select"}
                            required={true}
                            placeholder="Select Truck"
                            handleClick={() => onShow("showTruck")}
                        />

                        <InputController
                            name='driver_name'
                            label='Driver'
                            endIcon={"select"}
                            required={true}
                            placeholder="Select Driver"
                            control={control}
                            handleClick={() => onShow("showDriver")} />

                        <InputController
                            name='supplier_name'
                            label='Supplier'
                            placeholder="Select Supplier"
                            endIcon={"select"}
                            control={control}
                            handleClick={() => onShow("showSupplier")} />
                        <InputController
                            name='destination'
                            label='Destination'
                            control={control}
                            endIcon={"select"}
                            placeholder="Select Destination"
                            handleClick={() => onShow("showDestination")}
                        />
                        {watch('supplier_name') ?
                        <InputController
                            name='supplierPrice'
                            label='Supplier Price'
                            placeholder="Enter Supplier Price"
                            control={control}
                            fieldType={'number'}
                        /> : null}
                    </Card>
                    {supplier_price ? (<>
                        <Card sx={{ p: 2, mb: 1 }}>
                            <h6 className="text-xs mb-2">Fuel Advance</h6>
                            <FuelAdvance 
                                control={control} 
                                fields={fuel} 
                                watch={watch} 
                                setValue={setValue} 
                            />
                        </Card>
                        <Card sx={{ p: 2, mb: 1 }}>
                            <div className="flex justify-between items-center mb-1">
                                <h6 className="text-xs my-2">Advance</h6>
                                <IconButton onClick={addAdvanceItem} color="secondary" size="small">
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>
                            <Advance 
                                control={control} 
                                fields={advance} 
                                watch={watch} 
                                remove={removeAdvanceItem} 
                                supplier={getValues('supplier_name')} 
                                setValue={setValue}  
                            />
                            <div className="flex justify-between items-center">
                                <p><span className=" font-bold">Total Advance:</span> {total}</p>
                                <p><span className=" font-bold">Balance:</span> {balance}</p>
                            </div>
                        </Card>
                    </>) : null}
                    <Card sx={{ minWidth: 275, mb: 1, p: 2 }}>
                        <Button sx={{ borderStyle: 'dashed', BorderColor: "secondary" }}
                            variant="outlined"
                            fullWidth
                            color="secondary"
                            title='Add Indent'
                            startIcon="+"
                            onClick={() => onShow("showIndent")}
                            type={'button'}
                        >
                            Add Indent
                        </Button>
                    </Card>

                    <Card sx={{ p: 2, mb: 2 }}>
                        {isMobile ?
                            isValidating ? <Loading /> :
                                (data && data?.length > 0) ?
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
                                        {data?.map((_data: any) => {
                                            return (
                                                <IndentCard
                                                    indent={_data}
                                                    key={_data.id}
                                                    selected={{ indent_names: indent.indent_names }}
                                                    onSelect={handleIndentChange}
                                                    showItems={() => undefined}
                                                    mutate={mutate}
                                                />
                                            )
                                        })}
                                    </div> : <Empty />
                            : (<IndentTable
                                data={data}
                                loading={isLoading}
                                rowSelection={rowSelection}
                                mutate={mutate}
                            />)}

                    </Card>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <Button variant="contained"
                        color="secondary"
                        type="submit"
                        sx={{ mb: 0, width: '100%' }}
                        fullWidth>Confirm Load
                    </Button>
                </div>
            </Box>

            {visible.showTruck ? (
                <SelectTruck onOpen={() => onShow('showTruck')}
                    onClose={onHide}
                    open={visible.showTruck}
                    callBack={handleTruck} />
            ) : null}

            {visible.showDriver ? (
                <SelectDriver onOpen={() => onShow('showDriver')}
                    onClose={onHide}
                    open={visible.showDriver}
                    callBack={handleDriver} />
            ) : null}

            {visible.showSupplier ? (
                <SelectSupplier onOpen={() => onShow('showSupplier')}
                    onClose={onHide}
                    open={visible.showSupplier}
                    callBack={handleSupplier} />
            ) : null}

            {visible.showIndent ? (
                <SelectIndent
                    handleCancel={onHide}
                    open={visible.showIndent}
                    selected={indent}
                    onChange={handleIndent}
                />
            ) : null}

            {visible.showSource ? (
                <SelectCity
                    onClose={onHide}
                    open={visible.showSource}
                    onOpen={() => onShow('showSource')}
                    placeholder="Search Source (Min 3 Letters)"
                    callBack={onSelectSource}
                />
            ) : null}

            {visible.showDestination ? (
                <SelectCity
                    onClose={onHide}
                    onOpen={() => onShow('showDestination')}
                    open={visible.showDestination}
                    placeholder="Search Destination (Min 3 Letters)"
                    callBack={onSelectDestination}
                />
            ) : null}
        </div>
    )
}

export default ConfirmTrip
