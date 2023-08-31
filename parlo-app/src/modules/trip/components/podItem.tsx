
import { UploadOutlined } from "@ant-design/icons";
import {Table} from "antd";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useShowHide } from "../../../lib/hooks";
import { IndentType } from "../../../lib/types/indent";
import PodFabMenu from "./podFabMenu";
import UploadPod from "./uploadPod";
import Button from "@mui/material/Button";

export const PodItem = (props: any) => {
    const { indentData, mutate } = props
    const onChange = props?.onChange
    const selectedList = props?.selectedList
    const initial = { showUploadPod: false };
    const { visible, onHide, onShow } = useShowHide(initial);
    const [state, setState] = useState("")

    const indentInitial: IndentType = {
        indent_names: [],
        indents: []
    }
    const handleReset = () => {
        setIndent(indentInitial)
    }
    const [indent, setIndent] = useState<IndentType>(indentInitial)

    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        setIndent({ ...indent, indent_names: selectedRowKeys, indents: selectedRows })
        if (onChange) onChange(selectedRowKeys)
    }

    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: indent.indent_names,
        onChange: onSelectChange
    }
    const columns = [
        {
            title: "POD",
            dataIndex: "pod",
            render: (record: any) => {
                return (
                    <Button endIcon={<UploadOutlined />} 
                    onClick={() => {
                        setState(record?.name)
                        onShow("showUploadPod")
                    }} />

                )
            }

        },

        {
            title: "S.No",
            dataIndex: "series"
        },
        {
            title: "Created At",
            dataIndex: "created_at"
        },
        {
            title: "Customer",
            dataIndex: "customer"
        },
        {
            title: "Source",
            dataIndex: "source"
        },
        {
            title: "Consignee",
            dataIndex: "consignee"
        },
        {
            title: "Destination",
            dataIndex: "destination"
        },
        {
            title: "Employee",
            dataIndex: "employee"
        },
        {
            title: "Case",
            dataIndex: "case"
        },
        {
            title: "Weight",
            dataIndex: "weight"
        },
        {
            title: "Type",
            dataIndex: "type"
        },
        {
            title: "Price",
            dataIndex: "price"
        }
    ]
console.log(setState)
    return (
        <>
            <Table
                columns={columns}
                dataSource={indentData}
                pagination={false}
                size="small"
                rowKey={record => record.name}
                rowSelection={{ ...rowSelection }} />

            {
                visible.showUploadPod ? (
                    <UploadPod open={visible.showUploadPod} handleCancel={onHide} indentId={state} />
                ) : null
            }

            {isEmpty(indent.indent_names || selectedList) ? null : (
                <PodFabMenu selected={indent} reset={handleReset} mutate={mutate} indentId={state} />)}
        </>
    )
}
