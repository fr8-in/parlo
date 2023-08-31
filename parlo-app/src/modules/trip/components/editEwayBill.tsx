import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { Box } from "@mui/system";
import { InputController } from "../../../common/form/InputController";
import { useShowHide } from "../../../lib/hooks";
import SelectDate from "../../../common/select/selectDate";
import moment, { Moment } from "moment";
import constants from "../../../lib/constants";
import { useFrappeCreateDoc, useFrappeGetDoc } from "frappe-react-sdk";
import IndentCardContainer from "../../../common/indentCardContainer";
import { message } from "antd";

interface Props {
    open: boolean;
    handleCancel: Function | any;
    indentId: any
    eWay: string
    hideLrEway?: boolean
}

interface FormProps {
    eway_bill: string
    date: any
    remarks: string
}
interface StateType {
    date: Moment
}
const initialState: StateType = {
    date: moment(),

}
const initialForm = {
    eway_bill: "",
    date: null,
    remarks: ""
}

const EditEwayBill = (props: any) => {
    const { indentId, eWay, onClose } = props;
    const { loading, createDoc, isCompleted, reset } = useFrappeCreateDoc()

    const [isUpdate, setUpdate] = useState(false)
    const [state, setState] = useState<StateType>(initialState)

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
    } = useForm<FormProps>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialForm
    });

    const initial = {
        showUploadEway: false,
        showDate: false
    };

    const { visible, onHide, onShow } = useShowHide(initial);

    useEffect(() => {
        setValue("date", moment().format(constants.YYYYMMDDHHmm))
    }, [])

    const { data, isLoading, mutate } = useFrappeGetDoc(
        'E-way bill',
        eWay
    );

    const eway: any = data

    useEffect(() => {
        if (eway?.way_bill_no) {
            setValue("eway_bill", eway?.way_bill_no)
            setValue("date", eway?.date)
            setValue("remarks", eway?.remarks)
        }
    }, [isLoading])


    const handleDate = (date: any) => {
        setState({ ...state, date })
        setValue("date", moment(date).format(constants.YYYYMMDDHHmm))
    }

    const onSubmit = () => {
        onShow("showUploadEway")
        const ewayInput = {
            way_bill_no: getValues("eway_bill"),
            date: getValues("date"),
            remarks: getValues("remarks"),
            indent: indentId
        }

        createDoc('E-way bill', ewayInput).then(res => console.log("result", res)).catch(error => (console.log("error", error)))
        message.success('E-way bill updated successfully')
        mutate && mutate()
        onHide()
        onClose()
    }


    useEffect(() => {
        if (isCompleted) {
            setUpdate(true)
        }
    }, [isCompleted]);


    const disabled = isUpdate || eway?.way_bill_no != null;

    return (

        <>
            <IndentCardContainer indentId={indentId} hideLrEway />
            <Box margin={0}
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}>
                <Grid container columnSpacing={2}>
                    <Grid item xs={12} sm={6} md={6}>

                        <InputController
                            control={control}
                            name="eway_bill"
                            required
                            disable={disabled}
                            label="E-way Bill Number"
                            placeholder="E-way Bill Number" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <InputController
                            name='date'
                            label='Date and Time'
                            required
                            disable={disabled}
                            control={control}
                            handleClick={() => onShow("showDate")}
                            endIcon={"calendar"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <InputController
                            control={control}
                            label="Remarks"
                            disable={disabled}
                            placeholder="Add Some Remarks"
                            name="remarks" />
                    </Grid>
                </Grid>

                {/* {isUpdate || eway?.way_bill_no != null ? (
          <div>
            <p>Upload Eway</p>
            <UploadButtonWithPreview />
          </div>
        ) : null} */}
 
                <div className="pt-4">
                    <Button variant="contained"
                        fullWidth
                        color="secondary"
                        type="submit"
                        className="bottom-0 fixed"
                        disabled={disabled}
                    >
                        {
                            loading ? <CircularProgress color="inherit" size={10} /> : null
                        }
                        {
                            // isUpdate || eway?.way_bill_no != null ? "Upload Eway" : "Continue"
                            "Continue"
                        }
                    </Button>
                </div>
            </Box>


            {
                visible.showDate ? (
                    <SelectDate callBack={handleDate} open={visible.showDate} onClose={onHide} onOpen={() => onShow("showDate")} dateTime={getValues("date")} />
                ) : null}

        </>

    );
};

export default EditEwayBill;



