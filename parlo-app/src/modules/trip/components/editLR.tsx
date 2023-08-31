import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { InputController } from "../../../common/form/InputController";
import { useForm } from "react-hook-form";
import { Box } from "@mui/system";
import { useShowHide } from "../../../lib/hooks";
import moment from "moment";
import constants from "../../../lib/constants";
import { useFrappeCreateDoc, useFrappeGetDoc } from "frappe-react-sdk";
import SelectDate from "../../../common/select/selectDate";
import IndentCardContainer from "../../../common/indentCardContainer";
import { blue, grey } from "@mui/material/colors";
import { message } from "antd";
import UploadButtonWithPreview from "../../../common/uploadButtonWithPreview";


interface FormProps {
  lr: string
  date: any
  Weight: number
  remarks: string
}

const initialForm = {
  lr: "",
  date: null,
  Weight: 0,
  remarks: ""
}

const EditLr = (props: any) => {

  const { indentId, lrNo, onClose } = props;
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    clearErrors,
  } = useForm<FormProps>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialForm
  });

  const { loading, createDoc, isCompleted, reset } = useFrappeCreateDoc()
  const initialShow = { showDate: false };
  const { visible, onShow, onHide } = useShowHide(initialShow);
  const [isUpdate, setUpdate] = useState(false)

  const handleDate = (date: any) => {
    setValue("date", moment(date).format(constants.YYYYMMDDHHmm))
  }

  const onSubmit = async () => {

    const lrInput = {
      lr_no: getValues("lr"),
      date: getValues("date"),
      weight: getValues("Weight"),
      remarks: getValues("remarks"),
      indent: indentId
    }
    
    if(!disabled){
      await createDoc('Lr', lrInput).then(res => console.log("result", res)).catch(error => (console.log("error", error)))
      message.success('LR updated successfully')
      mutate && mutate()
      onHide()
      onClose()
    }
  }

  const { data,isLoading,isValidating, mutate } = useFrappeGetDoc(
    'Lr',
    lrNo
  );

  const lr: any = data

  useEffect(() => {
    setValue("lr", lr?.lr_no)
    setValue("date", lr?.date)
    setValue("Weight", lr?.weight)
    setValue("remarks", lr?.remarks)
  }, [isLoading])

  useEffect(() => {
    if (isCompleted) {
      setUpdate(true)
    }
  }, [isCompleted])

  const disabled = (isUpdate || lr?.lr_no != null);
  
  return (

    <div>
          <IndentCardContainer indentId={indentId} hideLrEway />
      <Box margin={0}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}>

        <Grid container columnSpacing={1}>
          <Grid item xs={12} sm={6} md={6}>
            <InputController
              control={control}
              name={"lr"}
              label="LR Number"
              disable={disabled}
              required
              placeholder="LR Number" />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <InputController
              control={control}
              label="Date & Time"
              disable={disabled}
              handleClick={() =>
                onShow("showDate")}
              endIcon="calendar"
              required
              name={"date"} />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <InputController
              control={control}
              label="Weight"
              disable={disabled}
              name={"Weight"} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <InputController
              control={control}
              label="Remarks"
              disable={disabled}
              placeholder="Add Some Remarks"
              name={"remarks"} />
          </Grid>
        </Grid>

        {lr?.lr_no != null || isUpdate ?
          <div className="pt-4">
            <div>
              <p className="mb-3">Upload LR</p>
              <UploadButtonWithPreview lr_no={lr?.lr_no} />
            </div>
          </div>
          : null}


        <Button className="bottom-0 fixed"
          fullWidth
          variant="contained" color="secondary"
          disabled={disabled}
          sx={{backgroundColor: isUpdate ? grey[300] : blue[600]}}
          type="submit"
        >
          { loading ? <CircularProgress color='inherit' size={10} /> : null }
          { "Continue"}</Button>
          {/* // isUpdate || lr?.lr_no != null ? "Upload Lr" : "Continue" */}
      </Box>
      {lr?.lr_no == null ?
        visible.showDate ? (
          <SelectDate callBack={handleDate} open={visible.showDate} onClose={onHide} onOpen={() => onShow("showDate")} dateTime={getValues("date")} />
        ) : null
        : null}
    </div>
  );
};

export default EditLr;


