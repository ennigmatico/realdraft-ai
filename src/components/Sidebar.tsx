import React from 'react';
import {
  Sparkles,
  FolderKanban,
  History,
  UserCheck,
  KeyRound,
  CreditCard,
  Cpu,
  Lock,
  LogOut,
  ShieldCheck,
  FileText,
  X,
  ChevronRight,
  ExternalLink,
  Bot,
  Mail,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: 'audit' | 'docs' | 'history' | 'profile' | 'security' | 'gmail';
  setActiveTab: (tab: 'audit' | 'docs' | 'history' | 'profile' | 'security' | 'gmail') => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  user: UserProfile | null;
  onConnectGoogle: () => void;
  onLogout: () => void;
  onOpenSecurity: () => void;
  onOpenSubscription: () => void;
  onOpenTechStack: () => void;
  currentPlanName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  user,
  onConnectGoogle,
  onLogout,
  onOpenSecurity,
  onOpenSubscription,
  onOpenTechStack,
  currentPlanName = 'Despacho Pro',
}) => {
  const navItems = [
    {
      id: 'audit' as const,
      label: 'Auditoría IA & Corrector',
      description: 'Análisis de contratos y corrección',
      icon: Sparkles,
      accent: 'text-amber-400',
    },
    {
      id: 'docs' as const,
      label: 'Google Docs & Picker API',
      description: 'Gestor de archivos e integración',
      icon: FolderKanban,
      accent: 'text-blue-400',
    },
    {
      id: 'gmail' as const,
      label: 'Gmail & Correos',
      description: 'Contratos y reportes por Gmail',
      icon: Mail,
      accent: 'text-rose-400',
    },
    {
      id: 'history' as const,
      label: 'Historial & Bóveda',
      description: 'Registros cifrados en AES-256',
      icon: History,
      accent: 'text-indigo-400',
    },
    {
      id: 'profile' as const,
      label: 'Perfil del Cliente',
      description: 'Datos e historial de negociación',
      icon: UserCheck,
      accent: 'text-emerald-400',
    },
    {
      id: 'security' as const,
      label: 'Seguridad Bóveda',
      description: 'Llaves, firmas y cumplimiento',
      icon: KeyRound,
      accent: 'text-emerald-400',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Upper Sidebar Scrollable Content */}
        <div className="p-4 space-y-6 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-900/40 border border-white/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  RealDraft <span className="text-blue-400">AI</span>
                </h1>
                <p className="text-[10px] text-blue-300 font-mono font-bold flex items-center gap-1">
                  <Bot className="w-3 h-3 text-blue-400" />
                  <span>Google Gemini System</span>
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
              Módulos Principales
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60 border border-blue-400/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isActive ? 'text-white' : item.accent
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                    </div>
                    <p
                      className={`text-[10px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* System Tools & Subscriptions Section */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
              Gestión & Suscripción
            </span>

            {/* Stripe Subscription card */}
            <button
              onClick={() => {
                onOpenSubscription();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-300 block">{currentPlanName}</span>
                  <span className="text-[10px] text-slate-400">Planes e Historial Stripe</span>
                </div>
              </div>
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                PRO
              </span>
            </button>

            {/* Tech Stack card */}
            <button
              onClick={() => {
                onOpenTechStack();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Stack Tecnológico</span>
                  <span className="text-[10px] text-slate-400">Gemini 3.6 • Express • Vite</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </button>

            {/* Vault Security trigger */}
            <button
              onClick={() => {
                onOpenSecurity();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Estado Bóveda</span>
                  <span className="text-[10px] text-emerald-400 font-mono">AES-256-GCM Activo</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Lower Sidebar Footer & Google User Card */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3 shrink-0">
          {user?.isWorkspaceConnected ? (
            <div className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center space-x-2.5 min-w-0">
                <img
                  src={user.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-blue-400 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 block truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 truncate block">{user.email}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Cerrar Sesión Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectGoogle}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-blue-400/30"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
              </svg>
              <span>Conectar Google Workspace</span>
            </button>
          )}

          <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verificado por Sistemas Seguros Google</span>
          </div>
        </div>
      </aside>
    </>
  );
};
