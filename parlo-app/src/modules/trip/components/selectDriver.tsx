import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../../../common/listItem";
import CustomDrawer from "../../../common/customDrawer";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDebounce } from "../../../lib/hooks/useDebounce";
interface Props {
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;
  type?: "full" | undefined;
  backdropClose?: boolean;
}


const SelectDriver = (props: Props) => {
  const { open, onClose, callBack, onOpen } = props;
  const [search,setSearch] = useState<string>('')
  const debouncedValue = useDebounce<string>(search,300)

  const { data, error, isValidating, mutate } = useFrappeGetDocList(
    'Driver',
    {
      fields: ["*"],
      filters:[
        ["full_name", 'like', `%${search?.length >= 3 ? search : ''}%`]
      ]
    }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(()=>{
      mutate()
  },[debouncedValue])


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
                        placeholder="Search Driver (Min 3 Letters)"
                        autoFocus
                        value={search}
                        onChange={handleChange}
                    />
        </div>
        <div className=" border-t overflow-y-auto">
          {
            data?.map((driver:any, index:number) => {
              const driverName = driver?.full_name && driver?.cell_number ? `${driver?.full_name} - ${driver?.cell_number}` : driver?.full_name || driver?.cell_number
              return (
                <ListItem
                  classes={"even:bg-white odd:bg-slate-50 h-14"}
                  key={index}
                  title={driverName}
                  handleClick={() => onOk(driver)} />
              )
            })
          }
        </div>

      </div>


    </CustomDrawer>

  );
};

export default SelectDriver;



