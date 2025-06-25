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
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
export const menuItems = [{
    id: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/main/dashboard',
    subMenu: []
}, {
    id: 'checkBiz360_products',
    name: 'Products',
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
        name: 'Account',
        icon: <PersonIcon />,
        link: '/main/preferences/account',
        subMenu: []
    },{
        name: 'Entity',
        icon: <BusinessIcon />,
        link: '/main/preferences/entity',
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