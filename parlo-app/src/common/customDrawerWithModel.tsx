import CloseIcon from "@mui/icons-material/Close";
import { Backdrop } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Modal } from "antd";
import React, { ReactNode } from "react";
import CustomDrawer from "./customDrawer";

interface Props {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  onOpen: (e: React.MouseEvent<HTMLElement>) => void;
  title?: string;
  footer?: React.ReactNode;
  type?: "full";
  backdropClose?: boolean;
  model_width?: number;
}
const CustomDrawerWithModal = (props: Props) => {
  const {
    open,
    onClose,
    onOpen,
    title,
    footer = null,
    type,
    backdropClose,
    model_width = 700,
  } = props;

  const theme = useTheme();
  const sm_screen = useMediaQuery(theme.breakpoints.down("sm"));
  
  return sm_screen ? (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      type={type}
      backdropClose={backdropClose}
    >
      <div className="md:mb-5 mb-3 relative">
        {!title ? (
          <div className="text-center bg-slate-400 border-b border-4 rounded-lg top-3 w-9 absolute left-1/2 transform -translate-x-1/2"></div>
        ) : (
          <div className="flex justify-between items-center p-4 fixed w-full bg-white rounded-3xl z-10">
            <h4>{title}</h4>
            <button className="-mr-2" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        )}
        {/* <div className={`${!title ? "py-10" : "pt-16 pb-10"}`}>{children}</div> */}
        <div className="fixed bottom-0 right-0 left-0  p-4 z-10 bg-white">{footer}</div>
      </div>
    </CustomDrawer>
  ) : (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={open}
    >
      <Modal
        open={open}
        title={title}
        onCancel={onClose}
        maskClosable={backdropClose}
        centered
        bodyStyle={
          !title
            ? {
                padding: "40px 5px 5px 5px",
              }
            : { padding: 5 }
        }
        width={model_width}
        footer={footer}
      >
        {/* <div className={`md:my-3 ${!title ? "mt-5" : ""}`}>{children}</div> */}
      </Modal>
    </Backdrop>
  );
};

export default CustomDrawerWithModal;
