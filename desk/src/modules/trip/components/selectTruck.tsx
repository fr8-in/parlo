import { useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../../../common/listItem";
import { Chip, IconButton, TextField } from "@mui/material";
import { NoDataAdd } from "../../../common/noDataAdd";
import AddTruck from "./addTruck";
import CustomDrawer from "../../../common/customDrawer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useShowHide } from "../../../lib/hooks";
import { BubbleLoading } from "../../../common/bubbleLoading";

interface Props {
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;
  type?: "full" | undefined;
  backdropClose?: boolean;
}

const SelectTruck = (props: Props) => {
  const { open, onClose, callBack, onOpen } = props;
  const [search, setSearch] = useState("")

  const { data, isLoading, isValidating, mutate } = useFrappeGetDocList<any>(
    'Truck',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],

      filters: [["truck_status", "=", "Waiting for load"], ["number", 'like', `%${search?.length >= 3 ? search : ''}%`]]
    }
  );

  const initial_show_hide = {
    showAddTruck: false,
  }

  const { onHide, onShow, visible } = useShowHide(initial_show_hide)

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
          visible.showAddTruck ?
            <AddTruck onClose={onHide} truck_no={search} callBack={onOk} />
            :
            (
              <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
                <IconButton className="mt-3" onClick={onClose}>
                  <ArrowBackIcon />
                </IconButton>
                <TextField
                  className="w-full"
                  variant='standard'
                  placeholder="Search Truck (Min 3 Letters)"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
                <div className=" border-t overflow-y-auto">
                  {
                    data && data?.length > 0 ? data?.map((truck: any, index:number) => {
                      const categoryColor = truck?.category == 'Market' ? "warning" : 'secondary'
                      return (
                        <ListItem
                          classes={"even:bg-white odd:bg-slate-50 h-14"}
                          key={index}
                          extra={<Chip variant="filled" color={categoryColor} label={truck?.category} />}
                          title={truck?.number}
                          secondary={truck?.truck_type}
                          handleClick={() => onOk(truck)} />
                      )
                    }) : isLoading ?
                    <div>
                        <BubbleLoading />
                    </div> : <NoDataAdd onAdd={() => {
                        onShow('showAddTruck')
                    }} />
                  }
                </div>
              </>)
        }
      </>
    </CustomDrawer>
  );
};

export default SelectTruck;



