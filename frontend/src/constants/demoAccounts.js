export const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    name: 'Admin Supervisor',
    email: 'admin@localfarmdirect.in',
    password: 'password123',
    badge: 'System Admin',
    desc: 'Full platform oversight, farm approvals, KYC & hubs',
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    iconName: 'Shield'
  },
  {
    role: 'Farmer',
    name: 'Rajesh Kumar',
    email: 'rajesh.farmer@localfarm.in',
    password: 'password123',
    badge: 'Organic Farmer',
    desc: 'List crops, inventory management & sales payouts',
    color: 'from-emerald-600 to-green-700',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    iconName: 'Tractor'
  },
  {
    role: 'Delivery',
    name: 'Rohan Sharma',
    email: 'rohan.delivery@localfarm.in',
    password: 'password123',
    badge: 'EV Fleet Partner',
    desc: 'Live order routing, hub shifts & wallet earnings',
    color: 'from-blue-600 to-indigo-700',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    iconName: 'Truck'
  },
  {
    role: 'Customer',
    name: 'Aniket Sharma',
    email: 'aniket.sharma@gmail.com',
    password: 'password123',
    badge: 'Silver Member',
    desc: 'Browse fresh harvests, cart, live tracking & orders',
    color: 'from-teal-600 to-emerald-700',
    border: 'border-teal-300',
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    iconName: 'UserCheck'
  }
];

export const DEMO_BY_ROLE = DEMO_ACCOUNTS.reduce((acc, curr) => {
  acc[curr.role] = curr;
  return acc;
}, {});
