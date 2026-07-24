import React from 'react';
import {
  UserCheck,
  Building2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  TrendingDown,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { ClientProfile } from '../types';

interface ClientProfileViewProps {
  profile: ClientProfile;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ profile }) => {
  const vendorList = Object.entries(profile.vendorRiskMap || {}) as [
    string,
    { auditCount: number; avgRisk: number; lastAudited: string }
  ][];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{profile.clientName}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  {profile.industry || 'Empresa Corporativa'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perfil de Situación Contractual Inteligente • ID: {profile.clientId}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Última Actualización:{' '}
            <strong className="text-slate-800">
              {new Date(profile.lastUpdated).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </strong>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Contratos Auditados
            </span>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">
              {profile.totalContractsAudited}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Promedio de Riesgo Registrado
            </span>
            <div
              className={`text-xl font-extrabold mt-0.5 ${
                profile.averageRiskScore >= 60 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {profile.averageRiskScore}%
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Categorías Vulnerables
            </span>
            <div className="text-xs text-blue-800 font-bold mt-1 flex flex-wrap gap-1">
              {profile.frequentRiskCategories?.length > 0 ? (
                profile.frequentRiskCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-1.5 py-0.5 bg-blue-100 border border-blue-200 text-blue-800 rounded text-[10px]"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs font-normal">Ninguna registrada</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Risk Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider border-l-4 border-blue-600 pl-2.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Matriz de Riesgo de Proveedores & Contrapartes</span>
          </h3>

          {vendorList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No hay proveedores analizados aún para este cliente.
            </p>
          ) : (
            <div className="space-y-2">
              {vendorList.map(([vendorName, vData]) => {
                const isHighRisk = vData.avgRisk >= 60;
                return (
                  <div
                    key={vendorName}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{vendorName}</h4>
                      <p className="text-[10px] text-slate-500">
                        {vData.auditCount} auditoría(s) realizada(s)
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isHighRisk
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {vData.avgRisk}% Riesgo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Negotiation Preferences & Strategy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider border-l-4 border-indigo-600 pl-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Preferencias de Negociación Adaptativas</span>
          </h3>

          <p className="text-xs text-slate-500">
            Reglas de protección aplicadas automáticamente por el motor de auditoría para este cliente:
          </p>

          <div className="space-y-2">
            {profile.negotiationPreferences?.map((pref, index) => (
              <div
                key={index}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-xs text-slate-700 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pref}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
