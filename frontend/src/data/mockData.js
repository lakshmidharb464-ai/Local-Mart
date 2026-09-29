export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Fresh Farm Organic Tomatoes',
    category: 'Organic Veggies',
    price: 40,
    unit: 'kg',
    farmerId: 'f1',
    farmerName: 'Rajesh Kumar',
    farmerLocation: 'Chittoor District, AP',
    distanceKm: 2.4,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    stock: 120,
    organic: true,
    harvestDate: 'Today 5:30 AM',
    status: 'Approved',
    description: 'Vine-ripened red tomatoes grown without synthetic pesticides in Chittoor farm belt. Juicy & nutrient rich.'
  },
  {
    id: 'p2',
    name: 'Crisp Hydroponic Spinach',
    category: 'Organic Veggies',
    price: 30,
    unit: 'bunch',
    farmerId: 'f2',
    farmerName: 'Sunita Patil',
    farmerLocation: 'Nashik Organic Farm',
    distanceKm: 4.1,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    stock: 85,
    organic: true,
    harvestDate: 'Today 6:00 AM',
    status: 'Approved',
    description: 'Pesticide-free leafy spinach harvested at first light. High iron and nutrient content.'
  },
  {
    id: 'p3',
    name: 'Alphonso Mangoes (Devgad)',
    category: 'Seasonal Picks',
    price: 650,
    unit: 'dozen',
    farmerId: null,
    farmerName: 'Ramesh Sawant',
    farmerLocation: 'Ratnagiri Orchards',
    distanceKm: 8.5,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    organic: true,
    harvestDate: 'Yesterday Evening',
    status: 'Approved',
    description: 'Tree-ripened, GI-tagged Alphonso mangoes. Unmatched aroma and sweet rich flavor.'
  },
  {
    id: 'p4',
    name: 'Pure A2 Gir Cow Milk',
    category: 'Dairy & Eggs',
    price: 80,
    unit: 'liter',
    farmerId: 'f3',
    farmerName: 'Mahesh Deshmukh',
    farmerLocation: 'Satara Dairy Collective',
    distanceKm: 3.2,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    stock: 200,
    organic: true,
    harvestDate: 'Today 4:30 AM',
    status: 'Approved',
    description: 'Raw, unadulterated A2 milk from free-grazing Gir cows. Chilled and delivered cold.'
  },
  {
    id: 'p5',
    name: 'Cold-Pressed Groundnut Oil',
    category: 'Grocery & Oils',
    price: 240,
    unit: 'liter',
    farmerId: 'f4',
    farmerName: 'Anil Shinde',
    farmerLocation: 'Solapur Press Works',
    distanceKm: 6.0,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    organic: true,
    harvestDate: 'Batch #402',
    status: 'Approved',
    description: 'Traditional wood-pressed (Ghani) peanut oil preserving natural antioxidants and aroma.'
  },
  {
    id: 'p6',
    name: 'Farm Fresh Brown Eggs',
    category: 'Dairy & Eggs',
    price: 90,
    unit: 'pack of 6',
    farmerId: null,
    farmerName: 'Kavita Jadhav',
    farmerLocation: 'Baramati Free-Range Poultry',
    distanceKm: 5.3,
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    organic: true,
    harvestDate: 'Today 6:15 AM',
    status: 'Approved',
    description: 'Cruelty-free free-range eggs laid by pasture-raised hens fed natural grain.'
  },
  {
    id: 'p7',
    name: 'Family Weekly Organic Harvest Box',
    category: 'Bulk Farm Boxes',
    price: 549,
    unit: 'box (8kg mixed)',
    farmerId: null,
    farmerName: 'Community Agro Cooperative',
    farmerLocation: 'Pune Valley Cluster',
    distanceKm: 1.8,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    organic: true,
    harvestDate: 'Curated This Morning',
    status: 'Approved',
    description: 'Complete family staple box: 4kg essential veggies, 2kg seasonal fruits, and farm fresh greens at 20% bulk savings.'
  },
  {
    id: 'p8',
    name: 'Palamaner Farm Pure Desi Ghee',
    category: 'Grocery & Oils',
    price: 950,
    unit: '500g jar',
    farmerId: null,
    farmerName: 'K. Reddeppa',
    farmerLocation: 'Palamaner Agro Belt, Chittoor AP',
    distanceKm: 7.2,
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    organic: true,
    harvestDate: 'Batch #12',
    status: 'Approved',
    description: 'Traditional Bilona method ghee made by churning curd from free-grazing AP farm cows.'
  },
  {
    id: 'p9',
    name: 'Fresh Strawberries (Mahabaleshwar)',
    category: 'Seasonal Picks',
    price: 180,
    unit: '250g box',
    farmerId: 'f5',
    farmerName: 'Meena Kulkarni',
    farmerLocation: 'Mahabaleshwar Valley',
    distanceKm: 9.0,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    organic: true,
    harvestDate: 'Today 5:00 AM',
    status: 'Approved',
    description: 'Handpicked sweet berries from hill slopes of Mahabaleshwar.'
  },
  {
    id: 'p10',
    name: 'Immunity & Detox Farm Box',
    category: 'Bulk Farm Boxes',
    price: 420,
    unit: 'box (5kg)',
    farmerId: null,
    farmerName: 'Nashik Organic Cluster',
    farmerLocation: 'Nashik Valley',
    distanceKm: 3.8,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    organic: true,
    harvestDate: 'Today 6:30 AM',
    status: 'Approved',
    description: 'Handpicked citrus, ginger, turmeric root, amla, and fresh green leafy bundles.'
  }
];



