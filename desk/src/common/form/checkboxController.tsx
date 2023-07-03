import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import { Controller } from "react-hook-form";

interface Props {
  /** React hook form control  */
  control: any
  /** Determines checkbox is disable */
  disable?: boolean
  /** Filed name form will return check box value from this name */
  name: string
  /** checkbox label name */
  label?: string
  /** Error messgae or helper message */
  helperText?: string
  /** Determines checkbox is hidden */
  hidden?: boolean
  /** Determines checkbox is readOnly */
  readOnly?: boolean
}

/**
 * React hook form controlled checkbox component
 * @param props refer interface
 * @returns ReactJSX -> checkbox component
 */

export const CheckboxController = (props: Props) => {
    const { control, disable, name, label, helperText, hidden, readOnly } = props;
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field: { value, onChange, ...field } }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={onChange}
                checked={value}
                disabled={disable}
                hidden={hidden}
                readOnly={readOnly}
                {...field}
              />
            }
            label={label}
          />
          {helperText ? (
            <FormHelperText sx={{ position: "relative", top: -15, left: 30 }}>
              {helperText}
            </FormHelperText>
          ) : null}
        </FormGroup>
      )}
    />
  );
};
