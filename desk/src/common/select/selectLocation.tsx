import { useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { useState } from "react";
import { useShowHide } from "../../lib/hooks";
import { IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../noDataAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BubbleLoading } from "../bubbleLoading";
import AddLocation from "../../modules/indent/components/addLocation";

interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
}

const SelectLocation = (props: Props) => {
    const { open, onClose, callBack, onOpen } = props;
    const [search, setSearch] = useState("")

    const { data,isLoading } = useFrappeGetDocList(
        'Locations',
        {
            /** Fields to be fetched - Optional */
            fields: ["*"],
            filters: [["address_title", 'like', `%${search?.length >= 3 ? search : ''}%`]],
        }
    );

    const onOk = (value: any) => {
        callBack(value);
        onClose();
    };

    const initial_show_hide = {
        showAddCustomerLocation: false,
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
            {
                visible.showAddCustomerLocation ?
                    <AddLocation onClose={onHide} callBack={onOk} name={search} />
                    :
                    (
                        <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
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
                            <div className=" border-t overflow-y-auto">
                                {
                                    data && data?.length > 0 ? data?.map((location: any, index:number) => {
                                        return (
                                            <ListItem
                                                classes={"even:bg-white odd:bg-slate-50 h-14"}
                                                key={index}
                                                title={location?.address_title}
                                                secondary={location?.address_line1}
                                                handleClick={() => onOk(location?.address_title)} />
                                        )
                                    }) : isLoading ?
                                    <div>
                                        <BubbleLoading />
                                    </div> : <NoDataAdd onAdd={() => {
                                        onShow('showAddCustomerLocation')
                                    }} />
                                }
                            </div>
                        </>)
            }
        </CustomDrawer>
    );
}
export default SelectLocation