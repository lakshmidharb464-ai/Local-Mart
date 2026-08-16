export const INITIAL_DELIVERY_PROFILE = {
  id: 'DP-104',
  name: 'Rohan Sharma',
  phone: '+91 98765 43210',
  email: 'rohan.delivery@localfarm.in',
  rating: 4.9,
  totalDeliveries: 342,
  vehicleType: 'EV Scooter (Ather 450X)',
  vehicleNumber: 'MH 12 FX 4920',
  licenseNumber: 'DL-MH12-2022-00492',
  isOnline: true,
  hubLocation: 'Pune West Metro Hub',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  notifications: {
    pushAlerts: true,
    soundAlerts: true,
    smsAlerts: true,
    voiceGuide: true
  }
};

export const INITIAL_DELIVERY_ORDERS = [
  {
    id: 'DEL-CTR-101',
    orderId: 'ORD-CTR-7701',
    customerName: 'K. Venkatramana',
    customerPhone: '+91 94402 88990',
    customerAddress: 'Door 14-22, MSR Circle, Chittoor Town, Andhra Pradesh - 517001',
    customerLandmark: 'Near Chittoor Town Railway Station',
    customerCoords: { lat: 13.2172, lng: 79.1003 },
    farmName: 'Palamaner Organic Mango & Dairy Farm',
    farmAddress: 'Plot 4, Palamaner Agro Corridor, Chittoor Dist, Andhra Pradesh',
    farmPhone: '+91 94401 22334',
    farmCoords: { lat: 13.2000, lng: 78.7500 },
    district: 'Chittoor District, Andhra Pradesh',
    route: 'NH-140 Palamaner - Chittoor Express Corridor',
    distance: '6.4 km',
    eta: '20 mins',
    items: [
      { name: 'Chittoor Fresh Totapuri Mangoes', qty: '3 kg', price: 180 },
      { name: 'Palamaner A2 Desi Cow Ghee', qty: '500 ml', price: 650 },
      { name: 'Chittoor Roasted Organic Groundnuts', qty: '1 kg', price: 140 }
    ],
    totalAmount: 970,
    fee: 90,
    tip: 30,
    paymentType: 'UPI (Prepaid)',
    status: 'Out for Delivery',
    priority: 'High Priority',
    deliveryWindow: 'Today, 10:00 AM - 12:30 PM',
    assignedTime: 'Today, 09:15 AM',
    pickedUpTime: 'Today, 09:45 AM',
    deliveredTime: null,
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '09:15 AM', note: 'Dispatch assigned at Chittoor Central Hub' },
      { status: 'Accepted', time: '09:20 AM', note: 'Rider accepted task' },
      { status: 'Picked Up', time: '09:45 AM', note: 'Picked up fresh mangoes & dairy from Palamaner Farm' },
      { status: 'Out for Delivery', time: '10:00 AM', note: 'En route via NH-140 towards MSR Circle, Chittoor Town' }
    ]
  },
  {
    id: 'DEL-CTR-102',
    orderId: 'ORD-CTR-7702',
    customerName: 'S. Lakshmi Reddy',
    customerPhone: '+91 98491 55667',
    customerAddress: 'B-402, Tirumala Heights, Tirupati Bypass, Chittoor Region, AP - 517501',
    customerLandmark: 'Opposite Alipiri Foot Steps Gate',
    customerCoords: { lat: 13.6288, lng: 79.4192 },
    farmName: 'Madanapalle Red Tomato & Veggie Collective',
    farmAddress: 'Madanapalle Market Yard, Chittoor Dist, Andhra Pradesh',
    farmPhone: '+91 94900 11223',
    farmCoords: { lat: 13.5500, lng: 78.5000 },
    district: 'Chittoor District, Andhra Pradesh',
    route: 'Madanapalle - Tirupati Highway Route',
    distance: '12.5 km',
    eta: '35 mins',
    items: [
      { name: 'Madanapalle Red Vine Tomatoes', qty: '5 kg', price: 150 },
      { name: 'Fresh Green Chillies & Drumsticks', qty: '1 kg', price: 70 }
    ],
    totalAmount: 220,
    fee: 110,
    tip: 20,
    paymentType: 'Cash on Delivery (₹220)',
    status: 'Picked Up',
    priority: 'Cold Chain',
    deliveryWindow: 'Today, 11:30 AM - 01:30 PM',
    assignedTime: 'Today, 09:40 AM',
    pickedUpTime: 'Today, 10:15 AM',
    deliveredTime: null,
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '09:40 AM', note: 'Assigned for Tirupati delivery route' },
      { status: 'Accepted', time: '09:45 AM', note: 'Rider accepted' },
      { status: 'Picked Up', time: '10:15 AM', note: 'Collected fresh produce from Madanapalle yard' }
    ]
  },
  {
    id: 'DEL-991',
    orderId: 'ORD-8821',
    customerName: 'Aniket Sharma',
    customerPhone: '+91 98112 34567',
    customerAddress: 'Flat 402, Green Acres Apt, Kothrud, Pune - 411038',
    customerLandmark: 'Near Ideal Colony Ground',
    customerCoords: { lat: 18.5074, lng: 73.8077 },
    farmName: 'Rajesh Kumar (Organic Produce)',
    farmAddress: 'Plot 14, Pune Rural Hub, Baner Road, Pune',
    farmPhone: '+91 98230 11223',
    farmCoords: { lat: 18.5590, lng: 73.7868 },
    distance: '4.2 km',
    eta: '18 mins',
    items: [
      { name: 'Fresh Farm Organic Tomatoes', qty: '2 kg', price: 80 },
      { name: 'Crisp Hydroponic Spinach', qty: '1 bunch', price: 30 }
    ],
    totalAmount: 110,
    fee: 85,
    tip: 20,
    paymentType: 'UPI (Prepaid)',
    status: 'Out for Delivery', // Assigned | Accepted | Picked Up | Out for Delivery | Delivered | Failed
    priority: 'High Priority',
    deliveryWindow: 'Today, 10:00 AM - 12:00 PM',
    assignedTime: 'Today, 09:30 AM',
    pickedUpTime: 'Today, 09:55 AM',
    deliveredTime: null,
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '09:30 AM', note: 'Order assigned by Pune Hub dispatch' },
      { status: 'Accepted', time: '09:35 AM', note: 'Partner accepted delivery task' },
      { status: 'Picked Up', time: '09:55 AM', note: 'Collected fresh produce from Rajesh Kumar' },
      { status: 'Out for Delivery', time: '10:05 AM', note: 'En route to customer location in Kothrud' }
    ]
  },
  {
    id: 'DEL-992',
    orderId: 'ORD-8822',
    customerName: 'Priya Joshi',
    customerPhone: '+91 99223 88776',
    customerAddress: 'B-701, Pinnacle Towers, Aundh, Pune - 411007',
    customerLandmark: 'Opposite Westend Mall',
    customerCoords: { lat: 18.5602, lng: 73.8031 },
    farmName: 'Satara Dairy Collective',
    farmAddress: 'Chilled Hub Depot, Aundh Link Rd, Pune',
    farmPhone: '+91 98901 44556',
    farmCoords: { lat: 18.5678, lng: 73.8120 },
    distance: '2.8 km',
    eta: '12 mins',
    items: [
      { name: 'Pure A2 Gir Cow Milk', qty: '2 Liters', price: 160 },
      { name: 'Handcrafted Bilona Ghee', qty: '500g Jar', price: 950 }
    ],
    totalAmount: 1110,
    fee: 120,
    tip: 30,
    paymentType: 'Cash on Delivery (₹1110)',
    status: 'Assigned',
    priority: 'Cold Chain',
    deliveryWindow: 'Today, 11:00 AM - 01:00 PM',
    assignedTime: 'Today, 10:10 AM',
    pickedUpTime: null,
    deliveredTime: null,
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '10:10 AM', note: 'Cold-chain dispatch assigned' }
    ]
  },
  {
    id: 'DEL-993',
    orderId: 'ORD-8823',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 97334 11223',
    customerAddress: 'Villa 12, Palm Meadows, Baner, Pune - 411045',
    customerLandmark: 'Near Cummins India Office',
    customerCoords: { lat: 18.5596, lng: 73.7791 },
    farmName: 'Sunita Patil (Hydroponic Greens)',
    farmAddress: 'Nashik Direct Hub, Pashan Road, Pune',
    farmPhone: '+91 97654 33211',
    farmCoords: { lat: 18.5410, lng: 73.7920 },
    distance: '5.1 km',
    eta: '22 mins',
    items: [
      { name: 'Crisp Hydroponic Spinach', qty: '3 bunches', price: 90 },
      { name: 'Organic Sweet Oranges', qty: '2 kg', price: 240 }
    ],
    totalAmount: 330,
    fee: 95,
    tip: 15,
    paymentType: 'UPI (Prepaid)',
    status: 'Picked Up',
    priority: 'Standard',
    deliveryWindow: 'Today, 01:00 PM - 03:00 PM',
    assignedTime: 'Today, 10:30 AM',
    pickedUpTime: 'Today, 11:00 AM',
    deliveredTime: null,
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '10:30 AM', note: 'Assigned to Rohan Sharma' },
      { status: 'Accepted', time: '10:32 AM', note: 'Accepted by partner' },
      { status: 'Picked Up', time: '11:00 AM', note: 'Picked up from Pashan Hub' }
    ]
  },
  {
    id: 'DEL-990',
    orderId: 'ORD-8817',
    customerName: 'Sneha Rane',
    customerPhone: '+91 98556 44332',
    customerAddress: 'House 45, Viman Nagar, Pune - 411014',
    customerLandmark: 'Behind Symbiosis Campus',
    customerCoords: { lat: 18.5679, lng: 73.9143 },
    farmName: 'Anil Shinde (Oil Press Works)',
    farmAddress: 'Solapur Outlet, Hadapsar, Pune',
    farmPhone: '+91 94220 88991',
    farmCoords: { lat: 18.5089, lng: 73.9259 },
    distance: '8.5 km',
    eta: '35 mins',
    items: [
      { name: 'Cold-Pressed Groundnut Oil', qty: '2 Liters', price: 480 }
    ],
    totalAmount: 480,
    fee: 140,
    tip: 25,
    paymentType: 'UPI (Prepaid)',
    status: 'Delivered',
    priority: 'Standard',
    deliveryWindow: 'Today, 08:00 AM - 10:00 AM',
    assignedTime: 'Today, 07:30 AM',
    pickedUpTime: 'Today, 08:10 AM',
    deliveredTime: 'Today, 08:45 AM',
    failureReason: null,
    timeline: [
      { status: 'Assigned', time: '07:30 AM', note: 'Early morning dispatch' },
      { status: 'Accepted', time: '07:32 AM', note: 'Accepted' },
      { status: 'Picked Up', time: '08:10 AM', note: 'Picked up' },
      { status: 'Out for Delivery', time: '08:15 AM', note: 'On the way' },
      { status: 'Delivered', time: '08:45 AM', note: 'Delivered directly to customer' }
    ]
  },
  {
    id: 'DEL-989',
    orderId: 'ORD-8815',
    customerName: 'Rohan Deshpande',
    customerPhone: '+91 98221 00998',
    customerAddress: 'Flat 102, Shanti Heights, Shivajinagar, Pune - 411005',
    customerLandmark: 'Near FC Road Starbacks',
    customerCoords: { lat: 18.5204, lng: 73.8416 },
    farmName: 'Ramesh Sawant (Ratnagiri Orchards)',
    farmAddress: 'Shivajinagar Express Hub, Pune',
    farmPhone: '+91 91580 77665',
    farmCoords: { lat: 18.5300, lng: 73.8500 },
    distance: '3.4 km',
    eta: '--',
    items: [
      { name: 'Alphonso Mangoes (Devgad)', qty: '1 dozen', price: 650 }
    ],
    totalAmount: 650,
    fee: 90,
    tip: 0,
    paymentType: 'Cash on Delivery (₹650)',
    status: 'Failed',
    priority: 'Express',
    deliveryWindow: 'Yesterday, 04:00 PM - 06:00 PM',
    assignedTime: 'Yesterday, 03:30 PM',
    pickedUpTime: 'Yesterday, 04:05 PM',
    deliveredTime: null,
    failureReason: 'Customer phone unreachable and premises locked.',
    timeline: [
      { status: 'Assigned', time: 'Yesterday 03:30 PM', note: 'Express mango dispatch' },
      { status: 'Picked Up', time: 'Yesterday 04:05 PM', note: 'Picked up' },
      { status: 'Out for Delivery', time: 'Yesterday 04:20 PM', note: 'Attempting delivery' },
      { status: 'Failed', time: 'Yesterday 05:10 PM', note: 'Failed: Customer phone unreachable and door locked.' }
    ]
  }
];

export const INITIAL_DELIVERY_EARNINGS = {
  todayTotal: 1240,
  todayTrips: 8,
  todayBasePay: 860,
  todayDistanceBonus: 220,
  todayTips: 160,
  weeklyTotal: 7850,
  weeklyTrips: 52,
  pendingPayout: 2450,
  payoutHistory: [
    { id: 'PAY-8801', date: '11 Aug 2026', amount: 1450, trips: 9, method: 'Direct Bank Transfer', status: 'Settled' },
    { id: 'PAY-8794', date: '10 Aug 2026', amount: 1200, trips: 7, method: 'UPI Direct', status: 'Settled' },
    { id: 'PAY-8788', date: '09 Aug 2026', amount: 1650, trips: 11, method: 'Direct Bank Transfer', status: 'Settled' },
    { id: 'PAY-8770', date: '08 Aug 2026', amount: 1100, trips: 7, method: 'Direct Bank Transfer', status: 'Settled' },
    { id: 'PAY-8762', date: '07 Aug 2026', amount: 1400, trips: 9, method: 'UPI Direct', status: 'Settled' },
    { id: 'PAY-8755', date: '06 Aug 2026', amount: 1050, trips: 9, method: 'Direct Bank Transfer', status: 'Settled' }
  ]
};
