import { useState } from "react";
import { Indent, IndentType } from "../../../lib/types/indent";
import { Empty } from "antd";
import { useShowHide, useWindowSize } from "../../../lib/hooks";
import { useFrappeGetDocList } from "frappe-react-sdk";
import _default from "antd/lib/alert/style";
import LrEwayTab from "./lrEwayTab";
import { isEmpty } from "lodash";
import UploadPod from "./uploadPod";
import IndentCard from "../../indent/components/indentCard";


const EditTripIndent = (props: any) => {
    const { tripName, tripWorkflow } = props;

    const onChange = props?.onChange
    const initial = {
        showLrEwayTab: false,
        showUploadPod: false
    };

    const { visible, onHide, onShow } = useShowHide(initial);

    const [state, setState] = useState({
        indentId: "",
        lrNo: "",
        eWay: ""
    })

    const { height } = useWindowSize()
    const maxHeight = height - 80

    const indentInitial: IndentType = {
        indent_names: [],
        indents: [],
    }

    const { data, mutate } = useFrappeGetDocList<Indent>(
        'Indent',
        {
            /** Fields to be fetched - Optional */
            fields: ["*"],
            filters: [['trip', '=', `${tripName}`]],
        }
    );

    console.log({ indentData: data });


    const handleReset = () => {
        setIndent(indentInitial)
    }

    const [indent, setIndent] = useState<IndentType>(indentInitial)

    const handleIndentChange = (indent_name: number, checked: boolean) => {
        if (checked) {
            const selected = !data || isEmpty(data)
                ? []
                : data.filter((indent: any) => indent.name === indent_name);
            setIndent((prev: any) => ({
                ...prev,
                indent_names: [...prev.indent_names, indent_name],
                indents: [...prev.indents, ...selected],
            }));

            if (onChange) {
                onChange([...indent.indent_names, indent_name])
            }

        } else {
            setIndent((prev: any) => ({
                ...prev,
                indent_names: prev.indent_names.filter((in_name: any) => in_name !== indent_name),
                indents: prev.indents.filter((indent: any) => indent.name !== indent_name),
            }));
            if (onChange) {
                onChange([...indent.indent_names.filter((in_name: any) => in_name !== indent_name)])
            }
        }
    };

    return (
        (data && data?.length > 0) ?
            <div style={{ height: maxHeight }}>
                {data?.map((_data: any, index: number) => {
                    return (
                        <IndentCard hideLrEway mutate={mutate} indent={_data} onSelect={undefined} selected={[]} showItems={() => undefined} key={index} />
                    )
                })}
                {visible.showLrEwayTab ? (
                    <div style={{ maxHeight, overflow: 'auto' }}>
                        <LrEwayTab 
                        mutate={mutate} 
                        open={visible.showLrEwayTab} 
                        handleCancel={onHide} 
                        indentId={state.indentId} 
                        lrNo={state.lrNo} eWay={state.eWay} />
                    </div>
                ) : null
                }
                {visible.showUploadPod ?
                    <UploadPod open={visible.showUploadPod} handleCancel={onHide} indentId={state.indentId} />
                    : null}
            </div> : <Empty />
    )
}

export default EditTripIndent;
