import React, { useState, useEffect } from 'react';
import { Profile } from '../../components/Profile';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { UsersTab } from './tabs/UsersTab';
import { KycQueueTab } from './tabs/KycQueueTab';
import { CommissionTab } from './tabs/CommissionTab';
import { AuditLogTab } from './tabs/AuditLogTab';
import {
  Settings,
  User,
  Store,
  Bell,
  Shield,
  Save,
  Key,
  Lock,
  CheckCircle2,
  Mail,
  Camera,
  UserCheck,
  ShieldCheck,
  DollarSign,
  Sliders,
  Eye,
  EyeOff,
  Check,
  Smartphone,
  CheckCircle,
  Sparkles,
  MapPin,
  Laptop,
  Users,
  BarChart2,
  ClipboardList,
  Percent,
  Globe,
  Megaphone,
  Wrench,
  ScrollText,
  X,
  AlertTriangle,
  TrendingUp,
  Package,
  Truck,
  ShoppingBag,
  Ban,
  UserPlus,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Edit3,
  Image,
  Clock,
  ArrowUpRight,
  Star,
  Award,
  Zap,
  RefreshCw,
  Download,
} from 'lucide-react';

/* ─────────────────────────── MOCK DATA ─────────────────────────── */

const MOCK_USERS = {
  farmers: [
    { id: 'F-001', name: 'Rajesh Kumar', email: 'rajesh@localfarm.in', phone: '+91 94401 22334', farm: 'Palamaner Organic Collective', status: 'Active', kyc: 'Approved', joined: '2026-03-12', orders: 142, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
    { id: 'F-002', name: 'Suresh Reddy', email: 'suresh@greenfields.in', phone: '+91 98230 44556', farm: 'Chittoor Agro Fields', status: 'Pending', kyc: 'Under Review', joined: '2026-08-01', orders: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
    { id: 'F-003', name: 'Lakshmi Devi', email: 'lakshmi@nativecrops.in', phone: '+91 97440 33219', farm: 'Native Crops AP', status: 'Active', kyc: 'Approved', joined: '2026-01-20', orders: 298, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
    { id: 'F-004', name: 'Venkat Rao', email: 'venkat@madanapalle.in', phone: '+91 96310 78902', farm: 'Madanapalle Mango Estate', status: 'Suspended', kyc: 'Rejected', joined: '2025-11-05', orders: 45, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80' },
  ],
  customers: [
    { id: 'C-001', name: 'Anita Sharma', email: 'anita.sharma@gmail.com', phone: '+91 98450 67123', status: 'Active', tier: 'Gold', orders: 35, joined: '2026-02-14', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' },
    { id: 'C-002', name: 'Priya Menon', email: 'priya.menon@outlook.com', phone: '+91 97880 12345', status: 'Active', tier: 'Silver', orders: 18, joined: '2026-05-03', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' },
    { id: 'C-003', name: 'Amit Joshi', email: 'amit.joshi@yahoo.com', phone: '+91 93440 56789', status: 'Suspended', tier: 'Bronze', orders: 4, joined: '2026-07-20', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=80&q=80' },
    { id: 'C-004', name: 'Meena Pillai', email: 'meena.pillai@gmail.com', phone: '+91 99003 44321', status: 'Active', tier: 'Emerald', orders: 62, joined: '2025-12-01', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80' },
  ],
  delivery: [
    { id: 'DEL-001', name: 'Rohan Sharma', email: 'rohan@greenmarket.in', phone: '+91 98765 43210', vehicle: 'EV Scooter (Ather 450X)', status: 'Active', rating: 4.9, deliveries: 312, joined: '2026-04-10', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&q=80' },
    { id: 'DEL-002', name: 'Kiran Patil', email: 'kiran.patil@delivery.in', phone: '+91 97660 23456', vehicle: 'Motorcycle (Hero Splendor)', status: 'Offline', rating: 4.5, deliveries: 87, joined: '2026-06-15', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' },
    { id: 'DEL-003', name: 'Pooja Nair', email: 'pooja.nair@delivery.in', phone: '+91 96550 34567', vehicle: 'Cold-Chain Mini Van', status: 'Active', rating: 4.7, deliveries: 156, joined: '2026-03-22', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80' },
  ],
};

const MOCK_KYC = [
  { id: 'kyc-1', farmer: 'Suresh Reddy', farmerId: 'F-002', docType: 'Organic Farming Certificate', uploadDate: '2026-08-20', status: 'Pending', fileName: 'organic_cert_suresh.pdf' },
  { id: 'kyc-2', farmer: 'Venkat Rao', farmerId: 'F-004', docType: 'FSSAI Food Business License', uploadDate: '2026-07-15', status: 'Rejected', fileName: 'fssai_venkat.pdf' },
  { id: 'kyc-3', farmer: 'Suresh Reddy', farmerId: 'F-002', docType: 'Land Title Proof (Khata)', uploadDate: '2026-08-22', status: 'Pending', fileName: 'land_patta_suresh.jpg' },
  { id: 'kyc-4', farmer: 'Priya Farm Co.', farmerId: 'F-005', docType: 'Organic Farming Certificate', uploadDate: '2026-08-24', status: 'Pending', fileName: 'organic_priyafarm.pdf' },
];

const MOCK_AUDIT_LOG = [
  { id: 1, timestamp: '2026-08-25 21:30:14', admin: 'Lakshmidhar B', action: 'Suspended Farmer', entity: 'Venkat Rao (F-004)' },
  { id: 2, timestamp: '2026-08-25 20:12:05', admin: 'Lakshmidhar B', action: 'Approved KYC Document', entity: 'Rajesh Kumar — Organic Cert' },
  { id: 3, timestamp: '2026-08-25 18:44:32', admin: 'Lakshmidhar B', action: 'Updated Platform Commission', entity: '8% → 9%' },
  { id: 4, timestamp: '2026-08-24 15:22:11', admin: 'Lakshmidhar B', action: 'Created Delivery Zone', entity: 'Wakad Zone (Pune West)' },
  { id: 5, timestamp: '2026-08-24 11:05:48', admin: 'Lakshmidhar B', action: 'Activated Flash Sale Banner', entity: 'Independence Day Harvest Sale' },
  { id: 6, timestamp: '2026-08-23 09:30:00', admin: 'Lakshmidhar B', action: 'Reset User Password', entity: 'Anita Sharma (C-001)' },
  { id: 7, timestamp: '2026-08-22 16:20:55', admin: 'Lakshmidhar B', action: 'Rejected KYC Document', entity: 'Venkat Rao — FSSAI License' },
  { id: 8, timestamp: '2026-08-21 14:10:22', admin: 'Lakshmidhar B', action: 'Onboarded Delivery Partner', entity: 'Pooja Nair (DEL-003)' },
  { id: 9, timestamp: '2026-08-20 10:05:33', admin: 'Lakshmidhar B', action: 'Toggled Maintenance Mode', entity: 'Platform → Offline (Scheduled)' },
  { id: 10, timestamp: '2026-08-19 08:45:00', admin: 'Lakshmidhar B', action: 'Updated Payout Schedule', entity: 'Weekly → Bi-weekly' },
];

const MOCK_BANNERS = [
  { id: 'b1', title: 'Mango Season — Alphonso at Farm Prices!', startDate: '2026-08-01', endDate: '2026-09-15', active: true, type: 'Seasonal' },
  { id: 'b2', title: 'Independence Day Harvest Sale — 20% Off', startDate: '2026-08-12', endDate: '2026-08-20', active: false, type: 'Flash Sale' },
  { id: 'b3', title: 'New Arrival: Desi A2 Ghee from Chittoor Farms', startDate: '2026-08-25', endDate: '2026-09-30', active: true, type: 'Product' },
];

const MOCK_ZONES = [
  { id: 'z1', name: 'Pune Central', hub: 'Chittoor AP Hub — Pune Central', radius: 12, active: true, manager: 'Suresh Hub Manager' },
  { id: 'z2', name: 'Wakad Zone', hub: 'Wakad Dispatch Point', radius: 8, active: true, manager: 'Kiran Patil' },
  { id: 'z3', name: 'Hadapsar South', hub: 'Hadapsar Agri Depot', radius: 10, active: false, manager: 'Pooja Nair' },
  { id: 'z4', name: 'Chittoor Express', hub: 'Palamaner NH-140 Hub', radius: 25, active: true, manager: 'Rajesh Route Supervisor' },
];

/* ─────────────────────────── SMALL ATOMS ─────────────────────────── */

const Toggle = ({ value, onChange, isDark }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
      value
        ? isDark ? 'bg-[#00FF85] shadow-[0_0_10px_rgba(0,255,133,0.4)]' : 'bg-emerald-600'
        : isDark ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-gray-300'
    }`}
  >
    <span className={`w-5 h-5 rounded-full absolute top-0.5 transition-all shadow-sm ${
      value
        ? isDark ? 'bg-[#06090A] left-6' : 'bg-white left-6'
        : isDark ? 'bg-[#7FA882] left-0.5' : 'bg-white left-0.5'
    }`} />
  </button>
);

const StatusBadge = ({ status, isDark }) => {
  const mapDark = {
    Active: 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border-[rgba(0,255,133,0.3)]',
    Pending: 'bg-[rgba(251,184,58,0.1)] text-[#FBB83A] border-[rgba(251,184,58,0.3)]',
    Suspended: 'bg-[rgba(255,77,77,0.1)] text-[#FF6B6B] border-[rgba(255,77,77,0.3)]',
    Offline: 'bg-[rgba(255,255,255,0.05)] text-[#7FA882] border-[rgba(255,255,255,0.1)]',
    Approved: 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border-[rgba(0,255,133,0.3)]',
    'Under Review': 'bg-[rgba(0,191,255,0.1)] text-[#5CD9FF] border-[rgba(0,191,255,0.3)]',
    Rejected: 'bg-[rgba(255,77,77,0.1)] text-[#FF6B6B] border-[rgba(255,77,77,0.3)]',
  };
  const mapLight = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Suspended: 'bg-rose-100 text-rose-800 border-rose-200',
    Offline: 'bg-gray-100 text-gray-700 border-gray-200',
    Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
      isDark ? (mapDark[status] || 'bg-[rgba(255,255,255,0.05)] text-[#7FA882] border-[rgba(255,255,255,0.1)]') : (mapLight[status] || 'bg-gray-100 text-gray-700 border-gray-200')
    }`}>
      {status}
    </span>
  );
};

/* ─────────────────────────── USER MODAL ─────────────────────────── */

const UserModal = ({ user, roleType, onClose, onAction, showToast, isDark }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border animate-scaleUp relative ${
          isDark ? 'bg-[#0A120D] border-[rgba(0,255,133,0.15)] text-[#D4EAD9]' : 'bg-white border-gray-100 text-farmGreen-950'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isDark ? 'bg-gradient-to-r from-[#040805] via-[#0A160F] to-[#081F12] border-[rgba(0,255,133,0.15)] text-white' : 'bg-gradient-to-r from-farmGreen-950 via-emerald-900 to-farmGreen-900 border-emerald-800 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className={`w-12 h-12 rounded-2xl object-cover ring-2 ${isDark ? 'ring-[rgba(0,255,133,0.4)]' : 'ring-emerald-400/40'}`} />
            <div>
              <div className="font-black text-base">{user.name}</div>
              <div className={`text-[11px] font-bold ${isDark ? 'text-[#00FF85]' : 'text-emerald-300'}`}>{user.id} · {roleType}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-bold max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>Email</div>
              <div className={`font-black truncate ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.email}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>Phone</div>
              <div className={`font-black font-mono ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.phone}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>Status</div>
              <StatusBadge status={user.status} isDark={isDark} />
            </div>
            <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>Joined</div>
              <div className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.joined}</div>
            </div>
            {user.farm && (
              <div className={`col-span-2 p-3 rounded-2xl border ${isDark ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.15)]' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`}>Farm Name</div>
                <div className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.farm}</div>
              </div>
            )}
            {user.kyc && (
              <div className={`col-span-2 p-3 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[rgba(0,191,255,0.04)] border-[rgba(0,191,255,0.15)]' : 'bg-blue-50 border-blue-100'}`}>
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#5CD9FF]' : 'text-blue-700'}`}>KYC Status</div>
                  <StatusBadge status={user.kyc} isDark={isDark} />
                </div>
                <button
                  onClick={() => { onAction('view-docs', user); onClose(); }}
                  className={`text-[10px] hover:underline font-black cursor-pointer ${isDark ? 'text-[#5CD9FF]' : 'text-blue-700'}`}
                >
                  View Documents →
                </button>
              </div>
            )}
            {user.vehicle && (
              <div className={`col-span-2 p-3 rounded-2xl border ${isDark ? 'bg-[rgba(251,184,58,0.04)] border-[rgba(251,184,58,0.15)]' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#FBB83A]' : 'text-amber-700'}`}>Vehicle</div>
                <div className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.vehicle}</div>
              </div>
            )}
            {user.tier && (
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(212,167,69,0.04)] border-[rgba(212,167,69,0.15)]' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#D4A745]' : 'text-amber-700'}`}>Tier</div>
                <div className={`font-black ${isDark ? 'adm-gold-text' : 'text-farmGreen-950'}`}>{user.tier}</div>
              </div>
            )}
            {user.orders !== undefined && (
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`}>
                  {user.deliveries !== undefined ? 'Deliveries' : 'Orders'}
                </div>
                <div className={`font-black text-base ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{user.deliveries ?? user.orders}</div>
              </div>
            )}
            {user.rating !== undefined && (
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[rgba(251,184,58,0.04)] border-[rgba(251,184,58,0.15)]' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#FBB83A]' : 'text-amber-700'}`}>Rating</div>
                <div className={`font-black flex items-center gap-1 ${isDark ? 'text-[#FBB83A]' : 'text-farmGreen-950'}`}>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {user.rating}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className={`p-4 border-t flex flex-wrap gap-2 justify-end ${
          isDark ? 'bg-[rgba(0,255,133,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50 border-gray-100'
        }`}>
          {user.status !== 'Suspended' ? (
            <button
              onClick={() => { onAction('suspend', user); onClose(); }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Ban className="w-3.5 h-3.5" /> Suspend Account
            </button>
          ) : (
            <button
              onClick={() => { onAction('unsuspend', user); onClose(); }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Reactivate Account
            </button>
          )}
          {user.kyc === 'Under Review' && (
            <button
              onClick={() => { onAction('approve', user); onClose(); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Approve KYC
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

export const AdminSettings = ({ isDark = true }) => {
  const { user, showToast } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [serverSettings, setServerSettings] = useState({});

  const [usersData, setUsersData] = useState(MOCK_USERS);
  const [kycItems, setKycItems] = useState(MOCK_KYC);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOG);

  // Load real settings and user/audit collections from backend on mount
  useEffect(() => {
    adminService.getSettings()
      .then(s => setServerSettings(s || {}))
      .catch(err => console.warn('[AdminSettings] Could not load settings:', err));

    Promise.allSettled([
      adminService.getFarmers(),
      adminService.getCustomers(),
      adminService.getDeliveryFleet(),
      adminService.getKycQueue(),
      adminService.getAuditLogs(),
    ]).then(([farmersRes, custRes, fleetRes, kycRes, auditRes]) => {
      setUsersData(prev => ({
        farmers: (farmersRes.status === 'fulfilled' && farmersRes.value?.length) ? farmersRes.value : prev.farmers,
        customers: (custRes.status === 'fulfilled' && custRes.value?.length) ? custRes.value : prev.customers,
        delivery: (fleetRes.status === 'fulfilled' && fleetRes.value?.length) ? fleetRes.value : prev.delivery,
      }));
      if (kycRes.status === 'fulfilled' && kycRes.value?.length) {
        setKycItems(kycRes.value);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value?.length) {
        setAuditLogs(auditRes.value);
      }
    }).catch(err => console.warn('[AdminSettings] Collections sync error:', err));
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Profile States — initialized from logged-in user
  const [profileName, setProfileName] = useState(() => user?.name || 'Admin');
  const [profileEmail, setProfileEmail] = useState(() => user?.email || 'admin@localfarm.in');
  const [profilePhoto, setProfilePhoto] = useState(() => user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Marketplace States — from backend settings
  const [storeName, setStoreName] = useState(serverSettings?.storeName || 'LocalFarm Direct Marketplace');
  const [deliveryFee, setDeliveryFee] = useState(serverSettings?.deliveryFee ?? 30);
  const [minOrder, setMinOrder] = useState(serverSettings?.minOrder ?? 199);
  const [currency, setCurrency] = useState(serverSettings?.currency || '₹ (INR)');
  const [hubLocation, setHubLocation] = useState(serverSettings?.hubLocation || 'Chittoor District AP Hub');

  // Notification States
  const [newOrderAlert, setNewOrderAlert] = useState(serverSettings?.newOrderAlert ?? true);
  const [farmerRegAlert, setFarmerRegAlert] = useState(serverSettings?.farmerRegAlert ?? true);
  const [lowStockAlert, setLowStockAlert] = useState(serverSettings?.lowStockAlert ?? true);
  const [regionalChittoorAlert, setRegionalChittoorAlert] = useState(true);

  // Security States
  const [twoFactorAuth, setTwoFactorAuth] = useState(serverSettings?.twoFactorAuth ?? true);

  // User Management States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('farmers');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalRoleType, setUserModalRoleType] = useState('');
  const [userStatuses, setUserStatuses] = useState({});

  // Commission States
  const [commission, setCommission] = useState(8);
  const [payoutSchedule, setPayoutSchedule] = useState('Weekly');
  const [minPayout, setMinPayout] = useState(500);
  const [gstIncluded, setGstIncluded] = useState(false);

  // Zones States
  const [zones, setZones] = useState(MOCK_ZONES);

  // Banners States
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [flashSaleActive, setFlashSaleActive] = useState(false);
  const [flashSalePercent, setFlashSalePercent] = useState(15);

  // Maintenance States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('GreenMarket is undergoing scheduled maintenance. We will be back shortly!');
  const [maintenanceDate, setMaintenanceDate] = useState('');

  // Audit Log States
  const [auditFilter, setAuditFilter] = useState('All');

  /* ── Handlers ── */
  const handleSaveProfileData = (updatedData) => {
    setProfileName(updatedData.name);
    setProfileEmail(updatedData.email);
    setProfilePhoto(updatedData.avatar);
    if (showToast) showToast('Admin Profile Saved 👤', 'Profile information updated successfully!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      if (showToast) showToast('Error ⚠️', 'Please fill in both password fields.', 'error');
      return;
    }
    if (showToast) showToast('Password Updated 🔒', 'Admin account security password changed successfully.');
    setOldPassword('');
    setNewPassword('');
  };

  const handleSaveMarketplace = (e) => {
    e.preventDefault();
    if (showToast) showToast('Marketplace Settings Saved 🏪', 'Platform fees & configuration updated.');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    if (showToast) showToast('Notification Preferences Saved 🔔', 'System alert settings updated.');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (showToast) showToast('Security Settings Updated 🛡️', 'Two-Factor Auth and password settings saved.');
  };

  const handleUserAction = (action, targetUser) => {
    if (action === 'suspend') {
      setUserStatuses(prev => ({ ...prev, [targetUser.id]: 'Suspended' }));
      if (showToast) showToast('Account Suspended 🚫', `${targetUser.name}'s account has been suspended.`, 'error');
    } else if (action === 'unsuspend') {
      setUserStatuses(prev => ({ ...prev, [targetUser.id]: 'Active' }));
      if (showToast) showToast('Account Reactivated ✅', `${targetUser.name}'s account is now active.`);
    } else if (action === 'approve') {
      setUserStatuses(prev => ({ ...prev, [targetUser.id]: 'Active' }));
      if (showToast) showToast('Account Approved ✅', `${targetUser.name} has been approved and activated.`);
    } else if (action === 'view-docs') {
      setActiveSubTab('kyc');
    }
  };

  const handleKycAction = (id, action) => {
    setKycItems(prev => prev.map(k => k.id === id ? { ...k, status: action === 'approve' ? 'Approved' : 'Rejected' } : k));
    if (showToast) showToast(
      action === 'approve' ? 'KYC Approved ✅' : 'KYC Rejected ❌',
      action === 'approve' ? 'Document verified and farmer status updated.' : 'Document rejected. Farmer will be notified.'
    );
  };

  const handleSaveCommission = (e) => {
    e.preventDefault();
    if (showToast) showToast('Commission Rules Saved 💰', `Platform commission set to ${commission}%. Payout: ${payoutSchedule}.`);
  };

  const handleToggleZone = (id) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));
    const zone = zones.find(z => z.id === id);
    if (showToast) showToast(
      zone.active ? 'Zone Deactivated 🔴' : 'Zone Activated 🟢',
      `${zone.name} delivery zone is now ${zone.active ? 'inactive' : 'active'}.`
    );
  };

  const handleToggleBanner = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    const banner = banners.find(b => b.id === id);
    if (showToast) showToast(
      banner.active ? 'Banner Hidden 🙈' : 'Banner Live 📢',
      `"${banner.title}" is now ${banner.active ? 'hidden' : 'live on homepage'}.`
    );
  };

  const handleSaveMaintenance = (e) => {
    e.preventDefault();
    if (showToast) showToast(
      maintenanceMode ? 'Maintenance Mode Active 🔧' : 'Platform Live ✅',
      maintenanceMode ? 'Platform is in maintenance. Only admins can access.' : 'Platform restored to full operation.'
    );
  };

  const filteredUsers = (() => {
    const list = MOCK_USERS[userRoleFilter] || [];
    if (!userSearch.trim()) return list;
    const q = userSearch.toLowerCase();
    return list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
  })();

  const auditActions = ['All', 'Suspended Farmer', 'Approved KYC Document', 'Updated Platform Commission', 'Created Delivery Zone', 'Activated Flash Sale Banner', 'Reset User Password'];
  const filteredAudit = auditFilter === 'All' ? MOCK_AUDIT_LOG : MOCK_AUDIT_LOG.filter(a => a.action.includes(auditFilter));

  /* ── Tabs Config ── */
  const tabs = [
    { id: 'profile',       label: 'Admin Profile',    icon: User },
    { id: 'users',         label: 'User Management',  icon: Users, badge: MOCK_USERS.farmers.length + MOCK_USERS.customers.length + MOCK_USERS.delivery.length },
    { id: 'analytics',     label: 'Analytics',        icon: BarChart2, badge: '+32%' },
    { id: 'kyc',           label: 'KYC Queue',        icon: ClipboardList, badge: kycItems.filter(k => k.status === 'Pending').length },
    { id: 'commission',    label: 'Commission',       icon: Percent, badge: `${commission}%` },
    { id: 'zones',         label: 'Zones',            icon: MapPin, badge: zones.filter(z => z.active).length },
    { id: 'banners',       label: 'Promotions',       icon: Megaphone, badge: banners.filter(b => b.active).length },
    { id: 'maintenance',   label: 'Maintenance',      icon: Wrench, badge: maintenanceMode ? 'Active' : 'Live' },
    { id: 'marketplace',   label: 'Marketplace',      icon: Store },
    { id: 'notifications', label: 'Alerts',           icon: Bell },
    { id: 'security',      label: 'Security',         icon: Shield },
    { id: 'audit',         label: 'Audit Log',        icon: ScrollText, badge: MOCK_AUDIT_LOG.length },
  ];

  /* ── Reusable Section Header ── */
  const SectionHeader = ({ icon: Icon, title, description, badge }) => (
    <div className={`p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b ${
      isDark 
        ? 'bg-gradient-to-r from-[#040805] via-[#0A160F] to-[#081F12] border-[rgba(0,255,133,0.15)] text-white' 
        : 'bg-gradient-to-r from-farmGreen-950 via-emerald-900 to-farmGreen-900 border-emerald-800 text-white'
    }`}>
      <div className="flex items-center gap-3.5">
        <div className={`p-3 rounded-2xl border shrink-0 ${
          isDark ? 'bg-[rgba(0,255,133,0.12)] text-[#00FF85] border-[rgba(0,255,133,0.25)]' : 'bg-emerald-500/20 text-emerald-300 border-white/10'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-xl text-white tracking-tight">{title}</h3>
          <p className="text-xs text-emerald-200/80 font-medium mt-0.5">{description}</p>
        </div>
      </div>
      {badge && (
        <span className="px-3.5 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-xs uppercase tracking-wider shadow-xs shrink-0">
          {badge}
        </span>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-display pb-12">

      {/* User Modal */}
      {selectedUser && (
        <UserModal
          user={{ ...selectedUser, status: userStatuses[selectedUser.id] || selectedUser.status }}
          roleType={userModalRoleType}
          onClose={() => setSelectedUser(null)}
          onAction={handleUserAction}
          showToast={showToast}
          isDark={isDark}
        />
      )}

      {/* Governance Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-[32px] border relative overflow-hidden group transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-[#060C08] via-[#0A1A0E] to-[#0D2010] border-[rgba(0,255,133,0.15)] shadow-[0_8px_48px_rgba(0,0,0,0.6)] text-white' 
          : 'bg-gradient-to-br from-[#0A2312] via-[#183D22] to-[#257036] border-farmGreen-600/30 text-white shadow-2xl'
      }`}>
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl group-hover:bg-emerald-400/25 transition-all duration-700" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all duration-700" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-wider mb-2 shadow-xs ${
              isDark ? 'bg-[rgba(0,255,133,0.1)] border-[rgba(0,255,133,0.3)] text-[#00FF85]' : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Governance • System Settings</span>
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">Admin & Platform Settings</h1>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              Full-spectrum platform control — users, analytics, KYC, commissions, zones, promotions & more.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">Admin</div>
              <div className="font-black text-sm text-white">{profileName}</div>
            </div>
            <div className={`w-12 h-12 rounded-2xl backdrop-blur-md border flex items-center justify-center shadow-lg ${
              isDark ? 'bg-[rgba(0,255,133,0.1)] border-[rgba(0,255,133,0.3)] text-[#00FF85]' : 'bg-white/10 border-white/20 text-amber-300'
            }`}>
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar — Floating Pill Bar */}
      <div className={`flex items-center gap-1.5 overflow-x-auto p-2 rounded-3xl border scrollbar-none transition-all ${
        isDark ? 'adm-glass border-[rgba(0,255,133,0.08)]' : 'bg-white/90 backdrop-blur-xl border-emerald-200/60 shadow-lg shadow-emerald-950/5'
      }`}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all duration-300 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-98 ${
                isActive
                  ? isDark
                    ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.4)] shadow-[0_0_12px_rgba(0,255,133,0.2)] scale-[1.02]'
                    : 'bg-emerald-700 text-white shadow-md border border-emerald-800 scale-[1.02]'
                  : isDark
                    ? 'text-[#7FA882] border border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.06)] hover:text-[#D4EAD9]'
                    : 'bg-gray-50/80 text-gray-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-gray-100 hover:border-emerald-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                isActive ? (isDark ? 'text-[#00FF85]' : 'text-amber-300') : (isDark ? 'text-[#7FA882]' : 'text-emerald-700')
              }`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black transition-colors ${
                  isActive 
                    ? (isDark ? 'bg-[rgba(0,255,133,0.2)] text-[#00FF85]' : 'bg-white/20 text-white')
                    : (isDark ? 'bg-[rgba(0,255,133,0.08)] text-[#7FA882]' : 'bg-emerald-100 text-emerald-900')
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark ? 'adm-glass border-[rgba(0,255,133,0.08)]' : 'bg-white border-gray-100 shadow-sm'
      }`}>

        {/* ══════════════ 1. ADMIN PROFILE ══════════════ */}
        {activeSubTab === 'profile' && (
          <div className="animate-fadeIn">
            <SectionHeader
              icon={UserCheck}
              title="Admin Profile Information"
              description="Manage your administrator identity, credentials, and profile picture"
              badge="System Admin"
            />

            <div className="p-6 sm:p-8 space-y-6">
              <Profile
                initialData={{ name: profileName, email: profileEmail, avatar: profilePhoto }}
                userRole="Admin"
                onSave={handleSaveProfileData}
                showToast={showToast}
                isDark={isDark}
              />

              {/* Password Update Block */}
              <form onSubmit={handleUpdatePassword} className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50/80 border-gray-200'
              }`}>
                <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-[rgba(0,255,133,0.08)]' : 'border-gray-200'}`}>
                  <Key className={`w-4 h-4 ${isDark ? 'text-[#00FF85]' : 'text-emerald-600'}`} />
                  <h4 className={`font-black text-xs uppercase tracking-wider ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                    Security & Password Update
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`font-bold mb-1 block text-[11px] ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Current Password</label>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`} />
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs outline-none font-mono transition-all ${
                          isDark 
                            ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                            : 'bg-white border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
                        }`}
                      />
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}>
                        {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`font-bold mb-1 block text-[11px] ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>New Password</label>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#7FA882]' : 'text-gray-400'}`} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs outline-none font-mono transition-all ${
                          isDark 
                            ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] placeholder-[#7FA882]/40 focus:border-[#00FF85]' 
                            : 'bg-white border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
                        }`}
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${isDark ? 'text-[#7FA882] hover:text-[#D4EAD9]' : 'text-gray-400 hover:text-gray-600'}`}>
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <button 
                    type="submit" 
                    className={`px-8 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
                      isDark 
                        ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md'
                    }`}
                  >
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════ 2. USER MANAGEMENT ══════════════ */}
        {activeSubTab === 'users' && (
          <UsersTab
            mockUsers={MOCK_USERS}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            filteredUsers={filteredUsers}
            userStatuses={userStatuses}
            setSelectedUser={setSelectedUser}
            setUserModalRoleType={setUserModalRoleType}
            StatusBadge={StatusBadge}
            SectionHeader={SectionHeader}
            isDark={isDark}
          />
        )}

        {/* ══════════════ 3. ANALYTICS ══════════════ */}
        {activeSubTab === 'analytics' && (
          <div className="animate-fadeIn">
            <SectionHeader
              icon={BarChart2}
              title="Platform Analytics"
              description="Revenue, order volume, active sellers & region-wise performance"
            />

            <div className="p-6 sm:p-8 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Gross Revenue', value: '₹4,82,310', delta: '+18%', icon: TrendingUp, color: 'emerald' },
                  { label: 'Total Orders', value: '1,248', delta: '+32%', icon: ShoppingBag, color: 'blue' },
                  { label: 'Active Farmers', value: '28', delta: '+5', icon: Award, color: 'amber' },
                  { label: 'Delivery Partners', value: '12', delta: '+2', icon: Truck, color: 'purple' },
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className={`p-5 rounded-2xl border space-y-3 ${
                      isDark 
                        ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' 
                        : 'bg-farmBg/60 border-emerald-100/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isDark ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-700'
                        }`}>{kpi.delta} ↑</span>
                      </div>
                      <div>
                        <div className={`font-black text-xl ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{kpi.value}</div>
                        <div className={`text-[10px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{kpi.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Orders Bar Chart */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-gray-50/80 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-black text-sm flex items-center gap-2 ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>
                    <BarChart2 className={`w-4 h-4 ${isDark ? 'text-[#00FF85]' : 'text-emerald-700'}`} /> Monthly Order Volume (2026)
                  </h4>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Last 6 months</span>
                </div>
                <div className="flex items-end gap-3 h-32">
                  {[
                    { month: 'Mar', val: 68 }, { month: 'Apr', val: 84 }, { month: 'May', val: 112 },
                    { month: 'Jun', val: 145 }, { month: 'Jul', val: 189 }, { month: 'Aug', val: 248 },
                  ].map(bar => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-black ${isDark ? 'text-[#00FF85]' : 'text-emerald-800'}`}>{bar.val}</span>
                      <div
                        className="w-full bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-lg transition-all hover:opacity-80 cursor-default"
                        style={{ height: `${(bar.val / 248) * 100}%` }}
                      />
                      <span className={`text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region Performance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { region: '📍 Chittoor, AP', orders: 542, revenue: '₹2,14,800', growth: '+24%' },
                  { region: '📍 Pune, MH', orders: 487, revenue: '₹1,98,200', growth: '+19%' },
                  { region: '📍 Madanapalle, AP', orders: 219, revenue: '₹69,310', growth: '+12%' },
                ].map((r, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)]' : 'bg-white border-gray-200 shadow-xs'
                  }`}>
                    <div className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{r.region}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-black">
                        <span className={isDark ? 'text-[#7FA882]' : 'text-farmMuted'}>Orders</span>
                        <span className={isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}>{r.orders}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-black">
                        <span className={isDark ? 'text-[#7FA882]' : 'text-farmMuted'}>Revenue</span>
                        <span className={isDark ? 'adm-gold-text' : 'text-emerald-700'}>{r.revenue}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-black">
                        <span className={isDark ? 'text-[#7FA882]' : 'text-farmMuted'}>Growth</span>
                        <span className={isDark ? 'text-[#00FF85]' : 'text-emerald-600'}>{r.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 4. KYC REVIEW QUEUE ══════════════ */}
        {activeSubTab === 'kyc' && (
          <KycQueueTab
            kycItems={kycItems}
            handleKycAction={handleKycAction}
            StatusBadge={StatusBadge}
            SectionHeader={SectionHeader}
            isDark={isDark}
          />
        )}

        {/* ══════════════ 5. COMMISSION & PAYOUT RULES ══════════════ */}
        {activeSubTab === 'commission' && (
          <CommissionTab
            commission={commission}
            setCommission={setCommission}
            payoutSchedule={payoutSchedule}
            setPayoutSchedule={setPayoutSchedule}
            minPayout={minPayout}
            setMinPayout={setMinPayout}
            gstIncluded={gstIncluded}
            setGstIncluded={setGstIncluded}
            handleSaveCommission={handleSaveCommission}
            Toggle={Toggle}
            SectionHeader={SectionHeader}
            isDark={isDark}
          />
        )}

        {/* ══════════════ 6. DELIVERY ZONE CONFIGURATION ══════════════ */}
        {activeSubTab === 'zones' && (
          <div className="animate-fadeIn">
            <SectionHeader
              icon={MapPin}
              title="Delivery Zone Configuration"
              description="Manage active delivery zones, radius settings, and hub manager assignments"
            />

            <div className="p-6 sm:p-8 space-y-4">
              <div className="space-y-3">
                {zones.map(zone => (
                  <div key={zone.id} className={`p-5 rounded-2xl border transition-all ${
                    zone.active 
                      ? isDark ? 'bg-[rgba(0,255,133,0.03)] border-[rgba(0,255,133,0.2)]' : 'bg-white border-emerald-200 shadow-xs'
                      : isDark ? 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.06)]' : 'bg-gray-50/60 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <MapPin className={`w-4 h-4 shrink-0 ${zone.active ? (isDark ? 'text-[#00FF85]' : 'text-emerald-600') : 'text-gray-400'}`} />
                          <span className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{zone.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            zone.active 
                              ? isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85] border border-[rgba(0,255,133,0.3)]' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isDark ? 'bg-[rgba(255,255,255,0.05)] text-[#7FA882] border border-[rgba(255,255,255,0.1)]' : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {zone.active ? '● Active' : '○ Inactive'}
                          </span>
                        </div>
                        <div className={`text-[11px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Hub: {zone.hub}</div>
                        <div className={`flex items-center gap-3 text-[11px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                          <span>📏 Radius: <strong className={isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}>{zone.radius} km</strong></span>
                          <span>·</span>
                          <span>👤 Manager: <strong className={isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}>{zone.manager}</strong></span>
                        </div>
                      </div>
                      <Toggle value={zone.active} onChange={() => handleToggleZone(zone.id)} isDark={isDark} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { if (showToast) showToast('Zone Added ➕', 'New delivery zone created. Configure hub manager and radius.'); }}
                className={`w-full py-3 border-2 border-dashed rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDark 
                    ? 'border-[rgba(0,255,133,0.2)] text-[#00FF85] hover:bg-[rgba(0,255,133,0.05)]' 
                    : 'bg-gray-50 hover:bg-emerald-50 border-gray-200 hover:border-emerald-300 text-gray-600 hover:text-emerald-800'
                }`}
              >
                <Plus className="w-4 h-4" /> Add New Delivery Zone
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ 7. BANNER & PROMOTIONS MANAGER ══════════════ */}
        {activeSubTab === 'banners' && (
          <div className="animate-fadeIn">
            <SectionHeader
              icon={Megaphone}
              title="Banner & Promotions Manager"
              description="Schedule homepage banners, flash sales, and seasonal promotional campaigns"
            />

            <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
              {/* Flash Sale Toggle */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[rgba(251,184,58,0.05)] border-[rgba(251,184,58,0.2)]' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-black text-sm flex items-center gap-2 ${isDark ? 'text-[#FBB83A]' : 'text-amber-950'}`}>
                      <Zap className="w-4 h-4 text-amber-500" /> Global Flash Sale
                    </div>
                    <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-amber-800'}`}>Apply a platform-wide discount % on all products instantly</div>
                  </div>
                  <Toggle value={flashSaleActive} onChange={() => setFlashSaleActive(!flashSaleActive)} isDark={isDark} />
                </div>
                {flashSaleActive && (
                  <div className="space-y-2">
                    <label className={`font-black flex items-center justify-between ${isDark ? 'text-[#D4EAD9]' : 'text-amber-950'}`}>
                      Flash Discount <span className="px-3 py-1 bg-amber-500 text-white rounded-full font-black">{flashSalePercent}% OFF</span>
                    </label>
                    <input
                      type="range" min="5" max="50" step="5"
                      value={flashSalePercent}
                      onChange={e => setFlashSalePercent(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className={`flex justify-between text-[10px] font-bold ${isDark ? 'text-[#7FA882]' : 'text-amber-800'}`}>
                      <span>5%</span><span>25%</span><span>50%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Banners */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Campaign Banners</h4>
                  <button
                    type="button"
                    onClick={() => { if (showToast) showToast('Banner Created ✨', 'New promotional banner added. Configure details and go live.'); }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all ${
                      isDark ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85] border border-[rgba(0,255,133,0.3)]' : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> New Banner
                  </button>
                </div>
                {banners.map(banner => (
                  <div key={banner.id} className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                    banner.active 
                      ? isDark ? 'bg-[rgba(0,255,133,0.03)] border-[rgba(0,255,133,0.2)]' : 'bg-white border-emerald-200'
                      : isDark ? 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.06)]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-[rgba(0,255,133,0.1)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-700'}`}>
                        <Image className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-black ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{banner.title}</div>
                        <div className={`text-[10px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>
                          <span className={`px-2 py-0.5 rounded-full mr-1 ${isDark ? 'bg-[rgba(192,132,252,0.15)] text-[#C084FC]' : 'bg-purple-100 text-purple-800'}`}>{banner.type}</span>
                          {banner.startDate} → {banner.endDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        banner.active 
                          ? isDark ? 'bg-[rgba(0,255,133,0.15)] text-[#00FF85]' : 'bg-emerald-100 text-emerald-800'
                          : isDark ? 'bg-[rgba(255,255,255,0.05)] text-[#7FA882]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {banner.active ? 'Live' : 'Hidden'}
                      </span>
                      <Toggle value={banner.active} onChange={() => handleToggleBanner(banner.id)} isDark={isDark} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 8. SYSTEM MAINTENANCE MODE ══════════════ */}
        {activeSubTab === 'maintenance' && (
          <form onSubmit={handleSaveMaintenance} className="animate-fadeIn">
            <SectionHeader
              icon={Wrench}
              title="System Maintenance Mode"
              description="Toggle platform availability, schedule downtime, and set custom user-facing messages"
            />

            <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
              {/* Master Toggle */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                maintenanceMode 
                  ? isDark ? 'bg-[rgba(255,77,77,0.08)] border-[rgba(255,77,77,0.3)]' : 'bg-rose-50 border-rose-300'
                  : isDark ? 'bg-[rgba(0,255,133,0.04)] border-[rgba(0,255,133,0.2)]' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-black text-base flex items-center gap-2 ${
                      maintenanceMode 
                        ? isDark ? 'text-[#FF6B6B]' : 'text-rose-950'
                        : isDark ? 'text-[#00FF85]' : 'text-emerald-950'
                    }`}>
                      {maintenanceMode ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      {maintenanceMode ? '⚠️ Platform is in MAINTENANCE MODE' : '✅ Platform is LIVE & Operational'}
                    </div>
                    <div className={`text-[11px] font-bold mt-1 ${
                      maintenanceMode 
                        ? isDark ? 'text-[#FF6B6B]/80' : 'text-rose-800'
                        : isDark ? 'text-[#7FA882]' : 'text-emerald-800'
                    }`}>
                      {maintenanceMode
                        ? 'All non-admin users see the maintenance screen. Orders paused.'
                        : 'All users can place orders, browse products, and use all features.'}
                    </div>
                  </div>
                  <Toggle value={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} isDark={isDark} />
                </div>
              </div>

              {/* Maintenance Message */}
              <div>
                <label className={`font-black mb-1.5 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>User-Facing Maintenance Message</label>
                <textarea
                  rows={3}
                  value={maintenanceMsg}
                  onChange={e => setMaintenanceMsg(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-xs font-bold outline-none resize-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600 focus:bg-white'
                  }`}
                />
              </div>

              <div className="pt-2 text-right">
                <button 
                  type="submit" 
                  className={`px-8 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
                    maintenanceMode 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : isDark 
                        ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Maintenance Settings
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ══════════════ 9. FARM MARKETPLACE ══════════════ */}
        {activeSubTab === 'marketplace' && (
          <form onSubmit={handleSaveMarketplace} className="space-y-6 animate-fadeIn">
            <SectionHeader
              icon={Store}
              title="Farm Marketplace Configuration"
              description="Set store branding, delivery pricing, and regional hub locations"
            />
            <div className="p-6 sm:p-8 space-y-6 text-xs font-extrabold">
              <div>
                <label className={`font-black mb-1.5 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Store / Platform Name *</label>
                <input 
                  type="text" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  required 
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs font-black outline-none transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                      : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
                  }`} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`font-black mb-1.5 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Standard Delivery Fee (₹) *</label>
                  <input 
                    type="number" 
                    value={deliveryFee} 
                    onChange={(e) => setDeliveryFee(Number(e.target.value))} 
                    required 
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs font-black outline-none font-mono transition-all ${
                      isDark 
                        ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                        : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
                    }`} 
                  />
                </div>
                <div>
                  <label className={`font-black mb-1.5 block ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Minimum Order Amount (₹) *</label>
                  <input 
                    type="number" 
                    value={minOrder} 
                    onChange={(e) => setMinOrder(Number(e.target.value))} 
                    required 
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs font-black outline-none font-mono transition-all ${
                      isDark 
                        ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(0,255,133,0.15)] text-[#D4EAD9] focus:border-[#00FF85]' 
                        : 'bg-gray-50 border border-gray-200 text-farmGreen-950 focus:border-emerald-600'
                    }`} 
                  />
                </div>
              </div>
              <div className="pt-2 text-right">
                <button 
                  type="submit" 
                  className={`px-8 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Marketplace Settings
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ══════════════ 10. NOTIFICATIONS ══════════════ */}
        {activeSubTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 animate-fadeIn">
            <SectionHeader
              icon={Bell}
              title="System Alert Preferences"
              description="Control automated notifications for order dispatches, producer KYCs & regional stock"
            />
            <div className="p-6 sm:p-8 space-y-4 text-xs font-extrabold">
              {[
                { label: 'New Order Dispatch Alerts', desc: 'Receive real-time notifications when buyers place fresh produce orders', state: newOrderAlert, set: setNewOrderAlert },
                { label: 'Farmer Onboarding KYC Alerts', desc: 'Get instant alerts when a new agricultural producer submits verification documents', state: farmerRegAlert, set: setFarmerRegAlert },
                { label: 'Low Stock Inventory Warnings', desc: 'Trigger warning banner when farm inventory drops below 10 units', state: lowStockAlert, set: setLowStockAlert },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.set(!item.state)} 
                  className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.03)] hover:border-[rgba(0,255,133,0.2)]' 
                      : 'bg-gray-50/80 border-gray-200 hover:bg-emerald-50/50'
                  }`}
                >
                  <div>
                    <div className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>{item.label}</div>
                    <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>{item.desc}</div>
                  </div>
                  <Toggle value={item.state} onChange={() => item.set(!item.state)} isDark={isDark} />
                </div>
              ))}
              <div className="pt-2 text-right">
                <button 
                  type="submit" 
                  className={`px-8 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Notification Preferences
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ══════════════ 11. SECURITY ══════════════ */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="space-y-6 animate-fadeIn">
            <SectionHeader
              icon={Shield}
              title="Security & Active Session Controls"
              description="Configure multi-factor authentication & inspect active administrator sessions"
            />
            <div className="p-6 sm:p-8 space-y-5 text-xs font-extrabold">
              <div 
                onClick={() => setTwoFactorAuth(!twoFactorAuth)} 
                className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(0,255,133,0.08)] hover:bg-[rgba(0,255,133,0.03)]' 
                    : 'bg-gray-50/80 border-gray-200 hover:bg-emerald-50/50'
                }`}
              >
                <div>
                  <div className={`font-black text-sm ${isDark ? 'text-[#D4EAD9]' : 'text-farmGreen-950'}`}>Two-Factor Authentication (2FA)</div>
                  <div className={`text-[11px] font-bold mt-0.5 ${isDark ? 'text-[#7FA882]' : 'text-farmMuted'}`}>Require multi-factor authenticator code during admin account sign-in</div>
                </div>
                <Toggle value={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} isDark={isDark} />
              </div>
              <div className="pt-2 text-right">
                <button 
                  type="submit" 
                  className={`px-8 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ml-auto ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#00FF85] to-[#00CC6A] text-[#06090A] shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:brightness-110' 
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Security Controls
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ══════════════ 12. AUDIT LOG ══════════════ */}
        {activeSubTab === 'audit' && (
          <AuditLogTab
            auditFilter={auditFilter}
            setAuditFilter={setAuditFilter}
            auditActions={auditActions}
            filteredAudit={filteredAudit}
            showToast={showToast}
            SectionHeader={SectionHeader}
            isDark={isDark}
          />
        )}

      </div>
    </div>
  );
};

export default AdminSettings;
