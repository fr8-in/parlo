import { IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";

interface DrawerHeaderProps {
    title: string, onClick: any
}

const DrawerHeader = (props: DrawerHeaderProps) => {
    const { title, onClick } = props
    return (
        <div className="flex justify-between items-center border-b p-3 h-16 gap-3">
            <h5>{title}</h5>
            <IconButton className="mt-2 p-2" onClick={onClick} >
                <CloseIcon />
            </IconButton>
        </div>
    )
}

export default DrawerHeader