import { useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { useState } from "react";
import { useShowHide } from "../../lib/hooks";
import { IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../noDataAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BubbleLoading } from "../bubbleLoading";
import AddConsignee from "../../modules/indent/components/addConsignee";

interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    type?: "full" | undefined;
    backdropClose?: boolean;
    customer: string
}

const SelectConsignee = (props: Props) => {
    const { open, onClose, callBack, onOpen, customer, type, backdropClose = true } = props;
    const [search, setSearch] = useState("")

    const { data,isLoading } = useFrappeGetDocList(
        'Customer Consignee',
        {
            /** Fields to be fetched - Optional */
            fields: ["*"],
            filters: [['customer', '=', `${customer}`], ["name", 'like', `%${search?.length >= 3 ? search : ''}%`]]

        }
    );

    const onOk = (value: any) => {
        callBack(value);
        onClose();
    };

    const initial_show_hide = {
        showAddConsignee: false,
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
                visible.showAddConsignee ?
                    <AddConsignee onClose={onHide} customer={customer} consignee={search} callBack={onOk} />
                    :
                    (
                        <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
                            <IconButton className="mt-3" onClick={onClose}>
                                <ArrowBackIcon />
                            </IconButton>
                            <TextField
                                className="w-full"
                                variant='standard'
                                placeholder="Search Consignee (Min 3 Letters)"
                                autoFocus
                                value={search}
                                onChange={(e: any) => setSearch(e.target.value)}
                            />
                        </div>
                            <div className=" border-t overflow-y-auto">
                                {
                                    data && data?.length > 0 ? data?.map((consignee: any, index:number) => {
                                        return (
                                            <ListItem
                                                classes={"even:bg-white odd:bg-slate-50 h-14"}
                                                key={index}
                                                title={consignee?.name}
                                                handleClick={() => onOk(consignee?.consignee)} />
                                        )
                                    }) : isLoading ?
                                    <div>
                                        <BubbleLoading />
                                    </div> : <NoDataAdd onAdd={() => {
                                        onShow('showAddConsignee')
                                    }} />
                                }
                            </div>
                        </>)
            }


        </CustomDrawer>
    );
}
export default SelectConsignee