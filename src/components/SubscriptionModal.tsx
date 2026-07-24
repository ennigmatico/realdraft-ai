import React, { useState } from 'react';
import { X, Check, Sparkles, CreditCard, ShieldCheck, Zap, Lock, Building2, ExternalLink } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (planId: 'starter' | 'pro' | 'enterprise', interval: 'monthly' | 'yearly') => Promise<void>;
  isProcessing: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  isProcessing,
}) => {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Legal',
      tagline: 'Ideal para abogados independientes y profesionales',
      priceMonthly: 29,
      priceYearly: 24, // $288/year
      features: [
        'Hasta 10 auditorías de contratos al mes',
        'Cifrado en Bóveda AES-256-GCM',
        'Análisis de cláusulas abusivas e indemnización',
        'Sincronización con Google Drive',
        'Soporte por correo electrónico',
      ],
      badge: 'Básico',
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Despacho Pro',
      tagline: 'Para despachos jurídicos y firmas corporativas',
      priceMonthly: 89,
      priceYearly: 69, // $828/year
      features: [
        'Auditorías ilimitadas de contratos con Gemini 3.6',
        'Consultorio IA Legal en tiempo real (Chat del Contrato)',
        'Exportación directa a Google Docs con 1-Click',
        'Matriz de riesgo de proveedores y clientes',
        'Cifrado aislado por cliente con PBKDF2',
        'Soporte prioritario 24/7',
      ],
      badge: 'Más Popular',
      highlight: true,
    },
    {
      id: 'enterprise',
      name: 'Corporativo Enterprise',
      tagline: 'Para departamentos legales corporativos y multinacionales',
      priceMonthly: 249,
      priceYearly: 199,
      features: [
        'Todo lo de Despacho Pro incluido',
        'Múltiples usuarios y gestión de roles legales',
        'Reglas de negociación e IA personalizada por empresa',
        'Claves criptográficas dedicated (BYOK)',
        'API de integración para sistemas ERP / CRM',
        'Gerente de cuenta legal dedicado',
      ],
      badge: 'Empresarial',
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-xl max-w-4xl w-full p-6 shadow-2xl relative space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            <span>SUSCRIPCIÓN STRIPE BILLING</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Planes & Suscripciones Lex-Gemini</h2>
          <p className="text-xs text-slate-500">
            Elija el plan ideal para automatizar la auditoría de contratos con IA y Stripe Payment Gateway.
          </p>

          {/* Billing Interval Toggle */}
          <div className="pt-2 flex items-center justify-center space-x-3">
            <span className={`text-xs font-bold ${interval === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Facturación Mensual
            </span>
            <button
              onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-blue-600 rounded-full p-1 transition-colors cursor-pointer relative"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  interval === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1 ${interval === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Anual <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-black">-20% Ahorro</span>
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = currentPlan.toLowerCase().includes(plan.id);
            const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.id}
                className={`rounded-xl p-5 border transition-all flex flex-col justify-between relative ${
                  plan.highlight
                    ? 'bg-blue-900 text-white border-blue-700 shadow-lg scale-102'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs ${
                      plan.highlight ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className={`text-base font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-[11px] mt-1 font-medium ${plan.highlight ? 'text-blue-200' : 'text-slate-500'}`}>
                    {plan.tagline}
                  </p>

                  <div className="mt-4 mb-4">
                    <span className="text-3xl font-black">${price}</span>
                    <span className={`text-xs font-normal ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                      /mes {interval === 'yearly' && '(facturado anualmente)'}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.highlight ? 'text-emerald-300' : 'text-emerald-600'
                          }`}
                        />
                        <span className={`leading-tight ${plan.highlight ? 'text-blue-100' : 'text-slate-700'}`}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(plan.id as any, interval)}
                  disabled={isProcessing || isCurrent}
                  className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white cursor-default'
                      : plan.highlight
                      ? 'bg-white text-blue-900 hover:bg-blue-50 shadow-md font-extrabold'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  } disabled:opacity-60`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isCurrent
                      ? 'Plan Actual Activo'
                      : isProcessing
                      ? 'Procesando Stripe...'
                      : `Suscribirse con Stripe ($${price})`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Security Footer Note */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pagos procesados de forma 100% segura mediante **Stripe Elements & Webhooks**.</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-500">
            <span>Cifrado SSL 256-bit</span>
            <span>•</span>
            <span>Cancelación en cualquier momento</span>
          </div>
        </div>
      </div>
    </div>
  );
};
