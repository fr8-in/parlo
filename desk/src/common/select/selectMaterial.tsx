import CloseIcon from "@mui/icons-material/Close";
import { useFrappeGetDocList } from "frappe-react-sdk";
import {ListItem} from "../listItem";
import CustomDrawer from "../customDrawer";
import { Empty } from "antd";

interface Props {
  callBack: Function;
  open: boolean;
  onClose: Function | any;
  onOpen: Function | any;
}

const SelectItem = (props: Props) => {
  const { open, onClose, callBack, onOpen } = props;
 
  const { data } = useFrappeGetDocList(
    'Item',
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
          <h5 className="font-bold">Select Material</h5>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className=" border-t overflow-y-auto">
          {
            data?.length === 0 ? <Empty/>
             :
            data?.map((item:any, index:number) => {
              return (
                <ListItem
                  classes={"even:bg-white odd:bg-slate-50 h-12"}
                  key={index}
                  title={item?.name}
                  secondary={item?.item}
                  handleClick={() => onOk(item?.name)} 
                />
              )
            })
          }
        </div>
      </div>
    </CustomDrawer>

  );
};

export default SelectItem;
