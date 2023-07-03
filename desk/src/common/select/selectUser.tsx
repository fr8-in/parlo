import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useFrappeGetDocList } from "frappe-react-sdk";
import isEmpty from "lodash/isEmpty";
import { get } from "lodash";
import { Empty } from "antd";

interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
}

const SelectUser = (props: Props) => {
    const { open, onClose, callBack, onOpen } = props;

    const [search, setSearch] = useState('')
    const [lists, setLists] = useState<Array<any>>([])


    const { data } = useFrappeGetDocList<any>(
        'User', {
        fields: ["name"],
        caches: true
    })

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
                    {lists?.length === 0 ? <Empty /> :
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

export default SelectUser;
