import { Empty } from 'antd'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { ListItem } from '../listItem'
import Checkbox from '@mui/material/Checkbox'

interface SeriesType {
    name: string
}

interface Props {
    onSelect: Function
    selected: Array<string>
}
const FilterSerial = (props: Props) => {
    const { onSelect, selected } = props
    const { data, error, isValidating, mutate } = useFrappeGetDocList<SeriesType>("Naming series", {
        fields: ['name']
    })

    const onPressSeries = (name: string, isChecked: boolean) => {
        onSelect(name, isChecked)
    }

    return (
        <>
            {(data && data?.length > 0) ? data.map((serial: SeriesType, i: number) => {
                const checkedFilter = selected.filter(
                    (checked: any) => checked === serial?.name
                );
                const isChecked = checkedFilter?.length > 0 ? true : false;
                return (
                    <ListItem
                        key={serial?.name}
                        handleClick={() => onPressSeries(serial?.name, !isChecked)}
                        icon={<Checkbox
                            size='small'
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onPressSeries(serial?.name, !isChecked)
                            }}
                            checked={isChecked}
                        />}
                        title={<p className="text-sm">{serial?.name}</p>}
                        classes={i % 2 === 1 ? "bg-slate-50" : ""}
                    />
                )
            }) : <Empty />}
        </>
    )
}

export default FilterSerial
