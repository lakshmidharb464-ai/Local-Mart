import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Save, Camera, Sparkles } from 'lucide-react';

export const Profile = ({
  initialData = {},
  userRole = 'Customer',
  onSave,
  showToast
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [altPhone, setAltPhone] = useState(initialData.altPhone || '');
  const [avatar, setAvatar] = useState(initialData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  const nameLabel = t('fullName', 'Full Name');
  const emailLabel = t('email', 'Email Address');
  const phoneLabel = t('phone', 'Mobile Phone Number');
  const altPhoneLabel = t('altPhone', 'Alternate Contact Number');
  const saveLabel = t('saveProfile', 'Save Profile Info');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      if (showToast) {
        showToast('Avatar Updated ✨', 'New profile photo updated.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({ name, email, phone, altPhone, avatar });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold animate-fadeIn">
      {/* Photo Avatar Upload Box */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 rounded-3xl border border-emerald-100/90 shadow-sm flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative group shrink-0">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover ring-4 ring-emerald-400/80 shadow-md transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <label className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg">
            <Camera className="w-5 h-5 mb-1 text-amber-300 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-wider">Upload</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1 relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-sm text-farmGreen-950">{userRole} Profile Identity</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-farmMuted text-[11px] font-medium leading-relaxed">
            Displayed across your account profile, order invoices, and service dispatch screens.
          </p>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="font-extrabold text-farmGreen-950 mb-1.5 block">{nameLabel}</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950 shadow-2xs"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="font-extrabold text-farmGreen-950 mb-1.5 block">{emailLabel}</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950 shadow-2xs"
              required
            />
          </div>
        </div>

        {/* Mobile Phone Number */}
        {userRole !== 'Admin' && (
          <div className={userRole === 'Farmer' ? 'sm:col-span-1' : 'sm:col-span-2'}>
            <label className="font-extrabold text-farmGreen-950 mb-1.5 block">{phoneLabel}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950 shadow-2xs"
                required
              />
            </div>
          </div>
        )}

        {/* Alternate Contact Number (Farmer Only) */}
        {userRole === 'Farmer' && (
          <div>
            <label className="font-extrabold text-farmGreen-950 mb-1.5 block">{altPhoneLabel}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-2xl outline-none font-bold text-xs transition-all text-farmGreen-950 shadow-2xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-3 flex justify-end border-t border-gray-100">
        <button
          type="submit"
          className="group px-7 py-3 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-display font-extrabold text-xs shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-amber-300 group-hover:rotate-6 transition-transform" />
          <span>{saveLabel}</span>
        </button>
      </div>
    </form>
  );
};

