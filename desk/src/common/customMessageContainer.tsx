import { Modal } from "antd";
import { useWindowSize } from "../lib/hooks/useWindowSize";
import { CustomMessageContainerProps } from "../lib/types/customMessage";
import CustomDrawer from "./customDrawer";
import DrawerHeader from "./drawerHeader";

const CustomMessageContainer = (props: CustomMessageContainerProps) => {
    const { visible, title, onHide, children, onOpen, button, className, footer } = props
    const size = useWindowSize();
    const isSm = size.width <= 640

    return (
        !isSm ? (
            <Modal
                key={0}
                className={className}
                open={visible}
                maskClosable={false}
                footer={[
                    footer ? footer :
                        <div className="self-end pr-2" key={0}>
                            {button}
                        </div>
                ]}
                title={title}
                onCancel={onHide}
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    overflow: "hidden",
                    padding: 0,
                    borderBottom: '0px'
                }}
            >
                {children}

            </Modal>
        ) : (   
            <CustomDrawer
                key={0}
                open={visible}
                onClose={onHide}
                onOpen={onOpen}
                backdropClose={true}
            >
                <div className="flex flex-col justify-between min-h-[384px] shadow-sm px-2 w-full" key={0}>
                    <div>
                        <DrawerHeader title={title} onClick={onHide} />
                        {children}
                    </div>
                    {button}
                </div>

            </CustomDrawer>
        )
    )
}

export default CustomMessageContainer