import React from 'react';
import {
  Menu,
  ShieldCheck,
  Sparkles,
  FolderKanban,
  History,
  UserCheck,
  KeyRound,
  FileText,
  Bot,
  Mail,
} from 'lucide-react';
import { ScamNotification } from '../types';
import { NotificationBell } from './NotificationBell';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: 'audit' | 'docs' | 'history' | 'profile' | 'security' | 'gmail';
  notifications?: ScamNotification[];
  onSelectNotification?: (notif: ScamNotification) => void;
  onClearNotifications?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTab,
  notifications = [],
  onSelectNotification,
  onClearNotifications,
  onMarkAsRead,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'audit':
        return { label: 'Auditoría Legal IA & Corrector', icon: Sparkles, color: 'text-amber-400' };
      case 'docs':
        return { label: 'Google Docs, Drive & Picker API', icon: FolderKanban, color: 'text-blue-400' };
      case 'gmail':
        return { label: 'Gmail API & Correos de Contratos', icon: Mail, color: 'text-rose-400' };
      case 'history':
        return { label: 'Historial & Bóveda Cifrada', icon: History, color: 'text-indigo-400' };
      case 'profile':
        return { label: 'Perfil del Cliente', icon: UserCheck, color: 'text-emerald-400' };
      case 'security':
        return { label: 'Seguridad Bóveda AES-256', icon: KeyRound, color: 'text-emerald-400' };
      default:
        return { label: 'Auditoría Legal', icon: FileText, color: 'text-blue-400' };
    }
  };

  const currentTab = getTabTitle();
  const TabIcon = currentTab.icon;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md shrink-0">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left Side: Sidebar Toggle + Brand Identifier */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer focus:outline-none"
            title="Abrir / Cerrar Menú Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-900/40 ring-1 ring-white/20">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  RealDraft <span className="text-blue-400">AI</span>
                </h1>
                
                {/* Gemini System Badge */}
                <span className="text-[10px] font-mono font-extrabold uppercase bg-gradient-to-r from-blue-950 to-indigo-950 text-blue-300 border border-blue-700/70 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Bot className="w-3 h-3 text-blue-400 animate-pulse" />
                  <span>Sistema Gemini IA</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Powered by Google Gemini 3.6 Flash • Cifrado Bóveda AES-256
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Active View Pill + Notification Bell */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Active Tab Indicator Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-950/80 border border-slate-800/90 px-3 py-1.5 rounded-xl">
            <TabIcon className={`w-3.5 h-3.5 ${currentTab.color}`} />
            <span className="text-xs font-bold text-slate-200">{currentTab.label}</span>
          </div>

          {/* Verified Google Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verificado Google</span>
          </div>

          {/* Real-Time Scam Alerts Notification Bell */}
          <NotificationBell
            notifications={notifications}
            onSelectNotification={(notif) => onSelectNotification?.(notif)}
            onClearNotifications={() => onClearNotifications?.()}
            onMarkAsRead={(id) => onMarkAsRead?.(id)}
          />
        </div>
      </div>
    </header>
  );
};
