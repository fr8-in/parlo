import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller } from "react-hook-form";

interface Items {
    value: string | number
    label: string
}
interface Props {
  /** React hook form control  */
  control: any
  /** Determines check box disable */
  disable?: boolean
  /** Filed name form will return check box value from this name */
  name: string
  /** Radio Group items */
  items: Array<Items>
  /** Determines arrange Radio in a row */
  row?: boolean
}

/**
 * React hook form controlled radio component
 * @param props refer interface
 * @returns ReactJSX -> radio component
 */

export const RadioButtonController = (props: Props) => {
  const { control, name, items, disable, row } = props;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field }) => (
        <RadioGroup row={row} {...field}>
          {items.map((item: Items) => {
            return (
              <FormControlLabel
                value={item.value}
                control={<Radio />}
                label={item.label}
                disabled={disable}
                key={item.value}
              />
            )
          })}
        </RadioGroup>
      )}
    />
  )
};
