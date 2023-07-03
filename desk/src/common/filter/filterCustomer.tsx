import { Empty } from 'antd'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { ListItem } from '../listItem'
import Checkbox from '@mui/material/Checkbox'

interface CustomerType {
    name: string
    idx: number
}

interface Props {
    onSelect: Function
    selected: Array<string>
}
const FilterCustomer = (props: Props) => {
    const { onSelect, selected } = props
    const { data, error, isValidating, mutate } = useFrappeGetDocList<CustomerType>(
        "Customer", {
        fields: ["name"],
    })

    const onPressSeries = (name: string, isChecked: boolean) => {
        onSelect(name, isChecked)
    }

    return (
        <>
            {(data && data?.length > 0) ? data.map((customer: CustomerType, i: number) => {
                const checkedFilter = selected?.filter(
                    (checked: any) => checked === customer?.name
                );
                const isChecked = checkedFilter?.length > 0 ? true : false;
                return (
                    <ListItem
                        key={customer?.name}
                        handleClick={() => onPressSeries(customer?.name, !isChecked)}
                        icon={<Checkbox
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onPressSeries(customer?.name, !isChecked)
                            }}
                            checked={isChecked}
                        />}
                        title={<p className="text-sm">{customer?.name}</p>}
                        classes={i % 2 === 1 ? "bg-slate-50" : ""}
                    />
                )
            }) : <Empty />}
        </>
    )
}

export default FilterCustomer
