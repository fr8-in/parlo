import { useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import CustomDrawer from "./customDrawer";
import { IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BubbleLoading } from "./bubbleLoading";
import { Empty } from "antd";
import { ListItem } from "./listItem";

interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    type?: "full" | undefined;
    backdropClose?: boolean;
    placeholder: string
}

const SelectState = (props: Props) => {
    const { open, onClose, callBack, onOpen, placeholder = "Search State (Min 3 Letters)" } = props;
    const [search, setSearch] = useState("")

    const { data, isLoading } = useFrappeGetDocList(
        'State',
        {
            /** Fields to be fetched - Optional */
            fields: ["*"],
            filters: [["name", 'like', `%${search?.length >= 3 ? search : ''}%`]],
            limit: 20
        }
    );

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
            <>
                {
             
                        (
                            <>
                            <div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
                                <IconButton className="mt-3" onClick={onClose}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <TextField
                                    className="w-full"
                                    variant='standard'
                                    placeholder="Search State (Min 3 Letters)"
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                                <div className=" border-t overflow-y-auto">
                                    {
                                        data && data?.length > 0 ? data?.map((state: any, index:number) => {
                                            return (
                                                <ListItem
                                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                                    key={index}
                                                    title={state?.name}
                                                    handleClick={() => onOk(state)} />
                                            )
                                        }) : isLoading ?
                                            <div>
                                                <BubbleLoading />
                                            </div> : <Empty/>
                                    }
                                </div>
                            </>)

                }
            </>

        </CustomDrawer>

    );
};

export default SelectState;



