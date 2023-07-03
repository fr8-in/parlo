import CloseIcon from "@mui/icons-material/Close";
import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../../../common/listItem";
import CustomDrawer from "../../../common/customDrawer";

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
  const { data, error, isValidating, mutate } = useFrappeGetDocList(
    'Driver',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"]
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
          <h5 className="font-bold">Select Driver</h5>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
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



