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

export const countriesCode = [
  {
    "name": "United States",
    "isoCode": "US",
    "flag": "🇺🇸",
    "phoneCode": "+1",
    "dialCode": "1"
  },
  {
    "name": "Canada",
    "isoCode": "CA",
    "flag": "🇨🇦",
    "phoneCode": "+1",
    "dialCode": "1"
  },
  {
    "name": "Mexico",
    "isoCode": "MX",
    "flag": "🇲🇽",
    "phoneCode": "+52",
    "dialCode": "52"
  },
  {
    "name": "United Kingdom",
    "isoCode": "GB",
    "flag": "🇬🇧",
    "phoneCode": "+44",
    "dialCode": "44"
  },
  {
    "name": "Spain",
    "isoCode": "ES",
    "flag": "🇪🇸",
    "phoneCode": "+34",
    "dialCode": "34"
  },
  {
    "name": "France",
    "isoCode": "FR",
    "flag": "🇫🇷",
    "phoneCode": "+33",
    "dialCode": "33"
  },
  {
    "name": "Germany",
    "isoCode": "DE",
    "flag": "🇩🇪",
    "phoneCode": "+49",
    "dialCode": "49"
  },
  {
    "name": "Italy",
    "isoCode": "IT",
    "flag": "🇮🇹",
    "phoneCode": "+39",
    "dialCode": "39"
  },
  {
    "name": "Argentina",
    "isoCode": "AR",
    "flag": "🇦🇷",
    "phoneCode": "+54",
    "dialCode": "54"
  },
  {
    "name": "Brazil",
    "isoCode": "BR",
    "flag": "🇧🇷",
    "phoneCode": "+55",
    "dialCode": "55"
  },
  {
    "name": "Colombia",
    "isoCode": "CO",
    "flag": "🇨🇴",
    "phoneCode": "+57",
    "dialCode": "57"
  },
  {
    "name": "Chile",
    "isoCode": "CL",
    "flag": "🇨🇱",
    "phoneCode": "+56",
    "dialCode": "56"
  },
  {
    "name": "Peru",
    "isoCode": "PE",
    "flag": "🇵🇪",
    "phoneCode": "+51",
    "dialCode": "51"
  },
  {
    "name": "China",
    "isoCode": "CN",
    "flag": "🇨🇳",
    "phoneCode": "+86",
    "dialCode": "86"
  },
  {
    "name": "Japan",
    "isoCode": "JP",
    "flag": "🇯🇵",
    "phoneCode": "+81",
    "dialCode": "81"
  },
  {
    "name": "India",
    "isoCode": "IN",
    "flag": "🇮🇳",
    "phoneCode": "+91",
    "dialCode": "91"
  },
  {
    "name": "Australia",
    "isoCode": "AU",
    "flag": "🇦🇺",
    "phoneCode": "+61",
    "dialCode": "61"
  },
  {
    "name": "Russia",
    "isoCode": "RU",
    "flag": "🇷🇺",
    "phoneCode": "+7",
    "dialCode": "7"
  },
  {
    "name": "South Korea",
    "isoCode": "KR",
    "flag": "🇰🇷",
    "phoneCode": "+82",
    "dialCode": "82"
  },
  {
    "name": "Turkey",
    "isoCode": "TR",
    "flag": "🇹🇷",
    "phoneCode": "+90",
    "dialCode": "90"
  },
  {
    "name": "South Africa",
    "isoCode": "ZA",
    "flag": "🇿🇦",
    "phoneCode": "+27",
    "dialCode": "27"
  },
  {
    "name": "Egypt",
    "isoCode": "EG",
    "flag": "🇪🇬",
    "phoneCode": "+20",
    "dialCode": "20"
  },
  {
    "name": "Nigeria",
    "isoCode": "NG",
    "flag": "🇳🇬",
    "phoneCode": "+234",
    "dialCode": "234"
  },
  {
    "name": "Kenya",
    "isoCode": "KE",
    "flag": "🇰🇪",
    "phoneCode": "+254",
    "dialCode": "254"
  },
  {
    "name": "Saudi Arabia",
    "isoCode": "SA",
    "flag": "🇸🇦",
    "phoneCode": "+966",
    "dialCode": "966"
  },
  {
    "name": "United Arab Emirates",
    "isoCode": "AE",
    "flag": "🇦🇪",
    "phoneCode": "+971",
    "dialCode": "971"
  },
  {
    "name": "Israel",
    "isoCode": "IL",
    "flag": "🇮🇱",
    "phoneCode": "+972",
    "dialCode": "972"
  },
  {
    "name": "Ukraine",
    "isoCode": "UA",
    "flag": "🇺🇦",
    "phoneCode": "+380",
    "dialCode": "380"
  },
  {
    "name": "Poland",
    "isoCode": "PL",
    "flag": "🇵🇱",
    "phoneCode": "+48",
    "dialCode": "48"
  },
  {
    "name": "Netherlands",
    "isoCode": "NL",
    "flag": "🇳🇱",
    "phoneCode": "+31",
    "dialCode": "31"
  },
  {
    "name": "Belgium",
    "isoCode": "BE",
    "flag": "🇧🇪",
    "phoneCode": "+32",
    "dialCode": "32"
  },
  {
    "name": "Sweden",
    "isoCode": "SE",
    "flag": "🇸🇪",
    "phoneCode": "+46",
    "dialCode": "46"
  },
  {
    "name": "Norway",
    "isoCode": "NO",
    "flag": "🇳🇴",
    "phoneCode": "+47",
    "dialCode": "47"
  },
  {
    "name": "Denmark",
    "isoCode": "DK",
    "flag": "🇩🇰",
    "phoneCode": "+45",
    "dialCode": "45"
  },
  {
    "name": "Finland",
    "isoCode": "FI",
    "flag": "🇫🇮",
    "phoneCode": "+358",
    "dialCode": "358"
  },
  {
    "name": "Switzerland",
    "isoCode": "CH",
    "flag": "🇨🇭",
    "phoneCode": "+41",
    "dialCode": "41"
  },
  {
    "name": "Austria",
    "isoCode": "AT",
    "flag": "🇦🇹",
    "phoneCode": "+43",
    "dialCode": "43"
  },
  {
    "name": "Portugal",
    "isoCode": "PT",
    "flag": "🇵🇹",
    "phoneCode": "+351",
    "dialCode": "351"
  },
  {
    "name": "Greece",
    "isoCode": "GR",
    "flag": "🇬🇷",
    "phoneCode": "+30",
    "dialCode": "30"
  },
  {
    "name": "Ireland",
    "isoCode": "IE",
    "flag": "🇮🇪",
    "phoneCode": "+353",
    "dialCode": "353"
  },
  {
    "name": "Czech Republic",
    "isoCode": "CZ",
    "flag": "🇨🇿",
    "phoneCode": "+420",
    "dialCode": "420"
  },
  {
    "name": "Romania",
    "isoCode": "RO",
    "flag": "🇷🇴",
    "phoneCode": "+40",
    "dialCode": "40"
  },
  {
    "name": "Hungary",
    "isoCode": "HU",
    "flag": "🇭🇺",
    "phoneCode": "+36",
    "dialCode": "36"
  },
  {
    "name": "Bulgaria",
    "isoCode": "BG",
    "flag": "🇧🇬",
    "phoneCode": "+359",
    "dialCode": "359"
  },
  {
    "name": "Croatia",
    "isoCode": "HR",
    "flag": "🇭🇷",
    "phoneCode": "+385",
    "dialCode": "385"
  },
  {
    "name": "Serbia",
    "isoCode": "RS",
    "flag": "🇷🇸",
    "phoneCode": "+381",
    "dialCode": "381"
  },
  {
    "name": "Slovakia",
    "isoCode": "SK",
    "flag": "🇸🇰",
    "phoneCode": "+421",
    "dialCode": "421"
  },
  {
    "name": "Slovenia",
    "isoCode": "SI",
    "flag": "🇸🇮",
    "phoneCode": "+386",
    "dialCode": "386"
  },
  {
    "name": "Estonia",
    "isoCode": "EE",
    "flag": "🇪🇪",
    "phoneCode": "+372",
    "dialCode": "372"
  },
  {
    "name": "Latvia",
    "isoCode": "LV",
    "flag": "🇱🇻",
    "phoneCode": "+371",
    "dialCode": "371"
  },
  {
    "name": "Lithuania",
    "isoCode": "LT",
    "flag": "🇱🇹",
    "phoneCode": "+370",
    "dialCode": "370"
  },
  {
    "name": "Malta",
    "isoCode": "MT",
    "flag": "🇲🇹",
    "phoneCode": "+356",
    "dialCode": "356"
  },
  {
    "name": "Cyprus",
    "isoCode": "CY",
    "flag": "🇨🇾",
    "phoneCode": "+357",
    "dialCode": "357"
  },
  {
    "name": "Iceland",
    "isoCode": "IS",
    "flag": "🇮🇸",
    "phoneCode": "+354",
    "dialCode": "354"
  },
  {
    "name": "Luxembourg",
    "isoCode": "LU",
    "flag": "🇱🇺",
    "phoneCode": "+352",
    "dialCode": "352"
  },
  {
    "name": "Monaco",
    "isoCode": "MC",
    "flag": "🇲🇨",
    "phoneCode": "+377",
    "dialCode": "377"
  },
  {
    "name": "Andorra",
    "isoCode": "AD",
    "flag": "🇦🇩",
    "phoneCode": "+376",
    "dialCode": "376"
  },
  {
    "name": "Liechtenstein",
    "isoCode": "LI",
    "flag": "🇱🇮",
    "phoneCode": "+423",
    "dialCode": "423"
  },
  {
    "name": "San Marino",
    "isoCode": "SM",
    "flag": "🇸🇲",
    "phoneCode": "+378",
    "dialCode": "378"
  },
  {
    "name": "Vatican City",
    "isoCode": "VA",
    "flag": "🇻🇦",
    "phoneCode": "+379",
    "dialCode": "379"
  },
  {
    "name": "Singapore",
    "isoCode": "SG",
    "flag": "🇸🇬",
    "phoneCode": "+65",
    "dialCode": "65"
  },
  {
    "name": "Malaysia",
    "isoCode": "MY",
    "flag": "🇲🇾",
    "phoneCode": "+60",
    "dialCode": "60"
  },
  {
    "name": "Thailand",
    "isoCode": "TH",
    "flag": "🇹🇭",
    "phoneCode": "+66",
    "dialCode": "66"
  },
  {
    "name": "Vietnam",
    "isoCode": "VN",
    "flag": "🇻🇳",
    "phoneCode": "+84",
    "dialCode": "84"
  },
  {
    "name": "Indonesia",
    "isoCode": "ID",
    "flag": "🇮🇩",
    "phoneCode": "+62",
    "dialCode": "62"
  },
  {
    "name": "Philippines",
    "isoCode": "PH",
    "flag": "🇵🇭",
    "phoneCode": "+63",
    "dialCode": "63"
  },
  {
    "name": "New Zealand",
    "isoCode": "NZ",
    "flag": "🇳🇿",
    "phoneCode": "+64",
    "dialCode": "64"
  },
  {
    "name": "Fiji",
    "isoCode": "FJ",
    "flag": "🇫🇯",
    "phoneCode": "+679",
    "dialCode": "679"
  },
  {
    "name": "Papua New Guinea",
    "isoCode": "PG",
    "flag": "🇵🇬",
    "phoneCode": "+675",
    "dialCode": "675"
  },
  {
    "name": "Bangladesh",
    "isoCode": "BD",
    "flag": "🇧🇩",
    "phoneCode": "+880",
    "dialCode": "880"
  },
  {
    "name": "Pakistan",
    "isoCode": "PK",
    "flag": "🇵🇰",
    "phoneCode": "+92",
    "dialCode": "92"
  },
  {
    "name": "Sri Lanka",
    "isoCode": "LK",
    "flag": "🇱🇰",
    "phoneCode": "+94",
    "dialCode": "94"
  },
  {
    "name": "Nepal",
    "isoCode": "NP",
    "flag": "🇳🇵",
    "phoneCode": "+977",
    "dialCode": "977"
  },
  {
    "name": "Bhutan",
    "isoCode": "BT",
    "flag": "🇧🇹",
    "phoneCode": "+975",
    "dialCode": "975"
  },
  {
    "name": "Maldives",
    "isoCode": "MV",
    "flag": "🇲🇻",
    "phoneCode": "+960",
    "dialCode": "960"
  },
  {
    "name": "Afghanistan",
    "isoCode": "AF",
    "flag": "🇦🇫",
    "phoneCode": "+93",
    "dialCode": "93"
  },
  {
    "name": "Iran",
    "isoCode": "IR",
    "flag": "🇮🇷",
    "phoneCode": "+98",
    "dialCode": "98"
  },
  {
    "name": "Iraq",
    "isoCode": "IQ",
    "flag": "🇮🇶",
    "phoneCode": "+964",
    "dialCode": "964"
  },
  {
    "name": "Jordan",
    "isoCode": "JO",
    "flag": "🇯🇴",
    "phoneCode": "+962",
    "dialCode": "962"
  },
  {
    "name": "Lebanon",
    "isoCode": "LB",
    "flag": "🇱🇧",
    "phoneCode": "+961",
    "dialCode": "961"
  },
  {
    "name": "Qatar",
    "isoCode": "QA",
    "flag": "🇶🇦",
    "phoneCode": "+974",
    "dialCode": "974"
  },
  {
    "name": "Kuwait",
    "isoCode": "KW",
    "flag": "🇰🇼",
    "phoneCode": "+965",
    "dialCode": "965"
  },
  {
    "name": "Oman",
    "isoCode": "OM",
    "flag": "🇴🇲",
    "phoneCode": "+968",
    "dialCode": "968"
  },
  {
    "name": "Bahrain",
    "isoCode": "BH",
    "flag": "🇧🇭",
    "phoneCode": "+973",
    "dialCode": "973"
  },
  {
    "name": "Yemen",
    "isoCode": "YE",
    "flag": "🇾🇪",
    "phoneCode": "+967",
    "dialCode": "967"
  },
  {
    "name": "Syria",
    "isoCode": "SY",
    "flag": "🇸🇾",
    "phoneCode": "+963",
    "dialCode": "963"
  }
]


export const fileTypes = (t: any) => [

  { label: t('core.label.logo'), value: 'logo', size: { w: 300, h: 300, locked: true, boxH: 160, boxW: 160 } },
  { label: t('core.label.background'), value: 'background', size: { w: 400, h: 400, locked: true, boxH: 160, boxW: 160 } },
  { label: t('core.label.stripImage'), value: 'stripImage', size: { w: 375, h: 98, locked: true, boxH: 123, boxW: 312 } },
  { label: t('core.label.icon'), value: 'icon', size: { w: 26, h: 26, locked: true, boxH: 120, boxW: 120 } },
  { label: t('core.label.iconx2'), value: 'iconx2', size: { w: 58, h: 58, locked: true, boxH: 140, boxW: 140 } },
  { label: t('core.label.custom'), value: 'custom', size: { w: 0, h: 0, locked: false, boxH: 140, boxW: 140 } },
  { label: t('core.label.avatar'), value: 'avatar', size: { w: 300, h: 300, locked: true, boxH: 160, boxW: 160 } },
  { label: t('core.label.thumbnail'), value: 'thumbnail', size: { w: 612, h: 612, locked: true, boxH: 140, boxW: 140 } },

]