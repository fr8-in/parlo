import CloseIcon from "@mui/icons-material/Close";
import CustomDrawer from "../../../../common/customDrawer";
import { InputController } from "../../../../common/form/InputController";
import { useForm } from "react-hook-form";
import { Box, Button, Grid } from "@mui/material";
import { useShowHide } from "../../../../lib/hooks";
import SelectItem from "../../../../common/select/selectMaterial";
import { FormHelpers } from "../../../../common/form/helper";
import { TruckType } from "../../../../lib/types/indent";
import { useEffect } from "react";


interface Props {
    rateType: TruckType | null
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    type?: "full" | undefined;
    backdropClose?: boolean;
    unit_price: number | null

}
interface MaterialType {
    material_name: string
    bill_no: number | null
    sap_ref_no: string
    cases: number | null
    weight: number | null
    unit_price: number | null
    price: number | null
    remarks: string
}
const initialForm: MaterialType = {
    material_name: "",
    bill_no: null,
    sap_ref_no: '',
    cases: null,
    weight: null,
    unit_price: null,
    price: null,
    remarks: ""
}


const AddMaterialType = (props: Props) => {
    const { open, onClose, callBack, onOpen, rateType, unit_price } = props;

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        clearErrors,
    } = useForm<MaterialType>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    useEffect(() => {
        setValue('unit_price', unit_price)
    }, [])

    const onChangeUnitPrice = (onChange: Function, value: any) => {
        onChange(value);
        setAmount(value, getValues('weight'), getValues('cases'))
    }

    const onChangeWeight = (onChange: Function, value: any) => {
        onChange(value);
        setAmount(getValues('unit_price'), value, getValues('cases'))
    }

    const onChangeCases = (onChange: Function, value: any) => {
        onChange(value);
        setAmount(getValues('unit_price'), getValues('weight'), value)
    }

    const setAmount = (unit_price: number | null, weight: number | null, cases: number | null) => {
        if (rateType?.is_per_kg == 1) {
            setValue('price', (unit_price || 0) * (weight || 0))
        } else if (rateType?.is_per_case == 1) {
            setValue('price', (unit_price || 0) * (cases || 0))
        } else return null
    }

    const initial_show_hide = {
        showItem: false
    }
    const handleItem = (value: any) => {
        setValue("material_name", value);
        clearErrors();
    };
    const { onHide, onShow, visible } = useShowHide(initial_show_hide)
    const onSubmit = (value: MaterialType) => {
        callBack(value)
        onClose();
    }

    return (
        <div className='max-w-6xl px-4 mx-auto'>
            <CustomDrawer
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                type="full"
                backdropClose={false}>
                <div className="flex justify-between items-center p-3 h-16 gap-3">
                    <h5 className="font-bold">Add Material</h5>
                    <button onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <Box
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box sx={{ minWidth: 275, mb: 4, p: 2, pb: 0 }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <InputController
                                    control={control}
                                    name={"material_name"}
                                    label="Material"
                                    endIcon={"select"}
                                    handleClick={() => onShow("showItem")}
                                    placeholder="Select Material"
                                    required
                                    helperObject={FormHelpers}
                                    autoFocus={true}
                                    handleOnKeyPress={() => onShow("showItem")}
                                    handleOnChange={(value:any)=>onShow("showItem")}
                                />
                                <InputController
                                    control={control}
                                    name={"bill_no"}
                                    required

                                    label="Bill no"
                                    placeholder="Enter Bill No"
                                />
                                <InputController
                                    control={control}
                                    name={"sap_ref_no"}
                                    placeholder="Enter SAP Ref No"
                                    label="SAP Ref no"
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ pr: 1 }}>
                                <InputController
                                    control={control}
                                    name={"cases"}
                                    handleOnChange={onChangeCases}
                                    label="No of Cases"
                                    placeholder="Enter Cases"
                                    maxLength={4}
                                    validate={(value: string) => {
                                        if ((value != null) && (value !== '') && isNaN(Number(value)) || (value === '0')) {
                                            return "Enter valid case!"
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputController
                                    control={control}
                                    name={"weight"}
                                    handleOnChange={onChangeWeight}
                                    label="Weight(Quintal)"
                                    placeholder="Enter Weight"
                                    maxLength={5}
                                    validate={(value: string) => {
                                        if ((value != null) && (value !== '') && isNaN(Number(value)) || (value === '0')) {
                                            return "Enter valid Weight!"
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ pr: 1 }}>
                                <InputController
                                    control={control}
                                    name={"unit_price"}
                                    handleOnChange={onChangeUnitPrice}
                                    label={`Unit price per(${rateType?.is_per_case ? 'case' : 'Quintal'})`}
                                    placeholder="Enter Unit Price"
                                    disable={rateType?.is_per_case == 0 && rateType?.is_per_kg == 0}
                                    maxLength={5}
                                    validate={(value: string) => {
                                        if ((value != null) && (value !== '') && isNaN(Number(value)) || (value === '0')) {
                                            return "Enter valid unit price!"
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputController
                                    control={control}
                                    name={"price"}
                                    label="Price"
                                    disable={true}
                                    helperObject={FormHelpers}
                                    fieldType='number'
                                    placeholder="Amount"
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <InputController
                                    control={control}
                                    name={"remarks"}
                                    label="Remarks"
                                />

                            </Grid>
                        </Grid>
                    </Box>
                    <div className=" ml-6  bottom-10 fixed bg-white w-full max-w-xs ">
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            fullWidth
                        >Add</Button>
                    </div>

                </Box>
            </CustomDrawer>
            {
                visible.showItem ? (
                    <SelectItem
                        callBack={handleItem}
                        open={visible.showItem}
                        onClose={onHide}
                        onOpen={() => onShow("showItem")} />
                ) : null
            }



        </div>
    )
};


export default AddMaterialType;
