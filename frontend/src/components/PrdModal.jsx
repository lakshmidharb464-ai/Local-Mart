import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRD_DATA } from '../data/prdContent';
import { X, CheckCircle, FileCode2, Layers, Users, Zap, Shield, Tractor, Truck, UserCheck } from 'lucide-react';

export const PrdModal = () => {
  const { isPrdOpen, setIsPrdOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isPrdOpen) return null;

  const roleIcons = {
    Customer: UserCheck,
    Farmer: Tractor,
    Delivery: Truck,
    Admin: Shield
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-farmGreen-900/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsPrdOpen(false)}
      />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-farm-xl shadow-farm-xl overflow-hidden border border-farmGreen-100 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-farmGreen-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-farmGreen-700 flex items-center justify-center text-farmOrange-400">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{PRD_DATA.title}</h3>
              <p className="text-xs text-white/70">Connected Specification & Requirements Spec (v{PRD_DATA.version})</p>
            </div>
          </div>

          <button
            onClick={() => setIsPrdOpen(false)}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-farmGreen-100 bg-farmBg px-6 pt-3 gap-4 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: '1. Overview & Solution', icon: Layers },
            { id: 'roles', label: '2. User Roles & Modules', icon: Users },
            { id: 'tech', label: '3. Tech Stack & Compliance', icon: Zap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-xs font-bold font-display border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-farmGreen-700 text-farmGreen-800'
                    : 'border-transparent text-farmMuted hover:text-farmGreen-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-farmText">
          
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-farmGreen-50 p-4 rounded-farm-md border border-farmGreen-100">
                <h4 className="font-display font-bold text-base text-farmGreen-900 mb-1">Proposed Solution Statement</h4>
                <p className="text-xs text-farmMuted leading-relaxed">{PRD_DATA.proposedSolution}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50/60 p-4 rounded-farm-md border border-red-100 space-y-3">
                  <h5 className="font-display font-bold text-xs text-red-800 uppercase tracking-wider">
                    Current Problems for Farmers
                  </h5>
                  <ul className="space-y-2 text-xs text-red-900/80">
                    {PRD_DATA.problemStatement.farmers.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50/60 p-4 rounded-farm-md border border-orange-100 space-y-3">
                  <h5 className="font-display font-bold text-xs text-orange-800 uppercase tracking-wider">
                    Current Problems for Customers
                  </h5>
                  <ul className="space-y-2 text-xs text-orange-900/80">
                    {PRD_DATA.problemStatement.customers.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {PRD_DATA.roles.map((r, idx) => {
                const Icon = roleIcons[r.key] || Users;
                return (
                  <div key={idx} className="bg-white border border-farmGreen-100 p-4 rounded-farm-md shadow-farm-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-farmGreen-100 text-farmGreen-700 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-farmGreen-900">{r.role} Role</h4>
                        <p className="text-[11px] text-farmMuted">{r.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-farmGreen-800">Implemented Modules</div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.features.map((feat, fIdx) => (
                          <span key={fIdx} className="bg-farmGreen-50 text-farmGreen-800 text-[10px] px-2 py-0.5 rounded-full font-medium border border-farmGreen-100">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-farmBg p-5 rounded-farm-md border border-farmGreen-100 space-y-3">
                <h4 className="font-display font-bold text-sm text-farmGreen-900">Technical Architecture Overview</h4>
                <p className="text-xs text-farmMuted">{PRD_DATA.techStack.architecture}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-farm-md border border-farmGreen-100 space-y-2">
                  <h5 className="font-display font-bold text-xs text-farmGreen-900 uppercase">Frontend Requirements</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {PRD_DATA.techStack.frontend.map((item, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-farm-md border border-farmGreen-100 space-y-2">
                  <h5 className="font-display font-bold text-xs text-farmGreen-900 uppercase">Backend & Database</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {PRD_DATA.techStack.backend.map((item, i) => (
                      <span key={i} className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-lg font-medium border border-blue-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-farm-md border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>All functional requirements connected dynamically in the React + Tailwind frontend application.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-farmBg border-t border-farmGreen-100 text-right shrink-0">
          <button
            onClick={() => setIsPrdOpen(false)}
            className="px-5 py-2 bg-farmGreen-700 text-white rounded-full text-xs font-semibold font-display hover:bg-farmGreen-800 transition-all"
          >
            Close Specification
          </button>
        </div>

      </div>
    </div>
  );
};
