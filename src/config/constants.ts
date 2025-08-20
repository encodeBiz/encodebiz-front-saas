export const AppName = 'EncodeBiz SaaS Platform'


// src/data/chartData.ts

// Line Chart Data
export const lineChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales Trend',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4, // Smooth curve
    },
    {
      label: 'Expenses Trend',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: true,
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      tension: 0.4,
    },
  ],
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Important for responsive charts within Material-UI Grid
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Performance',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Bar Chart Data
export const barChartData = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
  datasets: [
    {
      label: 'Units Sold',
      data: [120, 190, 300, 50, 200],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Product Sales Overview',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Doughnut Chart Data
export const doughnutChartData = {
  labels: ['Marketing', 'Development', 'Sales', 'Operations'],
  datasets: [
    {
      label: 'Budget Allocation',
      data: [300, 50, 100, 150],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const, // Place legend on the right for doughnut
    },
    title: {
      display: true,
      text: 'Departmental Budget',
    },
  },
};

export const countries = [
  { name: 'United States', code: 'US', dial_code: '+1' },
  { name: 'United Kingdom', code: 'GB', dial_code: '+44' },
  { name: 'Canada', code: 'CA', dial_code: '+1' },
  { name: 'Australia', code: 'AU', dial_code: '+61' },
  { name: 'Germany', code: 'DE', dial_code: '+49' },
  { name: 'France', code: 'FR', dial_code: '+33' },
  { name: 'Brazil', code: 'BR', dial_code: '+55' },
  { name: 'India', code: 'IN', dial_code: '+91' },
  { name: 'China', code: 'CN', dial_code: '+86' },
  { name: 'Japan', code: 'JP', dial_code: '+81' },
  { name: 'España', code: 'ES', dial_code: '+34' },
  // Add more countries as needed
];


export const fileTypes = (t: any) => [
  { label: t('core.label.logo'), value: 'logo', size: { w: 300, h: 300, locked: true } },
  { label: t('core.label.background'), value: 'background', size: { w: 400, h: 400, locked: true } },
  { label: t('core.label.stripImage'), value: 'stripImage', size: { w: 375, h: 98, locked: true } },
  { label: t('core.label.icon'), value: 'icon', size: { w: 26, h: 26, locked: true } },
  { label: t('core.label.iconx2'), value: 'iconx2', size: { w: 58, h: 58, locked: true } },
  { label: t('core.label.custom'), value: 'custom', size: { w: 0, h: 0, locked: false } },
  { label: t('core.label.thumbnail'), value: 'thumbnail', size: { w: 612, h: 612, locked: true } },

]