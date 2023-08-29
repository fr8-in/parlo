import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { IconButton, TextField } from "@mui/material";
import AddSupplierBank from "../../modules/trip/components/addSupplierBank";
import { NoDataAdd } from "../noDataAdd";
import { useShowHide } from "../../lib/hooks";

interface Props {
    callBack: Function;
    keyName: string;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    supplierBank: Array<any>
    supplier_name: string
}

const SelectSupplierBank = (props: Props) => {
    const { open, onClose, callBack, onOpen, supplierBank, keyName, supplier_name } = props;

    const [search, setSearch] = useState('')
    const [lists, setLists] = useState<Array<any>>([])

    const initial = { showAddBank : false}
    const { onHide, onShow, visible } = useShowHide(initial)

    useEffect(()=>{
        setLists(supplierBank)
    }, [supplierBank[0]?.name])

    const handleSearch = (value:string) => {
        setSearch(value)
        const newList = supplierBank.filter((list) => list.name.includes(value))
        setLists(newList)
    }

    const onOk = (value: any) => {
        callBack(keyName, value.name);
        onClose();
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
                        placeholder="Search Supplier Bank"
                        autoFocus
                        value={search}
                        onChange={(e: any) => handleSearch(e.target.value)}
                    />
                </div>
                <div className=" border-t overflow-y-auto">
                    {visible.showAddBank ?
                        <AddSupplierBank
                            onClose={onHide}
                            bank_data={supplierBank}
                            callBack={onOk}
                            supplier_name={supplier_name}
                            account_no={search}
                        />
                    : lists?.length === 0 ? <NoDataAdd onAdd={() => onShow('showAddBank')} /> :
                        lists?.map((list: any, index: number) => {
                            return (
                                <ListItem
                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                    key={index}
                                    title={list?.name}
                                    handleClick={() => onOk(list)} />
                            )
                        })
                    }
                    
                </div>
            </div>
            
        </CustomDrawer>
    );
};

export default SelectSupplierBank;



