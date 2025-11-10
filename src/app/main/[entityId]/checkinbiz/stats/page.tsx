'use client';

import { CheckBizStatsProvider, } from './context/checkBizStatsContext';
import React from 'react';
import { PanelStats } from './components/PanelStats';



const StatsPage = () => <CheckBizStatsProvider><PanelStats /></CheckBizStatsProvider>

export default StatsPage