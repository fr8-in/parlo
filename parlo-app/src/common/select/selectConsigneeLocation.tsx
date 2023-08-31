import { useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { useShowHide } from "../../lib/hooks";
import { IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../noDataAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BubbleLoading } from "../bubbleLoading";
import AddConsigneeLocation from "../../modules/indent/components/addConsigneeLocation";



interface Props {
    consignee: string;
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;

}
const SelectConsigneeLocation = (props: Props) => {
    const { open, onClose, callBack, onOpen, consignee } = props;
    const [search, setSearch] = useState("")

    const { data, isLoading } = useFrappeGetDocList(
        'Consignee Location',
        {
            /** Fields to be fetched - Optional */
            fields: ["*"],
            filters: [['consignee', '=', `${consignee}`], ["name", 'like', `%${search?.length >= 3 ? search : ''}%`]],

        }
    );

    const onOk = (value: any) => {
        callBack(value);
        onClose();
    };

    const initial_show_hide = {
        showAddConsigneeLocation: false,
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
                visible.showAddConsigneeLocation ?
                    <AddConsigneeLocation onClose={onHide} consigneeLocation={search} consignee={consignee} callBack={onOk} />
                    :
                    (
                        <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
                            <IconButton className="mt-3" onClick={onClose}>
                                <ArrowBackIcon />
                            </IconButton>
                            <TextField
                                className="w-full"
                                variant='standard'
                                placeholder="Search Consignee Location (Min 3 Letters)"
                                autoFocus
                                value={search}
                                onChange={(e: any) => setSearch(e.target.value)}
                            />
                        </div>
                            <div className=" border-t overflow-y-auto">
                                {
                                    data && data?.length > 0 ? data?.map((consigneeLocation: any, index) => {
                                        return (
                                            <ListItem
                                                classes={"even:bg-white odd:bg-slate-50 h-14"}
                                                key={index}
                                                title={consigneeLocation?.name}
                                                handleClick={() => onOk(consigneeLocation?.name)} />
                                        )
                                    }) : isLoading ?
                                        <div>
                                            <BubbleLoading />
                                        </div> : <NoDataAdd onAdd={() => {
                                            onShow('showAddConsigneeLocation')
                                        }} />
                                }
                            </div>
                        </>)
            }

        </CustomDrawer>
    );
}
export default SelectConsigneeLocation