import { FilterFilled } from '@ant-design/icons';
import MultiSelectFilter from "./multiselectFilter";
import { blue } from "@mui/material/colors";

interface filterType {
    key: string
    options: Array<{ value: string, label: string }>
    value:Array<string>
    handleFilter: any
}

const filterObject = (input: filterType) => {
    const { key, options, value, handleFilter } = input
    return ({
    filterDropdown: (
        <MultiSelectFilter
            options={options}
            value={value}
            handleFilterChange={handleFilter}
            key_name={key}
        />
    ),
    filterIcon: () => (
        <FilterFilled style={{ color: value.length > 0 ? blue[600] : undefined }} />
    ),
})}

export default filterObject
