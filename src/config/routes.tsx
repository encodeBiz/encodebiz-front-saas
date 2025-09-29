import {
 
    MobiledataOffOutlined,
   

} from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import { DashBoardIcon } from '@/components/common/icons/DashBoardIcon';
import { CheckBizIcon } from '@/components/common/icons/CheckBizIcon';
import { MediaIcon } from '@/components/common/icons/MediaIcon';
import { PassInBizIcon } from '@/components/common/icons/PassInBizIcon';

export const MAIN_ROUTE = 'main'
export const GENERAL_ROUTE = 'core'
export const USER_ROUTE = 'user'

export const PASSSINBIZ_MODULE_ROUTE = 'passinbiz'
export const CHECKINBIZ_MODULE_ROUTE = 'checkinbiz'

const PASSINBIZ = [{
    name: 'Holders',    
    link: `/${PASSSINBIZ_MODULE_ROUTE}/holder`,
    subMenu: []
}, {
    name: 'Events',

    link: `/${PASSSINBIZ_MODULE_ROUTE}/event`,
    subMenu: []
}, {
    name: 'Staff',
    link: `/${PASSSINBIZ_MODULE_ROUTE}/staff`,
    subMenu: []
}, {
    name: 'Stats',
    link: `/${PASSSINBIZ_MODULE_ROUTE}/stats`,
    subMenu: []
}]


const CHECKINBIZ: any = [{
    name: 'Employee',
  
    link: `/${CHECKINBIZ_MODULE_ROUTE}/employee`,
    subMenu: []
}, {
    name: 'Sucursal',  
    link: `/${CHECKINBIZ_MODULE_ROUTE}/sucursal`,
    subMenu: []
}, {
    name: 'Report',  
    link: `/${CHECKINBIZ_MODULE_ROUTE}/report`,
    subMenu: []
}]

export const menuItemsHome = [{
    id: 'dashboard',
    name: 'Dashboard',
    icon: <DashBoardIcon />,
    link: `/dashboard`,
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
},
{
    id: 'passinbiz',
    name: 'PassBiz',
    icon: <PassInBizIcon />,
    link: `/passinbiz/onboarding`,
    subMenu: PASSINBIZ
},
{
    id: 'checkinbiz',
    name: 'CheckBiz',
    icon: <CheckBizIcon />,
    link: `/checkinbiz/onboarding`,
    subMenu: CHECKINBIZ
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
        link: `/entity?tab=company`,
        subMenu: []
    },
    {
        name: 'Media',
        icon: <MediaIcon />,
        link: `/media`,
        subMenu: []
    },
    {
        name: 'Integration',
        icon: <MobiledataOffOutlined />,
        link: `/integration`,
        subMenu: []
    }
]


export const PUBLIC_PATH = ['/tools/scanner','/tools/checking','/tools/demo-chart','/tools/demo-chart-2','/tools/demo-chart-3']