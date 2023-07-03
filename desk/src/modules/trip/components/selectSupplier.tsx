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


const SelectSupplier = (props: Props) => {
  const { open, onClose, callBack, onOpen } = props;
  const { data, error, isValidating, mutate } = useFrappeGetDocList(
    'Supplier',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],
        filters: [["supplier_group", "!=", "Raw Material"]]
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
          <h5 className="font-bold">Select Supplier</h5>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
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



