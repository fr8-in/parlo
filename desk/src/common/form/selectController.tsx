import React from "react";
import { isEmpty } from "lodash";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import { OverridableStringUnion } from '@mui/types';

interface InputBasePropsSizeOverrides { }
interface OptionType {
    value: string | number
    label: string
}
interface SelectContolProps {
    /** Filed name form will return selected value in this name */
    name: string;
    /** React hook form control */
    control: any;
    /** list of object for passing in select options */
    select_option: Array<OptionType>;
    /** Determines input disable */
    disable?: boolean;
    /** Helper Object with error messages works matching with field name */
    helperObject?: any;
    /** Determines select placeholder text */
    placeholder?: string;
    /** Determines select label */
    label?: string;
    /** optional handle change function  */
    handleChange?: Function;
    /** The size of the component. 'small' | 'medium'*/
    size?: OverridableStringUnion<'small' | 'medium', InputBasePropsSizeOverrides>;
    /** classname for custome style of the component */
    className?: any;
    /** default value for the select component */
    defaultValue?: unknown;
    /** Custom onChange callback it get two params form's onchange function and current value  */
    handleOnChange?: Function,
    /** Determines select is required */
    required?: boolean
}

/**
 * @param SelectContolProps - refer interface
 * @returns React JSXElement - A custom select component.
 */

const SelectController = (props: SelectContolProps) => {
    const {
        control,
        disable = false,
        name,
        label,
        placeholder,
        defaultValue,
        size = 'small',
        select_option,
        className,
        handleOnChange,
        required
    } = props;

    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
        }
    });

    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field: { onChange, value, ...field } }) => {
                return (
                    <FormControl fullWidth size={size}>
                        <InputLabel>{label}</InputLabel>
                        <Select
                            {...field}
                            onChange={
                                handleOnChange
                                    ? ({ target: { value } }) => {
                                        handleOnChange(onChange, value)
                                    }
                                    : onChange
                            }
                            size={size}
                            label={label}
                            placeholder={placeholder}
                            className={className}
                            disabled={disable}
                            required={required}
                            value={value}
                            defaultValue={defaultValue}
                        >
                            {isEmpty(select_option) ? null :
                                select_option.map((option: any, i: number) => {
                                    return (
                                        <MenuItem key={option.label} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                );
            }}
        />
    );
};

export default SelectController;
