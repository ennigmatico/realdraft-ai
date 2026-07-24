import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, ArrowRight, Lock, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onGoogleSignIn,
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedGoogleAuth = () => {
    setIsSimulatingGoogle(true);
    setTimeout(() => {
      onGoogleSignIn();
      setIsSimulatingGoogle(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Commercial Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
            G
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Lex-Gemini Legal AI
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Plataforma Inteligente de Auditoría de Contratos y Gestión de Riesgos Corporativos
          </p>
        </div>

        {user ? (
          /* User Profile Status if Already Logged In */
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-3">
            <img
              src={user.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto border-2 border-blue-600 shadow-xs"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.email}</p>
              <span className="inline-block mt-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase">
                ✓ Cuenta de Google Conectada
              </span>
            </div>

            <div className="pt-2 flex justify-center space-x-2">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Ir a la Plataforma
              </button>
            </div>
          </div>
        ) : (
          /* Auth Selector & Google Sign In Button */
          <div className="space-y-4">
            {/* Tab selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Crear Cuenta
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Acceder
              </button>
            </div>

            <p className="text-xs text-center text-slate-600 font-medium">
              {activeTab === 'signup'
                ? 'Regístrese gratis para auditar sus contratos con Inteligencia Artificial de Google'
                : 'Inicie sesión con su cuenta corporativa de Google para acceder a sus informes y contratos.'}
            </p>

            {/* Official Google Auth Action Button */}
            <button
              onClick={handleSimulatedGoogleAuth}
              disabled={isSimulatingGoogle}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-blue-500 rounded-xl font-bold text-slate-700 text-xs shadow-xs transition-all flex items-center justify-center space-x-3 cursor-pointer group relative"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span className="text-slate-800 font-bold group-hover:text-blue-700">
                {isSimulatingGoogle
                  ? 'Conectando con Google...'
                  : activeTab === 'signup'
                  ? 'Registrarse con Google Workspace'
                  : 'Continuar con Google Workspace'}
              </span>
            </button>

            {/* Features check list */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sin contraseñas: acceso instantáneo y seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sincronización automática con Google Drive & Docs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Privacidad garantizada y encriptación de datos</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              Al ingresar aceptas los Términos de Servicio Legales y la Política de Privacidad de Lex-Gemini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
