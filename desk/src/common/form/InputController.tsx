import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React from "react";
import { Controller, Validate } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TodayIcon from "@mui/icons-material/Today";

interface Props {
  /** React hook form control */
  control: any
  /** Determines input disable */
  disable?: boolean
  /** MUI input variant */
  variant?: 'standard' | 'outlined' | 'filled'
  /** MUI custom icon send props as per input type */
  endIcon?: 'search' | 'select' | 'remove' | 'calendar'
  /** Start Icon currently inr icon only, if need other icon handle this */
  startIcon?: 'inr'
  /** Custom onClick callback */
  handleClick?: React.MouseEventHandler<HTMLDivElement>
  /** Filed name form will return input value from this name */
  name: string
  /** Helper Object with error messages works matching with field name */
  helperObject?: any
  /** Determines input is requied */
  required?: boolean
  /** Determines input placeholder text */
  placeholder?: string
  /** Determines input label */
  label?: string
  /** Determines input is multiline */
  multiline?: boolean
  /** custom validation function */
  validate?: Validate<any, any> | Record<string, Validate<any, any>>
  /** Determines input Max length value */
  maxLength?: number
  /** Determines input Min length value */
  minLength?: number
  /** custom clear field function callback */
  onFieldClear?: React.MouseEventHandler<SVGSVGElement> | undefined
  /** Determines input value is uppdercase */
  upperCase?: boolean
  /** Determines input Filed type ex: text, number, mobile, email etc., */
  fieldType?: any
  /** Custom onChange callback it get two params form's onchange function and current value  */
  handleOnChange?: Function
  /** Custom bottom margin */
  marginBottom?: number
  /** Error messgae or helper message */
  helperMessage?: string
  /** Determines input Filed tab index */
  tabIndex?: any
  /** Determines input Filed is readOnly */
  readOnly?: boolean
  /** Determines input Filed is hidden */
  hidden?: boolean
}

/**
 * React hook form controlled input component
 * @param props refer interface
 * @returns ReactJSX -> input component
 */

export const InputController = (props: Props) => {
  const {
    control,
    disable = false,
    variant: variant,
    handleClick,
    name,
    helperObject,
    required = false,
    placeholder,
    label,
    endIcon,
    startIcon,
    multiline,
    validate,
    maxLength,
    minLength,
    onFieldClear,
    upperCase,
    fieldType,
    handleOnChange,
    marginBottom,
    helperMessage,
    tabIndex = 1,
    readOnly = false,
    hidden = false
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required,
        ...(validate && { validate }),
        ...(minLength && { minLength }),
        ...(maxLength && { maxLength }),
      }}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            value={value ?? ''}
            tabIndex={tabIndex}
            hidden={hidden}
            onChange={
              handleOnChange
                ? ({ target: { value } }) => {
                  handleOnChange(onChange, value)
                }
                : onChange
            }
            placeholder={placeholder}
            label={label ? label : ''}
            InputLabelProps={{
                // shrink: !!value,
              required: !!required,
            }}
            variant={variant || 'outlined'}
            id={name}
            sx={{ mb: marginBottom || 2, width: '100%'}}
            disabled={disable}
            size="small"
            multiline={multiline}
            rows={multiline ? 2 : undefined}
            error={error !== undefined}
            type={fieldType}
            // onKeyPress={event => {
            //   if (event?.key === '-' || event?.key === '+') {
            //     event.preventDefault()
            //   }
            // }}
            helperText={
              error !== undefined && error?.message
                ? error?.message
                : error !== undefined && typeof helperObject === 'string'
                  ? helperObject
                  : error !== undefined && helperObject
                    ? helperObject[name] !== undefined
                      ? helperObject[name][error.type]
                      : `${name} is required`
                    : helperMessage ?
                      helperMessage : ""
            }
            inputProps={{
              ...(maxLength && { maxLength: maxLength }),
              ...(upperCase && { style: { textTransform: 'uppercase' } })
            }}
            InputProps={{
              readOnly: readOnly,
              ...(startIcon && {
                startAdornment: (
                  <InputAdornment position="start">
                    {startIcon === 'inr' ? (
                      <CurrencyRupeeIcon fontSize="small" />
                    ) : null}
                  </InputAdornment>
                ),
              }),
              endAdornment: (
                <InputAdornment position="end">
                  {endIcon === 'search' ? (
                    <SearchIcon fontSize="small" />
                  ) : null}
                  {endIcon === 'remove' ? (
                    <CancelIcon
                      fontSize="small"
                      sx={{ cursor: 'pointer' }}
                      onClick={onFieldClear}
                    />
                  ) : null}
                  {endIcon === 'select' ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : null}
                  {endIcon === 'calendar' ? (
                    <TodayIcon fontSize="small" />
                  ) : null}
                </InputAdornment>
              ),
            }}
            onClick={handleClick}
          />
        )
      }}
    />
  );
};
