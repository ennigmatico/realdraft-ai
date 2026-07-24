import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Copy, AlertTriangle, X, ShieldCheck, ArrowRight, RefreshCw, User, Building2 } from 'lucide-react';
import { RedFlag, ClientProfile } from '../types';

interface ClauseFixOption {
  id: string;
  label: string;
  description: string;
  revisedText: string;
  keyChanges: string[];
}

interface ClauseFixModalProps {
  flag: RedFlag | null;
  contractTitle: string;
  clientProfile?: ClientProfile | null;
  onClose: () => void;
  onApplyCorrection: (flagId: string, correctedText: string) => void;
}

export const ClauseFixModal: React.FC<ClauseFixModalProps> = ({
  flag,
  contractTitle,
  clientProfile,
  onClose,
  onApplyCorrection,
}) => {
  const [options, setOptions] = useState<ClauseFixOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-1');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (flag) {
      fetchClauseFixes();
    }
  }, [flag]);

  const fetchClauseFixes = async () => {
    if (!flag) return;
    setLoading(true);
    try {
      const res = await fetch('/api/audit/suggest-clause-fixes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseTitle: flag.clauseTitle,
          originalText: flag.originalText,
          legalIssue: flag.legalIssue,
          clientName: clientProfile?.clientName || 'Cliente Corporativo',
          clientCompany: clientProfile?.clientName,
          clientIndustry: clientProfile?.industry,
          riskTolerance: 'Moderada / Protección Activa',
          clientNotes: clientProfile?.negotiationPreferences?.join('; ') || 'Prioriza tope de responsabilidad y fuero local.',
          contractTitle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.options && data.options.length > 0) {
          setOptions(data.options);
          setSelectedOptionId(data.options[0].id);
          setCustomText(data.options[0].revisedText);
        }
      }
    } catch (err) {
      console.error('Error loading clause fixes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!flag) return null;

  const handleSelectOption = (opt: ClauseFixOption) => {
    setSelectedOptionId(opt.id);
    setCustomText(opt.revisedText);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyCorrection(flag.id, customText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded uppercase tracking-wider">
                CORRECTOR IA INTEGRADO
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Redacción de Cláusula Adaptada al Perfil del Cliente
            </h3>
          </div>
        </div>

        {/* Client Profile Context Bar */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>
              Cliente: <strong className="text-white">{clientProfile?.clientName || 'Empresa Cliente'}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{clientProfile?.industry || 'Tecnología & Servicios'}</span>
          </div>
          <button
            onClick={fetchClauseFixes}
            disabled={loading}
            className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerar con IA</span>
          </button>
        </div>

        {/* Problematic Clause Preview */}
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1 text-xs">
          <div className="flex items-center space-x-1.5 text-rose-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Cláusula Actual: {flag.clauseTitle}</span>
          </div>
          <p className="font-mono text-slate-300 italic text-[11px] pl-5">
            "{flag.originalText}"
          </p>
          <p className="text-[11px] text-rose-300 pl-5">
            <strong>Riesgo:</strong> {flag.legalIssue}
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-slate-950 border border-slate-800 rounded-xl">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Gemini 3.6 Flash analizando perfiles y redactando 3 alternativas contractuales...
            </p>
          </div>
        ) : (
          /* Options Selection Tabs/Cards */
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Seleccione la opción de redacción deseada:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">
                        {opt.description}
                      </p>
                    </div>

                    {opt.keyChanges && opt.keyChanges.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        {opt.keyChanges.map((kc, idx) => (
                          <span key={idx} className="block text-[9px] font-mono text-blue-300/80">
                            • {kc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Editable Selected Clause Text */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Texto de la Cláusula a Aplicar (Personalizable):
                </label>
                <button
                  onClick={handleCopyText}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleApply}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer border border-blue-400/30"
          >
            <span>✓ Aplicar al Documento Corregido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
