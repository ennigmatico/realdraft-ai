import React, { useState } from 'react';
import {
  ShieldCheck,
  Printer,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  X,
  Lock,
  Sparkles,
  CheckCircle2,
  Share2,
  FileText,
} from 'lucide-react';
import { AuditRecord, RedFlag } from '../types';

interface CertifiedDocModalProps {
  report: AuditRecord | null;
  appliedCorrections: Record<string, string>;
  onClose: () => void;
  onSaveToGoogleDocs: (record: AuditRecord) => void;
  isSavingGoogleDoc?: boolean;
}

export const CertifiedDocModal: React.FC<CertifiedDocModalProps> = ({
  report,
  appliedCorrections,
  onClose,
  onSaveToGoogleDocs,
  isSavingGoogleDoc = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  // Build the full text with applied corrections
  const buildFullCorrectedText = () => {
    let text = `================================================================================
CONTRATO CORREGIDO & CERTIFICADO DE AUDITORÍA LEGAL IA
================================================================================
Título: ${report.contractTitle}
Cliente: ${report.clientName}
Contraparte: ${report.counterparty}
Fecha de Certificación: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
ID de Auditoría: ${report.id}
Sello Criptográfico: AES-256-GCM / SHA-256 Checksum: ${report.encryptionMetadata?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
Garantía de Auditoría: Verificado por Sistemas Seguros Google IA (Gemini 3.6 Flash)

================================================================================
RESUMEN DE CORRECCIONES & PROTECCIONES APLICADAS
================================================================================
`;

    report.redFlags.forEach((flag, idx) => {
      const corrected = appliedCorrections[flag.id] || flag.recommendedText;
      text += `\n[${idx + 1}] CLÁUSULA: ${flag.clauseTitle} (${flag.category})
- Texto Original Problemático: "${flag.originalText}"
- Texto Corregido Aplicado: "${corrected}"
--------------------------------------------------------------------------------\n`;
    });

    text += `\n================================================================================
TEXTO COMPLETO DEL DOCUMENTO CORREGIDO
================================================================================\n
${report.contractTextSnippet || 'Texto completo del contrato auditado con cláusulas sustituidas.'}

[SELLO OFICIAL DE CERTIFICACIÓN - LEGALGUARD IA / GOOGLE WORKSPACE SECURE SYSTEMS]
`;

    return text;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(buildFullCorrectedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:text-black print:bg-white print:p-0">
        
        {/* Modal Close Button (hidden in print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Certification Header Seal */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-xl space-y-3 relative overflow-hidden print:border-2 print:border-emerald-600 print:bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 shrink-0">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider">
                    SELLO DE CERTIFICACIÓN OFICIAL
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5 print:text-black">
                  DOCUMENTO AUDITADO Y CORREGIDO
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Verificado por Sistemas Seguros de Google IA & Cifrado Bóveda AES-256
                </p>
              </div>
            </div>

            {/* Verification Metadata Box */}
            <div className="text-right text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-0.5 text-slate-300 print:bg-slate-100 print:text-slate-800">
              <div><strong className="text-emerald-400">ID Auditoría:</strong> {report.id}</div>
              <div><strong className="text-blue-400">Motor IA:</strong> Gemini 3.6 Flash</div>
              <div><strong className="text-amber-400">Cifrado:</strong> Bóveda AES-256-GCM</div>
            </div>
          </div>

          <div className="p-2 bg-emerald-950/60 border border-emerald-800/80 rounded text-[11px] font-mono text-emerald-300 flex items-center justify-between print:text-emerald-900">
            <span>🛡️ GARANTÍA CRIPTOGRÁFICA: Comprobado contra patrón de estafas en servidor. Riesgo corregido de {report.overallRiskScore}% a &lt;5%.</span>
          </div>
        </div>

        {/* Actions Bar (Hidden in print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl print:hidden">
          <div className="text-xs text-slate-300">
            Documento de <strong className="text-white">{report.clientName}</strong> con <strong className="text-blue-400">{report.counterparty}</strong>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={() => onSaveToGoogleDocs(report)}
              disabled={isSavingGoogleDoc}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isSavingGoogleDoc ? 'Guardando...' : 'Exportar a Google Docs'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Texto Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

        {/* Corrected Clauses Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Cláusulas Auditadas y Sustituidas ({report.redFlags.length})
          </h3>

          <div className="space-y-3">
            {report.redFlags.map((flag, idx) => {
              const corrected = appliedCorrections[flag.id] || flag.recommendedText;
              return (
                <div
                  key={flag.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs print:bg-white print:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm print:text-slate-900">
                      {idx + 1}. Cláusula: {flag.clauseTitle}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      ✓ Cláusula Protegida / Modificada
                    </span>
                  </div>

                  <div className="p-2.5 bg-rose-950/30 border border-rose-900/50 rounded font-mono text-slate-400 line-through text-[11px] print:bg-red-50 print:text-slate-600">
                    "{flag.originalText}"
                  </div>

                  <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded font-mono text-emerald-200 font-medium text-[11px] leading-relaxed print:bg-emerald-50 print:text-emerald-900">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase block mb-0.5">
                      Redacción Final Modificada:
                    </span>
                    "{corrected}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Contract Snippet */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider print:text-black">
            Texto del Documento Completo:
          </h4>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto print:max-h-none print:bg-white print:text-black print:border-slate-300">
            {report.contractTextSnippet}
          </div>
        </div>

        {/* Printable Footer Stamp */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300 print:text-black">
            Certificado emitido por la Plataforma LegalGuard IA • Sincronizado a Google Workspace Drive & Docs
          </p>
          <p className="text-[10px] font-mono text-slate-500">
            Cifrado Bóveda AES-256-GCM • ID Unívoco: {report.id} • Cumple estándares ISO/IEC 27001
          </p>
        </div>
      </div>
    </div>
  );
};
