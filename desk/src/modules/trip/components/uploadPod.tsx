import React from "react";
import { Button, Card, useMediaQuery, useTheme } from "@mui/material";
import { Modal } from "antd";
import { useWindowSize } from "../../../lib/hooks";
import TripCardContainer from "../../../common/indentCardContainer";
import { useFrappeGetDoc } from "frappe-react-sdk";
import UploadButtonWithPreview from "../../../common/uploadButtonWithPreview";


interface Props {

    open: boolean;
    handleCancel: Function | any;
    indentId: any


}


const UploadPod = (props: Props) => {
    const { open, handleCancel, indentId } = props;



    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const common = { maxWidth: 1200, margin: '0 auto' }
    const desktop = { ...common, top: 20 }
    const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }
    const { height } = useWindowSize()
    const maxHeight = height - 110





    const { data, error, isValidating, mutate } = useFrappeGetDoc(
        'Indent',
       indentId
    );


const lr:any = data


console.log(lr?.lr_no)
    return (

        <div>

            <>
                <Modal
                    open={open}
                    title={"Upload POD"}
                    footer={null}
                    onCancel={handleCancel}
                    style={isMobile ? mobile : desktop}
                    width={isMobile ? '100%' : '60%'}
                    className="mobile_overlay"

                >
                    <TripCardContainer indentId={indentId} />
                    <div>

                        <div>
                            <Card sx={{ minWidth: 275, padding: 2 }}>

                                        <h6>LR no: {lr?.lr_no}</h6>
                            </Card>

                        </div>
                    </div>

                    <div className="mt-4">
                        {/* <UploadButtonWithPreview /> */}
                    </div>

                    <div className="pt-2 ">
                        <Button variant="contained" color="secondary" className="bottom-0 fixed" fullWidth >Update POD</Button>
                    </div>


                </Modal>

            </>



        </div>
    );
};

export default UploadPod;



