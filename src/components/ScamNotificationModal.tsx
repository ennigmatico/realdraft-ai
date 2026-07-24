import React, { useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ExternalLink, X, Lock } from 'lucide-react';
import { ScamNotification } from '../types';

interface ScamNotificationModalProps {
  notification: ScamNotification | null;
  onClose: () => void;
  onViewReport?: () => void;
}

export const ScamNotificationModal: React.FC<ScamNotificationModalProps> = ({
  notification,
  onClose,
  onViewReport,
}) => {
  useEffect(() => {
    if (notification) {
      // Play a subtle Web Audio API alert sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // AudioContext disabled or restricted, fail silently
      }
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-600/80 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded uppercase tracking-wider">
                ⚡ TIEMPO REAL • ALERTA DE COINCIDENCIA
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              ¡Alerta de Patrón de Estafa Detectado!
            </h3>
          </div>
        </div>

        {/* Notification Body */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Contrato Analizado:
            </span>
            <p className="text-sm font-bold text-white tracking-wide">
              {notification.contractTitle}
            </p>
          </div>

          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Coincidencias en Servidor:
              </span>
              <span className="text-xs font-mono font-extrabold bg-rose-900 text-rose-100 px-2 py-0.5 rounded border border-rose-700">
                {notification.scamMatchesCount} firma(s) coincidente(s)
              </span>
            </div>

            <p className="text-xs text-rose-200 leading-relaxed">
              {notification.summaryText}
            </p>

            {notification.matchingCategories && notification.matchingCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {notification.matchingCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-rose-900/90 text-rose-200 border border-rose-700 px-2 py-0.5 rounded font-mono font-bold uppercase"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-start space-x-2 text-[11px] text-slate-400 pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Protección Criptográfica Privada:</strong> La verificación se realizó derivando huellas SHA-256 anónimas. Ningún texto de su contrato ni identidad fue expuesta.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Entendido / Ignorar
          </button>

          {onViewReport && (
            <button
              onClick={() => {
                onViewReport();
                onClose();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer border border-rose-400/30"
            >
              <span>Ver Informe y Cláusulas Detalladas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
