import {
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    ImageSearchOutlined,
    CreditCardOff,
    Person2TwoTone,
    Today,
    CardGiftcard,
    Home
} from '@mui/icons-material';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';

export const MAIN_ROUTE = 'main'
export const GENERAL_ROUTE = 'core'
export const USER_ROUTE = 'user'

export const PASSSINBIZ_MODULE_ROUTE = 'passinbiz'
export const CHECKINBIZ_MODULE_ROUTE = 'checkinbiz'

const PASSINBIZ = [{
    name: 'home',
    icon: <Home />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/onboarding`,
    subMenu: []
}, {
    name: 'Holders',
    icon: <GroupIcon />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`,
    subMenu: []
}, {
    name: 'Events',
    icon: <Today />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`,
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
    icon: <CreditCardOff />,
    link: `/${MAIN_ROUTE}/checkinbiz/onboarding`,
    subMenu: CHECKINBIZ
},
{
    id: 'passinbiz',
    name: 'PassinBiz',
    icon: <CreditScoreIcon />,
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