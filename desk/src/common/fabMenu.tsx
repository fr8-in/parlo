import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import FilterNoneOutlinedIcon from "@mui/icons-material/FilterNoneOutlined";

interface Props {
    open: boolean, 
    handleReset: any, 
    actions: Array<any>
}
const FabMenu = (props: Props) => {
    const { open, handleReset, actions } = props;
    
    return (
        <>
            <SpeedDial
                ariaLabel="Indent Management"
                sx={{ position: "fixed", bottom: 20, right: 20, background: "primary" }}
                icon={
                    open ? <LibraryAddCheckOutlinedIcon /> : <FilterNoneOutlinedIcon />
                }
                onClick={handleReset}
                open={open}
            >
                {actions.map((action:any) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.handleClick();
                        }}
                        tooltipTitle={action.name}
                        FabProps={{
                            sx: action.f_props,
                        }}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

export default FabMenu;
