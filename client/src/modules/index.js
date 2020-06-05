import { lazy } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import DashboardIcon from '@material-ui/icons/Dashboard';

import Home from './Home';
const Profile = lazy(() => import('./Profile'));
const Dashboard = lazy(() => import('./Dashboard'));

export default [
  {
    routeProps: {
      path: '/',
      component: Home,
    },
    name: 'Home',
    icon: HomeIcon,
  },
  {
    routeProps: {
      path: '/profile',
      component: Profile,
    },
    name: 'Profile',
    icon: AccessibilityIcon,
  },
  {
    routeProps: {
      path: '/dashboard',
      component: Dashboard,
    },
    name: 'Dashboard',
    icon: DashboardIcon,
  },
];
