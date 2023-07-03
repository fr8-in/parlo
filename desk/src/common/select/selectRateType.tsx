import CloseIcon from "@mui/icons-material/Close";
import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../listItem";
import { Radio } from "@mui/material";
import CustomDrawer from "../customDrawer";

interface Props {
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;
  selected:any 
  isTruck?: boolean;
}

const SelectRateType = (props: Props) => {
  const { open, onClose, callBack, onOpen, selected,isTruck = true } = props;
  const { data, error, isValidating, mutate } = useFrappeGetDocList(
    'Truck Type',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],
      ...(isTruck ? { filters:[ ['is_per_kg','=','false'],['is_per_case','=','false']]} : {})
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


      <div>
        <div className="flex justify-between items-center p-3 h-16 gap-3">
          <h5 className="font-bold">Select Rate Type</h5>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className=" border-t overflow-y-auto">
          {data?.map((item: any, index) => {
            return (
              <ListItem
                classes={"even:bg-white odd:bg-slate-50 h-14"}
                key={index}
                icon={<Radio 
                  checked={item?.name === selected }
                  onClick={() => onOk(item?.name)} />}
                title={item?.name}
                handleClick={() => onOk(item)} />


            );
          })}
        </div>


      </div>


    </CustomDrawer>
    
  )
};

export default SelectRateType;



