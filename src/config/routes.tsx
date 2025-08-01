import {
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    ImageSearchOutlined,
    EventAvailable,
    Security,
    Today,
    Home,
    Person2TwoTone,
    
} from '@mui/icons-material';
import Badge from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import BookOnline from '@mui/icons-material/BookOnline';

export const MAIN_ROUTE = 'main'
export const GENERAL_ROUTE = 'core'
export const USER_ROUTE = 'user'

export const PASSSINBIZ_MODULE_ROUTE = 'passinbiz'
export const CHECKINBIZ_MODULE_ROUTE = 'checkinbiz'

const PASSINBIZ = [ {
    name: 'Holders',
    icon: <BookOnline />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`,
    subMenu: []
}, {
    name: 'Events',
    icon: <Today />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`,
    subMenu: []
}, {
    name: 'Staff',
    icon: <Security />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/staff`,
    subMenu: []
}]


const CHECKINBIZ: any = [{
    name: 'home',
    icon: <Home />,
    link: `/${MAIN_ROUTE}/${CHECKINBIZ_MODULE_ROUTE}/onboarding`,
    subMenu: []
}, {
    name: 'Employee',
    icon: <Person2TwoTone />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/employee`,
    subMenu: []
}]

export const menuItemsHome = [{
    id: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: `/${MAIN_ROUTE}/${GENERAL_ROUTE}/dashboard`,
    subMenu: []
},
{
    divider: true,
    subMenu: []
}
]

export const menuItemsServices = [{
    id: 'services',
    name: 'Services',
    header: true, subMenu: []
}, {
    id: 'checkinbiz',
    name: 'CheckinBiz',
    icon: <EventAvailable />,
    link: `/${MAIN_ROUTE}/checkinbiz/onboarding`,
    subMenu: CHECKINBIZ
},
{
    id: 'passinbiz',
    name: 'PassinBiz',
    icon: <Badge />,
    link: `/${MAIN_ROUTE}/passinbiz/onboarding`,
    subMenu: PASSINBIZ
},
{
    divider: true,
    subMenu: []
}]


export const menuItemsGeneral = [
    {
        id: 'Settings',
        name: 'Settings',
        header: true, subMenu: []
    },

    {
        divider: true,
        subMenu: []
    },
    {
        name: 'Entity',
        icon: <BusinessIcon />,
        link: `/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity`,
        subMenu: []
    },
    {
        name: 'Media',
        icon: <ImageSearchOutlined />,
        link: `/${MAIN_ROUTE}/${GENERAL_ROUTE}/media`,
        subMenu: []
    }
]