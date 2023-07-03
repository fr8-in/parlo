import {
    DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Space } from 'antd';
import ProfileHeader from './profileHeader';
import { useFrappeAuth, useFrappeGetDocList } from "frappe-react-sdk";
import { useNavigate } from "react-router-dom";
import constants from "../lib/constants";
import Drawer from "@mui/material/Drawer";
import CancelIcon from '@mui/icons-material/Cancel';
import get from "lodash/get";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Divider from "@mui/material/Divider";
import { blueGrey, red } from "@mui/material/colors";
import util from "../lib/utils";

const Profile = (props: any) => {
    const { visible, onHide, company_name } = props
    const { logout } = useFrappeAuth()
    const navigate = useNavigate()

    const user = localStorage.getItem("currentUser")
    const { data } = useFrappeGetDocList<Array<any>>('User', { fields: ['*'], filters:[['email', '=', user]] })

    const users:any = get(data, '[0]', {})
    const { mobile_no, email } = users

    const handleLogout = () => {
        try {
            logout()
            localStorage.clear();
            util.clearAllCookies()
            navigate('/login')
        } catch (e) {
            console.log({ error: e });
        }
    }

    return (
        <Drawer
            onClose={onHide}
            anchor="right"
            open={visible}
            PaperProps={{
                sx: { maxWidth: "400px", width: '100%' }
            }}
        >
            <div className="flex flex-col h-screen relative">
                <ProfileHeader company_name={company_name} />
                <CancelIcon
                    onClick={onHide}
                    sx={{ position: 'absolute', top: 15, left: 15, opacity: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                />
                <div className="flex flex-1 w-full">
                    <List
                        sx={{ width: '100%' }}
                        component="nav"
                        aria-labelledby="profile list"
                    >
                        <ListItem>
                            <ListItemIcon>
                                <LocalPhoneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mobile" secondary={mobile_no} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <MailOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary="Email" secondary={email || "-"} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem onClick={handleLogout} sx={{cursor:"pointer", "&:hover": {background:blueGrey[50]}}}>
                            <ListItemIcon>
                                <PowerSettingsNewIcon sx={{color:red[600]}} />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </div>
                <div className="flex p-3 bg-slate-50 justify-between items-center">
                    <span className="text-xs text-slate-500">
                        <DeploymentUnitOutlined style={{ color: "#a4a4a4" }} /> Version:{" "}
                        {constants.VERSION}
                    </span>
                    <Space className="text-xs text-slate-500">
                        Powered By&nbsp;
                        <img src={'/digitify.png'} width={18} height={18} />
                    </Space>
                </div>
            </div>
        </Drawer>
    );
}

export default Profile
