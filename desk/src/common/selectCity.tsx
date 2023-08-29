import { useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "./listItem";
import CustomDrawer from "./customDrawer";
import { IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useShowHide } from "../lib/hooks";
import { BubbleLoading } from "./bubbleLoading";
import { NoDataAdd } from "./noDataAdd";
import AddCity from "../modules/indent/components/addCity";

interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    type?: "full" | undefined;
    backdropClose?: boolean;
    placeholder: string
}

const SelectCity = (props: Props) => {
    const { open, onClose, callBack, onOpen, placeholder = "Search City (Min 3 Letters)" } = props;
    const [search, setSearch] = useState("")

    const { data, isLoading } = useFrappeGetDocList(
        'City',
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

    const initial_show_hide = {
        showAddCity: false
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)

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
                    visible.showAddCity ?
                        <AddCity onClose={onHide} city={search} callBack={onOk} />
                        
                        :
                        (
                            <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
                                <IconButton className="mt-3" onClick={onClose}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <TextField
                                    className="w-full"
                                    variant='standard'
                                    placeholder="Search City (Min 3 Letters)"
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                                <div className=" border-t overflow-y-auto">
                                    {
                                        data && data?.length > 0 ? data?.map((city: any, index:number) => {
                                            return (
                                                <ListItem
                                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                                    key={index}
                                                    title={city?.name}
                                                    handleClick={() => onOk(city)} />
                                            )
                                        }) : isLoading ?
                                            <div>
                                                <BubbleLoading />
                                            </div> : <NoDataAdd onAdd={() => {
                                                onShow('showAddCity')
                                            }} />
                                    }
                                </div>
                            </>)

                }
            </>

        </CustomDrawer>

    );
};

export default SelectCity;



