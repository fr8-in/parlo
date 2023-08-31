import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../../../common/listItem";
import CustomDrawer from "../../../common/customDrawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useDebounce } from "../../../lib/hooks/useDebounce";
import { ChangeEvent, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;
  type?: "full" | undefined;
  backdropClose?: boolean;
}


const SelectSupplier = (props: Props) => {
  const { open, onClose, callBack, onOpen } = props;
  const [search,setSearch] = useState<string>('')
  const debouncedValue = useDebounce<string>(search,300)

  const { data, error, isValidating, mutate } = useFrappeGetDocList(
    'Supplier',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],
        filters: [["supplier_group", "!=", "Raw Material"],["supplier_name",'like',`%${search?.length >= 3 ? search : ''}%`]]
    }
  );

  const onOk = (value: any) => {
    callBack(value);
    onClose();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(()=>{
    mutate()
},[debouncedValue])

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
                        placeholder="Search Supplier (Min 3 Letters)"
                        autoFocus
                        value={search}
                        onChange={handleChange}
                    />
        </div>
        <div className=" border-t overflow-y-auto">
          {
            (data && data?.length > 0) ? data?.map((supplier: any, index:number) => {
              return (
                <ListItem
                  classes={"even:bg-white odd:bg-slate-50 h-14"}
                  key={index}
                  title={supplier?.name}
                  handleClick={() => onOk(supplier)} />
              )
            }) : null
          }
        </div>

      </div>


    </CustomDrawer>

  );
};

export default SelectSupplier;