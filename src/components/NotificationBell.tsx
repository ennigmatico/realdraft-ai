import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, Check, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { ScamNotification } from '../types';

interface NotificationBellProps {
  notifications: ScamNotification[];
  onSelectNotification: (notif: ScamNotification) => void;
  onClearNotifications: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onSelectNotification,
  onClearNotifications,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors cursor-pointer"
        title="Alertas de Estafa en Tiempo Real"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-300'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-white overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-white tracking-wide">
                Alertas de Estafa (Tiempo Real)
              </h4>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-300 flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                <p>Sin alertas de estafa recientes.</p>
                <p className="text-[10px] text-slate-500">
                  Cualquier coincidencia con la red anónima del servidor aparecerá aquí en tiempo real.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onSelectNotification(notif);
                    setIsOpen(false);
                  }}
                  className={`p-3 hover:bg-slate-800/80 transition-colors cursor-pointer space-y-1.5 ${
                    !notif.read ? 'bg-rose-950/30 border-l-2 border-rose-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-100 line-clamp-1">
                      {notif.contractTitle}
                    </span>
                    <span className="text-[9px] text-slate-400 shrink-0 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-300 leading-snug">
                    ⚠️ {notif.summaryText}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <span className="font-mono text-slate-400">
                      {notif.scamMatchesCount} coincidencia(s) SHA-256
                    </span>
                    <span className="text-blue-400 font-semibold hover:underline flex items-center space-x-0.5">
                      <span>Ver detalle</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 text-center font-mono">
            🔒 Red Anónima Cifrada • Cero datos privados compartidos
          </div>
        </div>
      )}
    </div>
  );
};
