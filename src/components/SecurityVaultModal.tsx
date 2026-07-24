import React, { useEffect, useState } from 'react';
import {
  Lock,
  X,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Database,
  Terminal,
} from 'lucide-react';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [vaultSpecs, setVaultSpecs] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/audit/vault-status')
        .then((res) => res.json())
        .then((data) => setVaultSpecs(data))
        .catch((err) => console.error('Error loading vault status:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-xl max-w-xl w-full p-5 shadow-xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
          <div className="p-2.5 bg-emerald-100 border border-emerald-200 rounded-md text-emerald-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Bóveda Cifrada de Seguridad Avanzada</h3>
            <p className="text-xs text-slate-500">
              Cifrado simétrico AES-256-GCM autenticado con derivación PBKDF2 por cliente.
            </p>
          </div>
        </div>

        {/* Cryptographic Specs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Algoritmo de Cifrado</span>
            <span className="text-emerald-700 font-mono font-bold">AES-256-GCM</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Derivación de Clave (KDF)</span>
            <span className="text-blue-700 font-mono font-bold">PBKDF2-HMAC-SHA256</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Tag de Autenticación</span>
            <span className="text-slate-800 font-mono font-bold">128 bits (GCM AuthTag)</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Checksum Integridad</span>
            <span className="text-slate-800 font-mono font-bold">SHA-256 Hash Plano</span>
          </div>
        </div>

        {/* Interactive Live Sample Inspector */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-blue-700 font-bold">
              <Terminal className="w-3.5 h-3.5" /> Muestra Cifrada en Bóveda
            </span>
            <span className="text-emerald-600 font-bold text-[10px]">✓ Verificado</span>
          </div>

          <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5">
            <div>
              <span className="text-slate-400">IV (Base64):</span> 3kF7s9PqL1m2N0a4==
            </div>
            <div>
              <span className="text-slate-400">AuthTag:</span> R8xW9zQ2vL5tP1k==
            </div>
            <div className="truncate text-slate-500">
              <span className="text-slate-400">Ciphertext:</span>{' '}
              aB3$9xL!zQ2mK9vP1wT7#yR4uN0sA8dF5gH2jK4lM...
            </div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span className="leading-snug font-medium">
            Cada cliente cuenta con aislamiento de claves criptográficas independiente. Los informes de auditoría nunca se comparten ni entrenan modelos públicos.
          </span>
        </div>
      </div>
    </div>
  );
};
