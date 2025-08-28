import {
    
    Home,
    Person2TwoTone,
    

} from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import { DashBoardIcon } from '@/components/common/icons/DashBoardIcon';
import { PassBizIcon } from '@/components/common/icons/PassBizIcon';
import { CheckBizIcon } from '@/components/common/icons/CheckBizIcon';
import { MediaIcon } from '@/components/common/icons/MediaIcon';
import { PassInBizIcon } from '@/components/common/icons/PassInBizIcon';

export const MAIN_ROUTE = 'main'
export const GENERAL_ROUTE = 'core'
export const USER_ROUTE = 'user'

export const PASSSINBIZ_MODULE_ROUTE = 'passinbiz'
export const CHECKINBIZ_MODULE_ROUTE = 'checkinbiz'

const PASSINBIZ = [ {
    name: 'Holders',
  
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`,
    subMenu: []
}, {
    name: 'Events',
 
    link: `/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`,
    subMenu: []
}, {
    name: 'Staff',
    
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
    icon: <DashBoardIcon />,
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
    icon: <CheckBizIcon />,
    link: `/${MAIN_ROUTE}/checkinbiz/onboarding`,
    subMenu: CHECKINBIZ
},
{
    id: 'passinbiz',
    name: 'PassinBiz',
    icon: <PassInBizIcon />,
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
        icon: <MediaIcon />,
        link: `/${MAIN_ROUTE}/${GENERAL_ROUTE}/media`,
        subMenu: []
    }
]