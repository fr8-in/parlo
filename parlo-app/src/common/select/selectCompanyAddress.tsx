import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { NoDataAdd } from "../noDataAdd";
import { useShowHide } from "../../lib/hooks";
import { useFrappeGetDocList } from "frappe-react-sdk";
import isEmpty from "lodash/isEmpty";
import { get } from "lodash";
import AddCompanyAddress from "../../modules/indent/components/addCompanyAddress";


interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
}

export declare interface CompanyAddressType {
    name: string,
    creation: string,
    modified: string,
    modified_by: string,
    owner: string,
    docstatus: number,
    idx: number,
    address: string,
    pan: string,
    gst: string,
    short_name: string,
    _user_tags: any,
    _comments: any,
    _assign: any,
    _liked_by: any
}


const SelectCompanyAddress = (props: Props) => {
    const { open, onClose, callBack, onOpen } = props;

    const [search, setSearch] = useState('')
    const [lists, setLists] = useState<Array<any>>([])

    const initial = { showAddBank: false }
    const { onHide, onShow, visible } = useShowHide(initial)

    const { data, isLoading, mutate } = useFrappeGetDocList<CompanyAddressType>(
        'Company Address',
        {
            fields: ["*"]
        }
    )

    useEffect(() => {
        setLists(data)
    }, [!isEmpty(data) && get(data, '[0].name', null)])

    const handleSearch = (value: string) => {
        setSearch(value)
        const newList = data.filter((list: any) => list.name.includes(value))
        setLists(newList)
    }

    const onOk = (value: any) => {
        callBack(value);
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
                        placeholder="Search company address"
                        autoFocus
                        value={search}
                        onChange={(e: any) => handleSearch(e.target.value)}
                    />
                </div>
                <div className=" border-t overflow-y-auto">
                    {visible.showAddBank
                        ? (
                            <AddCompanyAddress
                                onClose={onHide}
                                callBack={onOk}
                                name={search}
                                mutate={mutate}
                            />
                        ) : lists?.length === 0
                            ? <NoDataAdd onAdd={() => onShow('showAddBank')} />
                            : lists?.map((list: any, index: number) => {
                                return (
                                    <ListItem
                                        classes={"even:bg-white odd:bg-slate-50 h-14"}
                                        key={index}
                                        title={list?.name}
                                        secondary={list?.address}
                                        handleClick={() => onOk(list)}
                                    />
                                )
                            })
                    }
                </div>
            </div>
        </CustomDrawer>
    );
};

export default SelectCompanyAddress;
