import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Filter, useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../noDataAdd";
import { useShowHide } from "../../lib/hooks";
import AddFuelStation from "../../modules/trip/components/addFuelStation";


interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;

}

/**
 * Fuel station list from supplier as "supplier_group", "=", "Raw Material"
 * @param props refer interface
 * @returns 
 */

const SelectFuelStation = (props: Props) => {
    const { open, onClose, callBack, onOpen } = props;
    const [search, setSearch] = useState('')

    const nameFilter: Filter[] = search?.length >= 3 ? [['supplier_name', 'like', `%${search}%`]] : []
    const { data, mutate } = useFrappeGetDocList('Supplier', { fields: ["*"], filters: [["supplier_group", "=", "Raw Material"], ...nameFilter] })

    const initial = { showAddStation: false }
    const { onHide, onShow, visible } = useShowHide(initial)

    useEffect(() => {
        mutate()
    }, [search && search.length > 2])

    const onOk = (value: any) => {
        callBack(value)
    };

    return (
        <CustomDrawer
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            type="full"
            backdropClose={false}
        >
            <div>
                <div className="flex justify-between items-center p-3 h-16 gap-3">
                    <IconButton className="mt-3" onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <TextField
                        className="w-full"
                        variant='standard'
                        placeholder="Search Customer Location (Min 3 Letters)"
                        autoFocus
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                    />
                </div>
                <div className="border-t overflow-y-auto">
                    {visible.showAddStation ?
                        <AddFuelStation
                            onClose={onHide}
                            supplier_data={data}
                            callBack={onOk}
                            supplier_name={search}
                        />
                        :
                    data?.length === 0 ? <NoDataAdd onAdd={() => onShow('showAddStation')} /> :
                        data?.map((station: any, index: number) => {
                            console.log({station})
                            return (
                                <ListItem
                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                    key={index}
                                    title={station?.name}
                                    handleClick={() => onOk(station.name)}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </CustomDrawer>
    );
};

export default SelectFuelStation;
