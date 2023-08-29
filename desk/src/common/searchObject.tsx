import { Input } from "antd";
import colors from '../lib/colors';
import { SearchOutlined } from '@ant-design/icons';

const searchObject = (key: string, search: any, handleSearch:any) => ({
    filterDropdown: (
        <Input
            placeholder={`Search ${key}`}
            value={search[key]}
            onChange={(e) => handleSearch(e, key)}
        />
    ),
    filterIcon: () => (
        <SearchOutlined
            style={{ color: search[key] ? colors.blue : undefined }}
        />
    )
})

export default searchObject