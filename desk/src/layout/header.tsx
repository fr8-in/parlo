import React, { ReactNode } from 'react';
import {
    AppBar,
    Toolbar,
    CssBaseline,
    useTheme,
    useMediaQuery,
    Button,
    Stack,
    Avatar,
} from '@mui/material';
import { Link, useNavigate, useLocation } from "react-router-dom";
import DrawerMenu from "./drawerMenu";
import { common, blueGrey, blue } from "@mui/material/colors";
import { useFrappeGetDocList } from "frappe-react-sdk";
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
// import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
// import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
// import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
// import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
// import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { get } from 'lodash';
import util from '../lib/utils';
import { useShowHide } from '../lib/hooks';
import Profile from './profile';
import Filter from '../common/filter/filter';

interface MenuProp {
    name: string
    to: string
    icon: ReactNode
}

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location

    const initial = { profile: false, filter: false };
    const { visible, onShow, onHide } = useShowHide(initial)

    const { data } = useFrappeGetDocList<Array<{ name: string }>>('Company', { fields: ['name'], orderBy: { field: 'creation', order: 'asc' } })

    const company: { name: string } = get(data, '[0]', { name: 'Unknown' })

    const handleCreateIndent = () => {
        navigate('/indent/create')
    }

    const iconStyle = (path: string) => ({
        color: pathname === `/${path}` ? common.white : blueGrey[300],
        fontSize: 16
    })

    const menus: Array<MenuProp> = [
        { name: 'Indent', to: '', icon: <WarehouseOutlinedIcon /> },
        { name: 'Trip', to: 'trip', icon: <CompareArrowsOutlinedIcon /> },
        // { name: 'Way Bill', to: 'eway', icon: <ReceiptLongOutlinedIcon /> },
        // { name: 'Customer', to: 'customer', icon: <SentimentSatisfiedAltOutlinedIcon /> },
        // { name: 'Consignee', to: 'consignee', icon: <ContactPageOutlinedIcon /> },
        // { name: 'Supplier', to: 'supplier', icon: <PersonPinCircleOutlinedIcon /> },
        // { name: 'Truck', to: 'truck', icon: <LocalShippingOutlinedIcon /> }
    ]

    return (
        <AppBar position="static" elevation={0}>
            <CssBaseline />
            <Toolbar>
                <div className={'block basis-10 flex-grow'}>
                    <Link to="/" className='inline-block'>
                        <Avatar sx={{ bgcolor: blue[600], fontWeight: 700 }}>{util.avatar(company?.name)}</Avatar>
                    </Link>
                </div>
                {!isMobile ? (
                    <div className='mr-2 flex'>
                        {menus.map((menu: any) => {
                            return (
                                <Link
                                    key={menu.name}
                                    to={`/${menu.to}`}
                                    className={`group link px-2 py-1 rounded-lg hover:text-white ${pathname === `/${menu.to}` ? 'bg-black-30 text-white border-b border-twhite-30' : 'text-slate-300'}`}
                                >
                                    {React.cloneElement(
                                        menu.icon,
                                        { sx: iconStyle(menu.to), className: 'group-hover:text-white' },
                                        null
                                    )
                                    }{' '}{menu.name}
                                </Link>
                            )
                        })}
                    </div>
                ) : null}
                <Stack direction={'row'} gap={1} justifyItems='center' alignItems={'center'}>
                    <Button
                        color='secondary'
                        size='small'
                        variant='contained'
                        sx={{ borderRadius: 40, px: 1.5 }}
                        startIcon={<AddOutlinedIcon />}
                        onClick={handleCreateIndent}
                    >
                        Indent
                    </Button>
                    <Button onClick={() => onShow("filter")} color='primary' size='small' variant='contained' sx={{ borderRadius: 40, px: 0.5, minWidth: 'auto' }}>
                        <FilterAltOutlinedIcon fontSize='small' sx={{ color: common.white }} onClick={()=>{}} />
                    </Button>
                    <Button onClick={() => onShow("profile")} color='primary' size='small' variant='contained' sx={{ borderRadius: 40, px: 0.5, minWidth: 'auto' }}>
                        <PermIdentityOutlinedIcon fontSize='small' sx={{ color: common.white }} />
                    </Button>
                    {isMobile ? <DrawerMenu menus={menus} /> : null}
                    {visible.profile &&  <Profile visible={visible.profile} onHide={onHide} company_name={company?.name} />}
                    {visible.filter && <Filter open={visible.filter} onClose={onHide} onOpen={()=>onShow('filter')} />}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
