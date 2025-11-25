'use client';

import { DashboardProvider, } from './context/dashboardContext';
import React from 'react';
import { PanelStats } from './components/PanelStats';



const StatsPage = () => <DashboardProvider><PanelStats /></DashboardProvider>

export default StatsPage