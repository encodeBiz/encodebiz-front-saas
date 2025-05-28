// src/components/charts/LineChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // For filled lines
} from 'chart.js';
import { lineChartData, lineChartOptions } from '@/config/constants';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const LineChart: React.FC = () => {
    return <Line data={lineChartData} options={lineChartOptions} />;
};

export default LineChart