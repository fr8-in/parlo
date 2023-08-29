import { useState } from "react";
import { StyledTab, StyledTabs } from "../../common/styledTabs";
import IndentTableContainer from "./components/indentTableContainer";
import TabPanel from "../../common/tabPanel";
import { Empty } from "antd";
import OpenIndent from "./components/openIndent";
import PaymentContainer from "../trip/components/paymentContainer";
import IndentPaymentRequestContainer from "./components/indentPaymentRequestContainer";
import InvoiceTableContainer from "./components/invoiceTableContainer";

const Indents = () => {
    const [value, setValue] = useState(0)
    const handleStyleTag = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    }
    const indent_tabs = [{
        key: 0,
        label: "Open",
    },
    {
        key: 1,
        label: "Active",
    },
    {
        key: 2,
        label: "Delivered",
    },
    {
        key: 3,
        label: "Invoiced",
    },
    {
        key: 4,
        label: "All",
    },
    {
        key: 5,
        label: "Payments",
    },
    {
        key: 6,
        label: "Payment Request",
    }]

    const componenet: any = {
        0: <OpenIndent />,
        1: <IndentTableContainer tabKey="Active" />,
        2: <IndentTableContainer tabKey="Delivered" />,
        3: <InvoiceTableContainer />,
        4: <IndentTableContainer tabKey="All" />,
        5: <PaymentContainer type="indent" />,
        6: <IndentPaymentRequestContainer/>
    }
    
    return (
        <>
            <div className='bg-card p-0 flex justify-between items-center'>
                <StyledTabs value={value} onChange={handleStyleTag} scrollButtons={false} variant="scrollable" darkindicator="indicator-color">

                    {
                        indent_tabs.map((data: any, i: number) => {
                            return (
                                <StyledTab key={i}
                                    label={data.label}
                                />
                            )
                        })
                    }
                </StyledTabs>
            </div>
            {
                indent_tabs.map((data: any) => {
                    return (
                        <TabPanel index={data.key} value={value} key={data.key}>
                            <div className='border-t-2 h-full border-blue-600 bg-white pb-2 rounded-b-lg shadow-sm'>
                                {componenet[data.key] || <div className="p-3"><Empty /></div>}
                            </div>
                        </TabPanel>
                    )
                })
            }
        </>
    );
}

export default Indents
