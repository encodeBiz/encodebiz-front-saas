import {
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
export const menuItems = [{
    id: 'home',
    name: 'home',
    header: true, subMenu: []
}, {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/main/dashboard',
    subMenu: []
},
{
    divider: true,
    subMenu: []
}, {
    id: 'checkBiz360_products',
    name: 'Products',
    header: true, subMenu: []
}, {
    id: 'checkinbiz_products',
    name: 'CheckinBiz',
    icon: <CreditCardOffIcon />,
    link: '/main/checkinbiz',
    subMenu: []
},
{
    id: 'passinbiz_products',
    name: 'PassinBiz',
    icon: <CreditScoreIcon />,
    link: '/main/passinbiz',
    subMenu: [{
        name: 'Plans',
        icon: <ViewColumnIcon />,
        link: '/main/passinbiz/plans',
        subMenu: []
    }, {
        name: 'Holders',
        icon: <GroupIcon />,
        link: '/main/passinbiz/holder',
        subMenu: []
    }]
},
{
    divider: true,
    subMenu: []
},
{
    id: 'general',
    name: 'general',
    header: true, subMenu: []
},
{
    id: 'billing',
    name: 'Billing',
    icon: <BarChartIcon />,
    link: '/main/billing',
    subMenu: [{
        name: 'Subscription',
        icon: <WorkspacePremiumIcon />,
        link: '/main/billing/suscription',
        subMenu: []
    }, {
        name: 'Revenue',
        icon: <BarChartIcon />,
        link: '/main/billing/sales',
        subMenu: []
    }]
},
{
    divider: true,
    subMenu: []
},
{
    id: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    link: '/main/settings',
    subMenu: [{
        name: 'Entity',
        icon: <BusinessIcon />,
        link: '/main/preferences/entity',
        subMenu: []
    },
    /* {
        name: 'Notifications',
        icon: <SettingsIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }, {
        name: 'Security',
        icon: <SettingsIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }*/]
}]