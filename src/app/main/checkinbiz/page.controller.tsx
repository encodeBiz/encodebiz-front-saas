
export default function useDashboardController() {
  
  const salesPlans = [
    {
      name: 'Plan Freemium',
      price: '$19',
      period: '/month',
      features: [
        'Up to 10 products',
        'Basic analytics',
        'Email support',
        '24/7 customer care'
      ],
      featured: false
    },
    {
      name: 'Standard',
      price: '$49',
      period: '/month',
      features: [
        'Up to 50 products',
        'Advanced analytics',
        'Priority email support',
        '24/7 customer care',
        'API access'
      ],
      featured: false
    },
    {
      name: 'Premium',
      price: '$99',
      period: '/month',
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Phone & email support',
        '24/7 customer care',
        'API access',
        'Custom reports'
      ],
      featured: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited products',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 premium support',
        'White-label solutions',
        'On-site training'
      ],
      featured: false
    }
  ]; 
  return {salesPlans}
}