import { Table } from "antd"

export const IndentItem = (props: any) => {
    const { indentItem } = props
    
    const columns = [{
        title: "Item",
        dataIndex: "item"
    },
    {
        title: "Weight",
        dataIndex: "weight"
    },
    {
        title: "Cases",
        dataIndex: "cases"
    },
    {
        title: "Unit Price",
        dataIndex: "unit_price"
    },
    {
        title: "Amount",
        dataIndex: "amount"
    }]
    return (
        <Table
            columns={columns}
            dataSource={indentItem}
            rowKey={(record:any)=>record.name}
            pagination={false}
            size="small" 
        />
    )
}
