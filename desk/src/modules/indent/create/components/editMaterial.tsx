import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { Box, Button, Grid } from "@mui/material";
import { useEffect } from "react";
import { FormHelpers } from "../../../../common/form/helper";
import SelectItem from "../../../../common/select/selectMaterial";
import { useShowHide } from "../../../../lib/hooks";
import { InputController } from "../../../../common/form/InputController";
import CustomDrawer from "../../../../common/customDrawer";

interface Props {
    materialData: any
    rateType: any
    onEdit: Function;
    onDelete: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    type?: "full" | undefined;
    backdropClose?: boolean;
}

interface MaterialType {
    id: number | null
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
    id: null,
    material_name: "",
    bill_no: null,
    sap_ref_no: '',
    cases: null,
    weight: null,
    unit_price: null,
    price: null,
    remarks: ""
}

const EditMaterial = (props: Props) => {
    const { open, onClose, onEdit, onDelete, rateType, materialData, onOpen } = props;
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        clearErrors,
    } = useForm<MaterialType>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });
    useEffect(() => {
        setValue("id", materialData?.id);
        setValue("material_name", materialData?.material_name);
        setValue("bill_no", materialData?.bill_no);
        setValue("sap_ref_no", materialData?.sap_ref_no);
        setValue("price", materialData?.price);
        setValue("cases", materialData?.cases);
        setValue("weight", materialData?.weight);
        setValue("price", materialData?.price);
        setValue("unit_price", materialData?.unit_price);
        setValue("remarks", materialData?.remarks);
    }, []);

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

    const initial_show_hide = { showItem: false }

    const handleItem = (value: any) => {
        setValue("material_name", value);
        clearErrors();
    };

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

    const onSave = (value: MaterialType) => {
        onEdit(value);
        onClose();
    }

    const onDel = () => {
        onDelete(materialData);
        onClose();
    }

    return (
        <div className='max-w-6xl mx-auto'>
            <CustomDrawer
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                type="full"
                backdropClose={false}>
                <div className="flex justify-between items-center p-3 h-16 gap-3">
                    <h5 className="font-bold">Edit Material</h5>
                    <button onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{ minWidth: 275, mb: 4, p: 2, pb: 0 }}
                >

                    <Grid container columnSpacing={2}>
                        <Grid item md={12}>
                            <InputController
                                control={control}
                                name={"material_name"}
                                label="Material"
                                endIcon={"select"}
                                required
                                disable
                                helperObject={FormHelpers} />

                            <InputController
                                control={control}
                                name={"bill_no"}
                                label="Bill no"
                            />
                            <InputController
                                control={control}
                                name={"sap_ref_no"}
                                label="SAP Ref no" /></Grid>

                        <Grid item xs={6} md={6}>
                            <InputController
                                control={control}
                                name={"cases"}
                                handleOnChange={onChangeCases}
                                label="No of Cases" /></Grid>
                        <Grid item xs={6} md={6}>
                            <InputController
                                control={control}
                                name={"weight"}
                                handleOnChange={onChangeWeight}
                                label="Weight(Quintal)" />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <InputController
                                control={control}
                                name={"unit_price"}
                                handleOnChange={onChangeUnitPrice}
                                label={`Unit price per(${rateType?.is_per_case ? 'case' : 'Quintal'})`} />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <InputController
                                control={control}
                                name={"price"}
                                label="Price"
                                required={rateType && (rateType?.name === 'is_per_case' || rateType?.name === 'is_per_kg')}
                                disable
                                helperObject={FormHelpers}
                                fieldType='number'
                                validate={(value: any) => {
                                    const intVal = value ? parseInt(value, 10) : 0
                                    if ((rateType && (rateType?.name === 'is_per_case' || rateType?.name === 'is_per_kg')) && intVal < 1) {
                                        return "Amount must be greater than 0"
                                    }
                                }} />
                        </Grid>
                        <Grid item xs={12}>
                            <InputController
                                control={control}
                                name={"remarks"}
                                label="Remarks"

                            />

                        </Grid>
                    </Grid>
                    <div className="flex justify-between" >
                        <Button
                            variant="outlined"
                            size="large"
                            color="error"
                            sx={{ width: "46%" }}
                            onClick={() => onDel()}
                        >Delete
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            color="secondary"
                            type="submit" onClick={handleSubmit(onSave)}
                            sx={{ width: "46%", mr: 2 }}
                        >
                            Save
                        </Button>
                    </div>
                </Box>
            </CustomDrawer>
            {visible.showItem ? (
                <SelectItem
                    callBack={handleItem}
                    open={visible.showItem}
                    onClose={onHide}
                    onOpen={() => onShow("showItem")} />
            ) : null}
        </div>
    )
};

export default EditMaterial;
