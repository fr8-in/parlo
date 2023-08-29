import AddIcon from "@mui/icons-material/Add";
import NoIndentSvg from '../lib/icons/noIndentSvg'
import { Button } from "@mui/material";

export const NoDataAdd = (props:any) => {
    const { title, onAdd } = props
    return (
        <div className="w-full h-full mt-[30%] md:mt-[10%] p-2">
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <NoIndentSvg className="w-24 h-24 md:w-15 md:h-15 lg:w-24 lg:h-24" />
                    <p className="py-2">Add {title} to continue...</p>
                    <Button
                        color="secondary"
                        startIcon={<AddIcon />}
                        variant="contained"
                        disableElevation
                        onClick={onAdd}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}