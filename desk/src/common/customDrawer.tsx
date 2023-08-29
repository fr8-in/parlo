import React, { ReactNode } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { common } from "@mui/material/colors";

interface Props {
    /** Drawer open close state  */
    open: boolean;
    /** Drawer onClose function */
    onClose: Function | any;
    /** Drawer onOpen function */
    onOpen: Function | any;
    /** Drawer children element */
    children: ReactNode | string;
    /** Drawer type full | undefined */
    type?: "full";
    /** Drawer BAckdrop closeable */
    backdropClose?: boolean;
    /** Determine with of the drawer content area */
    maxWidth?: number
}

/**
 * Simplified and mobile frendly MUI CustomDrawer
 * Part of `@fr8/ui` shared library.
 * @returns React JSXElement -> CustomDrawer
*/

 const CustomDrawer = (props: Props) => {
     const { open, onClose, onOpen, type, backdropClose, maxWidth = 360 } = props;

    const theme = useTheme();
    const sm_screen = useMediaQuery(theme.breakpoints.down("sm"));
    const anchor = sm_screen ? "bottom" : "right";
    const radius = sm_screen && !type ? 20 : 0;
    const drawer = <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        PaperProps={{
            elevation: 0,
            style: {
                maxWidth: sm_screen ? '100%' : maxWidth,
                width: '100%',
                borderTopLeftRadius: radius,
                borderTopRightRadius: radius,
                ...(type === "full" && sm_screen ? { height: "100vh" } : {}),
            },
        }}
        variant={backdropClose ? "temporary" : "persistent"}
    >
        {/* <div className={sm_screen ? "" : "w-[400px]"}>{props.children}</div> */}
        {props.children}
    </SwipeableDrawer>
    return (
        backdropClose ? drawer :
            <Backdrop
                sx={{ color: common.white, zIndex: 1052 }}
                open={open}
                onClick={backdropClose ? onClose : undefined}
            >
                {drawer}
            </Backdrop>
    );
};

export default CustomDrawer
