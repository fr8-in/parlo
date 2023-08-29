import React, { ReactNode, useState } from "react";
import Drawer from '@mui/material/Drawer';
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList
} from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

import MenuIcon from '@mui/icons-material/Menu';
import { blueGrey, common, lightBlue } from "@mui/material/colors";

interface MenuProp {
    name: string
    to: string
    icon: ReactNode
}

interface Props {
    menus: Array<MenuProp>
}

function DrawerMenu(props: Props) {
    const { menus } = props
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const closeDrawer = () => setOpenDrawer(false)
    const toggleDrawer = () => setOpenDrawer((prev: boolean) => !prev)
    const handleMenuClick = (path: string) => {
        closeDrawer()
        navigate(path)
    }
    return (
        <>
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                <MenuIcon />
            </IconButton>

            <Drawer
                open={openDrawer}
                onClose={closeDrawer}
                PaperProps={{ sx: { width: 280 } }}
            >
                <MenuList sx={{ width: '100%', height: '100%' }} className='overflow-y-auto scrollbar'>
                    {menus.map((menu: any) => {
                        return (
                            <MenuItem
                                key={menu.name}
                                onClick={() => handleMenuClick(`/${menu.to}`)}
                                sx={{
                                    width: '100%',
                                    borderBottom: `solid 1px ${blueGrey[50]}`,
                                    py: 1.5,
                                    backgroundColor: pathname === `/${menu.to}` ? '#113261' : common.white,
                                    color: pathname === `/${menu.to}` ? common.white : blueGrey[900],
                                    '&:hover': { backgroundColor: pathname === `/${menu.to}` ? lightBlue[900] : blueGrey[50] }
                                }}
                            >
                                <ListItemIcon>
                                    {React.cloneElement(
                                        menu.icon,
                                        { sx: { color: pathname === `/${menu.to}` ? common.white : blueGrey[800] } },
                                        null
                                    )}
                                </ListItemIcon>
                                <ListItemText>{menu.name}</ListItemText>
                            </MenuItem>)
                    })}
                </MenuList>
            </Drawer>
        </>
    );
}
export default DrawerMenu;
