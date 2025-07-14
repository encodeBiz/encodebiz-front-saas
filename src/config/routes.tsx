import {
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    ImageSearchOutlined,
    CreditCardOff
} from '@mui/icons-material';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BusinessIcon from '@mui/icons-material/Business';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';

export const MAIN_ROUTE = 'main'
export const GENERAL_ROUTE = 'core'
export const USER_ROUTE = 'user'

export const PASSSINBIZ_MODULE_ROUTE = 'passinBiz'
export const CHECKINBIZ_MODULE_ROUTE = 'checkinBiz'

const PASSINBIZ = [{
    name: 'Holders',
    icon: <GroupIcon />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`,
    subMenu: []
}, {
    name: 'Events',
    icon: <GroupIcon />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`,
    subMenu: []
}]


const CHECKINBIZ: any = [{
    name: 'Events',
    icon: <GroupIcon />,
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`,
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