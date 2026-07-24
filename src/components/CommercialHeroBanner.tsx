import React from 'react';
import { Sparkles, ShieldCheck, FileCheck, ArrowRight, Zap } from 'lucide-react';

interface CommercialHeroBannerProps {
  onOpenSubscription: () => void;
  onOpenGoogleAuth: () => void;
  isConnected: boolean;
}

export const CommercialHeroBanner: React.FC<CommercialHeroBannerProps> = ({
  onOpenSubscription,
  onOpenGoogleAuth,
  isConnected,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border border-slate-800 shadow-sm relative overflow-hidden">
      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Minimalist Sub-Label */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-blue-300 text-[11px] font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Super Auditoría Legal & Inteligencia Contractual IA</span>
        </div>

        {/* Main Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          Auditoría de Contratos, Detección de Riesgos y Red Anónima de Estafas
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-2xl">
          Identifique cláusulas abusivas, indemnizaciones ocultas y desequilibrios contractuales en segundos con Inteligencia Artificial. Conexión directa a Google Docs y cifrado Bóveda AES-256.
        </p>

        {/* Key Features Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-800 p-2.5 rounded-lg text-slate-300">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">Análisis IA en Segundos</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-800 p-2.5 rounded-lg text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">Bóveda AES-256 Cifrada</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-800 p-2.5 rounded-lg text-slate-300">
            <FileCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-medium">Google Drive & Docs Sync</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {!isConnected && (
            <button
              onClick={onOpenGoogleAuth}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-lg shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Acceder con Google</span>
            </button>
          )}

          <button
            onClick={onOpenSubscription}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center space-x-2 cursor-pointer border border-blue-500/40"
          >
            <span>Planes y Tarifas Stripe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

