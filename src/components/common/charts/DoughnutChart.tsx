import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { doughnutChartData, doughnutChartOptions } from '@/config/constants';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
    return <Doughnut data={doughnutChartData} options={doughnutChartOptions} />;
};

export default DoughnutChart;