export const CATEGORIES = [
  { id: 'all', name: 'All Produce', icon: 'Sparkles' },
  { id: 'Seasonal Picks', name: 'Seasonal Picks', icon: 'Sparkles' },
  { id: 'Organic Veggies', name: 'Organic Veggies', icon: 'Carrot' },
  { id: 'Dairy & Eggs', name: 'Dairy & Eggs', icon: 'Milk' },
  { id: 'Bulk Farm Boxes', name: 'Bulk Farm Boxes', icon: 'Package' },
  { id: 'Grocery & Oils', name: 'Pantry & Oils', icon: 'ShoppingBag' }
];

export const FARMERS = [
  {
    id: 'f1',
    name: 'Rajesh Kumar',
    email: 'rajesh.farmer@localfarm.in',
    phone: '+91 98230 11223',
    location: 'Pune Rural Hub',
    experience: '12 Years Organic Farming',
    specialty: 'Tomatoes & Root Veggies',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    productsCount: 14,
    totalEarnings: 142800,
    approvalStatus: 'Approved', // Approved | Pending | Rejected
    accountStatus: 'Active',    // Active | Inactive
    badge: 'Top Rated Farmer'
  },
  {
    id: 'f2',
    name: 'Sunita Patil',
    email: 'sunita.patil@localfarm.in',
    phone: '+91 97654 33211',
    location: 'Nashik Valley',
    experience: '8 Years Hydroponics & Greens',
    specialty: 'Leafy Greens & Salad Produce',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    productsCount: 18,
    totalEarnings: 98500,
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    badge: 'Pesticide Free Master'
  },
  {
    id: 'f3',
    name: 'Mahesh Deshmukh',
    email: 'mahesh.d@localfarm.in',
    phone: '+91 98901 44556',
    location: 'Satara Cattle Farm',
    experience: '15 Years Indigenous Dairy',
    specialty: 'A2 Milk & Vedic Ghee',
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    productsCount: 8,
    totalEarnings: 215400,
    approvalStatus: 'Approved',
    accountStatus: 'Active',
    badge: 'Certified Organic Dairy'
  },
  {
    id: 'f4',
    name: 'Ganesh Shinde',
    email: 'ganesh.shinde@solapurfarms.org',
    phone: '+91 94220 88991',
    location: 'Solapur Organic Belt',
    experience: '6 Years Pulses & Oils',
    specialty: 'Cold-Pressed Oils & Pulses',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    productsCount: 4,
    totalEarnings: 34000,
    approvalStatus: 'Pending',
    accountStatus: 'Active',
    badge: 'New Applicant'
  },
  {
    id: 'f5',
    name: 'Meena Kulkarni',
    email: 'meena.berry@mahabaleshwar.in',
    phone: '+91 91580 77665',
    location: 'Mahabaleshwar Valley',
    experience: '10 Years Fruit Orchards',
    specialty: 'Strawberries & Berries',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    productsCount: 6,
    totalEarnings: 62000,
    approvalStatus: 'Pending',
    accountStatus: 'Active',
    badge: 'Fruit Specialist'
  }
];

export const CUSTOMERS = [
  {
    id: 'c1',
    name: 'Aniket Sharma',
    email: 'aniket.sharma@gmail.com',
    phone: '+91 98112 34567',
    address: 'Kothrud, Pune 411038',
    ordersCount: 14,
    totalSpent: 4850,
    status: 'Active',
    joinedDate: '12 Jan 2024'
  },
  {
    id: 'c2',
    name: 'Priya Joshi',
    email: 'priya.j@outlook.com',
    phone: '+91 99223 88776',
    address: 'Aundh, Pune 411007',
    ordersCount: 22,
    totalSpent: 12400,
    status: 'Active',
    joinedDate: '05 Mar 2024'
  },
  {
    id: 'c3',
    name: 'Vikram Mehta',
    email: 'vikram.m@techcorp.io',
    phone: '+91 97334 11223',
    address: 'Baner, Pune 411045',
    ordersCount: 8,
    totalSpent: 3100,
    status: 'Active',
    joinedDate: '18 Apr 2024'
  },
  {
    id: 'c4',
    name: 'Sneha Rane',
    email: 'sneha.rane@yahoo.co.in',
    phone: '+91 98556 44332',
    address: 'Viman Nagar, Pune 411014',
    ordersCount: 3,
    totalSpent: 850,
    status: 'Inactive',
    joinedDate: '02 Jun 2024'
  }
];

