import { Empty } from 'antd'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { ListItem } from '../listItem'
import Checkbox from '@mui/material/Checkbox'

interface UserType {
    name: string
}

interface Props {
    onSelect: Function
    selected: Array<string>
}
const FilterUser = (props: Props) => {
    const { onSelect, selected } = props
    const { data, error, isValidating, mutate } = useFrappeGetDocList<UserType>(
        "User", {
        fields: ["name"],
    })

    const onPressSeries = (name: string, isChecked: boolean) => {
        onSelect(name, isChecked)
    }

    return (
        <>
            {(data && data?.length > 0) ? data.map((user: UserType, i: number) => {
                const checkedFilter = selected?.filter(
                    (checked: any) => checked === user?.name
                );
                const isChecked = checkedFilter?.length > 0 ? true : false;
                return (
                    <ListItem
                        key={user?.name+i}
                        handleClick={() => onPressSeries(user?.name, !isChecked)}
                        icon={<Checkbox
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onPressSeries(user?.name, !isChecked)
                            }}
                            checked={isChecked}
                        />}
                        title={<p className="text-sm">{user?.name}</p>}
                        classes={i % 2 === 1 ? "bg-slate-50" : ""}
                    />
                )
            }) : <Empty />}
        </>
    )
}

export default FilterUser
