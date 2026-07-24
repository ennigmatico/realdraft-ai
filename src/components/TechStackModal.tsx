import React from 'react';
import { X, Cpu, ShieldCheck, FileSpreadsheet, Lock, Code2, Database, Layers, ExternalLink } from 'lucide-react';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechStackModal: React.FC<TechStackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stack = [
    {
      name: 'Gemini 3.6 Flash IA',
      category: 'Motor de Inteligencia Artificial',
      description: 'Análisis semántico profundo de cláusulas abusivas, cálculo de riesgos y estructuración JSON en español con @google/genai.',
      color: 'bg-blue-600 text-white',
      badge: 'Google AI Studio',
    },
    {
      name: 'Stripe Billing & Subscriptions',
      category: 'Pasarela de Pago & Suscripciones',
      description: 'Gestión de cobros recurrentes, pasarela de checkout con Stripe API SDK, Webhooks y gestión de clientes.',
      color: 'bg-indigo-600 text-white',
      badge: 'Stripe API v17',
    },
    {
      name: 'Google Workspace API',
      category: 'Integración Documental Directa',
      description: 'Lectura y exportación directa con Google Docs API & Google Drive API v3 mediante OAuth 2.0.',
      color: 'bg-emerald-600 text-white',
      badge: 'Google Drive & Docs',
    },
    {
      name: 'Bóveda Cifrada AES-256-GCM',
      category: 'Seguridad Criptográfica',
      description: 'Cifrado simétrico de alta seguridad autenticado con AuthTag de 128-bit, derivación PBKDF2 y checksum SHA-256.',
      color: 'bg-slate-800 text-white',
      badge: 'Node.js Crypto Native',
    },
    {
      name: 'React 19 & Vite 6',
      category: 'Frontend & UI Engine',
      description: 'Arquitectura SPA de alta densidad, compilación rápida con HMR e interfaz reactiva con Lucide Icons y Tailwind CSS.',
      color: 'bg-cyan-600 text-white',
      badge: 'React 19 / Vite',
    },
    {
      name: 'Express & Node.js ESM',
      category: 'Backend REST Service',
      description: 'Servidor full-stack en Cloud Run con proxy reverso, middleware de cookies seguras SameSite y bundler esbuild.',
      color: 'bg-slate-900 text-white',
      badge: 'Node.js 22 LTS',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight uppercase">
              Stack Tecnológico de Lex-Gemini
            </h3>
            <p className="text-xs text-slate-500">
              Arquitectura enterprise basada en servicios de Google, Stripe e infraestructura criptográfica.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stack.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${item.color}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 font-medium">
            <Code2 className="w-4 h-4 text-blue-700" />
            <span>Código 100% en TypeScript tipado con estándares legales de auditoría.</span>
          </div>
          <span className="text-[10px] font-bold text-blue-800 uppercase bg-blue-100 px-2 py-0.5 rounded">
            Cloud Run Ready
          </span>
        </div>
      </div>
    </div>
  );
};