export const ORDERS = [
  {
    id: 'ORD-8821',
    customerName: 'Aniket Sharma',
    customerEmail: 'aniket.sharma@gmail.com',
    farmerName: 'Rajesh Kumar',
    items: 'Vine Tomatoes (2kg), Hydroponic Spinach (1 bunch)',
    itemsCount: 2,
    total: 110,
    status: 'Out for Delivery', // Pending | Accepted | Out for Delivery | Delivered | Cancelled
    paymentMethod: 'UPI (Paid)',
    date: 'Today, 10:15 AM'
  },
  {
    id: 'ORD-8820',
    customerName: 'Priya Joshi',
    customerEmail: 'priya.j@outlook.com',
    farmerName: 'Mahesh Deshmukh',
    items: 'A2 Gir Cow Milk (2L), Devgad Alphonso Mangoes (1 dozen)',
    itemsCount: 2,
    total: 810,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    date: 'Yesterday, 4:30 PM'
  },
  {
    id: 'ORD-8819',
    customerName: 'Vikram Mehta',
    customerEmail: 'vikram.m@techcorp.io',
    farmerName: 'Sunita Patil',
    items: 'Hydroponic Spinach (3 bunches), Organic Oranges (2kg)',
    itemsCount: 2,
    total: 330,
    status: 'Accepted',
    paymentMethod: 'Cash on Delivery',
    date: 'Yesterday, 11:20 AM'
  },
  {
    id: 'ORD-8818',
    customerName: 'Sneha Rane',
    customerEmail: 'sneha.rane@yahoo.co.in',
    farmerName: 'Anil Shinde',
    items: 'Cold-Pressed Groundnut Oil (2L)',
    itemsCount: 1,
    total: 480,
    status: 'Pending',
    paymentMethod: 'UPI (Paid)',
    date: '09 Aug 2026, 6:45 PM'
  }
];

export const REPORTS_DATA = {
  monthlySales: [
    { month: 'Jan', revenue: 142000, orders: 340 },
    { month: 'Feb', revenue: 168000, orders: 410 },
    { month: 'Mar', revenue: 210000, orders: 520 },
    { month: 'Apr', revenue: 195000, orders: 480 },
    { month: 'May', revenue: 245000, orders: 610 },
    { month: 'Jun', revenue: 280000, orders: 720 },
    { month: 'Jul', revenue: 315000, orders: 840 },
    { month: 'Aug', revenue: 348000, orders: 910 }
  ],
  topProducts: [
    { name: 'Pure A2 Gir Cow Milk', sales: '1,420 units', revenue: 113600 },
    { name: 'Devgad Alphonso Mangoes', sales: '520 dozen', revenue: 338000 },
    { name: 'Fresh Farm Organic Tomatoes', sales: '2,100 kg', revenue: 84000 },
    { name: 'Handcrafted Bilona Ghee', sales: '380 jars', revenue: 361000 }
  ],
  farmerPerformers: [
    { name: 'Mahesh Deshmukh', area: 'Satara', rating: 4.98, totalOrders: 420 },
    { name: 'Rajesh Kumar', area: 'Pune Hub', rating: 4.90, totalOrders: 380 },
    { name: 'Sunita Patil', area: 'Nashik', rating: 4.95, totalOrders: 310 }
  ]
};

export const INITIAL_SETTINGS = {
  profile: {
    name: 'Admin Supervisor',
    email: 'admin@localfarmdirect.in',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  marketplace: {
    storeName: 'Local Farm Direct',
    deliveryFee: 30,
    minOrderAmount: 100,
    currency: '₹ (INR)'
  },
  notifications: {
    newOrderAlert: true,
    farmerRegAlert: true,
    lowStockAlert: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: '30 mins'
  }
};

export const STATS = [
  { label: 'Farmers Joined', count: 2847, suffix: '+', subtext: 'Verified AP & MH Farmers', iconType: 'farmer' },
  { label: 'Happy Customers', count: 48392, suffix: '+', subtext: '98.4% Satisfaction Rating', iconType: 'customer' },
  { label: 'Products Listed', count: 186, suffix: '', subtext: 'Fresh Crop Harvests Daily', iconType: 'product' },
  { label: 'Villages Connected', count: 142, suffix: '', subtext: 'Chittoor, Pune & Satara', iconType: 'village' }
];
