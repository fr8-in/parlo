import { useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useKeyPress, useShowHide } from "../../lib/hooks";
import { NoDataAdd } from "../noDataAdd";
import { IconButton, TextField } from "@mui/material";
import { BubbleLoading } from "../bubbleLoading";
import AddCustomer from "../../modules/indent/components/addCustomer";

interface Props {
  series: string,
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;

}

const SelectCustomer = (props: Props) => {
  const { open, onClose, callBack, onOpen, series } = props;
  const [search, setSearch] = useState("")

  const { data,isLoading } = useFrappeGetDocList(
    'Customer Naming Series',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],
      filters: [['naming_series', '=', `${series}`], ["name", 'like', `%${search?.length >= 3 ? search : ''}%`]],

    }
  );

  const onOk = (value: any) => {
    callBack(value)
    onClose();
  }

  const initial_show_hide = {
    showAddCustomer: false,
  }

  const { onHide, onShow, visible } = useShowHide(initial_show_hide)
  //When escape key is pressed , onClose function is triggered.
  useKeyPress('Escape',onClose);

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      type="full"
      backdropClose={false}
    >
      {
        visible.showAddCustomer ?
          <AddCustomer onClose={onHide} customer={search} callBack={onOk} series={series} />
          :
          (
            <><div className="flex justify-between items-center p-3 pl-0 h-16 gap-2">
              <IconButton className="mt-3" onClick={onClose}>
                <ArrowBackIcon />
              </IconButton>
              <TextField
                className="w-full"
                variant='standard'
                placeholder="Search Customer (Min 3 Letters)"
                autoFocus
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
              />
            </div>
              <div className=" border-t overflow-y-auto">
                {
                  data && data?.length > 0 ? data?.map((customer: any, index) => {

                    return (
                      <ListItem
                        classes={"even:bg-white odd:bg-slate-50 h-14"}
                        key={index}
                        title={customer?.name}
                        handleClick={() => onOk(customer?.customer)} />
                    )
                  }): isLoading ?
                  <div>
                      <BubbleLoading />
                  </div> : <NoDataAdd onAdd={() => {
                      onShow('showAddCustomer')
                  }} />
                }
              </div>
            </>)
      }
    </CustomDrawer>
  );
};

export default SelectCustomer;