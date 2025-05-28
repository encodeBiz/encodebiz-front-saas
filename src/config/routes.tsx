import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    ExpandLess,
    ExpandMore,
    Mail as MailIcon,
    Notifications as NotificationsIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
export const menuItems = [{
    id: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/main/dashboard',
    subMenu: []
}, {
    id: 'checkBiz360_products',
    name: 'CheckBiz360 Products',
    icon: <AutoGraphIcon />,
    link: '/main/dashboard',
    subMenu: [{
        name: 'CheckinBiz',
        icon: <CreditCardOffIcon />,
        link: '/main/checkinbiz',
        subMenu: []
    }, {
        name: 'PassinBiz',
        icon: <CreditScoreIcon />,
        link: '/main/passinbiz',
        subMenu: []
    }]
}, {
    id: 'customers',
    name: 'Customers',
    icon: <BarChartIcon />,
    link: '/main/reposts',
    subMenu: []
}, {
    id: 'reports',
    name: 'Reports',
    icon: <AutoGraphIcon />,
    link: '/main/reports',
    subMenu: [{
        name: 'Subcription',
        icon: <BarChartIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }, {
        name: 'Revenue',
        icon: <BarChartIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }, {
        name: 'Customers',
        icon: <BarChartIcon />,
        link: '/main/reports/sales',
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
        name: 'Account',
        icon: <SettingsIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }, {
        name: 'Notifications',
        icon: <SettingsIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }, {
        name: 'Security',
        icon: <SettingsIcon />,
        link: '/main/reports/sales',
        subMenu: []
    }]
}]