import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../noDataAdd";
import { useShowHide } from "../../lib/hooks";
import { useFrappeGetDocList } from "frappe-react-sdk";
import isEmpty from "lodash/isEmpty";
import { get } from "lodash";
import AddCompanyBank from "../../modules/trip/components/addCompanyBank";


interface Props {
    callBack: Function;
    keyName: string;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
}


const SelectCompanyBank = (props: Props) => {
    const { open, onClose, callBack, onOpen, keyName } = props;

    const [search, setSearch] = useState('')
    const [lists, setLists] = useState<Array<any>>([])

    const initial = { showAddBank : false}
    const { onHide, onShow, visible } = useShowHide(initial)

    const { data: bank } = useFrappeGetDocList('Company Bank', {
        fields: ["*"],
        caches: true
    })

    useEffect(()=>{
        setLists(bank)
    }, [!isEmpty(bank) && get(bank, '[0].name', null)])

    const handleSearch = (value:string) => {
        setSearch(value)
        const newList = bank.filter((list:any) => list.name.includes(value))
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
                        placeholder="Search company Bank"
                        autoFocus
                        value={search}
                        onChange={(e: any) => handleSearch(e.target.value)}
                    />
                </div>
                <div className=" border-t overflow-y-auto">
                    {visible.showAddBank ?
                        <AddCompanyBank
                            onClose={onHide}
                            bank_data={bank}
                            callBack={onOk}
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

export default SelectCompanyBank;



