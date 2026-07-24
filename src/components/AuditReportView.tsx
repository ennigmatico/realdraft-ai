import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Copy,
  Check,
  FileSpreadsheet,
  Download,
  Share2,
  TrendingUp,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Wand2,
  Printer,
} from 'lucide-react';
import { AuditRecord, RedFlag, RiskLevel } from '../types';

import { ContractQAChat } from './ContractQAChat';
import { generateAuditPdf } from '../utils/pdfGenerator';
import { ClauseFixModal } from './ClauseFixModal';
import { CertifiedDocModal } from './CertifiedDocModal';

interface AuditReportViewProps {
  report: AuditRecord;
  onSaveToGoogleDocs: (record: AuditRecord) => void;
  isSavingGoogleDoc?: boolean;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({
  report,
  onSaveToGoogleDocs,
  isSavingGoogleDoc = false,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(
    report.redFlags.length > 0 ? report.redFlags[0].id : null
  );

  const [reportedFlagIds, setReportedFlagIds] = useState<Record<string, boolean>>({});

  // Clause Corrector & Certified Document States
  const [activeFixFlag, setActiveFixFlag] = useState<RedFlag | null>(null);
  const [appliedCorrections, setAppliedCorrections] = useState<Record<string, string>>({});
  const [isCertifiedModalOpen, setIsCertifiedModalOpen] = useState(false);

  const handleApplyCorrection = (flagId: string, correctedText: string) => {
    setAppliedCorrections((prev) => ({
      ...prev,
      [flagId]: correctedText,
    }));
  };

  const handleReportScamAlert = async (flag: RedFlag) => {
    try {
      const res = await fetch('/api/audit/report-scam-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseTitle: flag.clauseTitle,
          clauseText: flag.originalText,
          scamCategory: flag.category,
          userDescription: flag.legalIssue,
        }),
      });

      if (res.ok) {
        setReportedFlagIds((prev) => ({ ...prev, [flag.id]: true }));
      }
    } catch (err) {
      console.error('Error reporting scam alert:', err);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', badge: 'bg-rose-500 text-white' };
    if (score >= 50) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500 text-slate-900' };
    if (score >= 25) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500 text-slate-900' };
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500 text-white' };
  };

  const getLevelBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 rounded-md">CRÍTICO / LEONINO</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800 rounded-md">ALTO RIESGO</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-950 text-yellow-300 border border-yellow-800 rounded-md">RIESGO MODERADO</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-md">OBSERVACIÓN</span>;
    }
  };

  const handleCopyClause = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySummary = () => {
    const text = `INFORME DE AUDITORÍA LEGAL ENCRIPTADO - LEGALGUARD AI
Contrato: ${report.contractTitle}
Cliente: ${report.clientName}
Contraparte: ${report.counterparty}
Nivel de Riesgo: ${report.overallRiskScore}% (${report.overallSafetyRating})

RESUMEN EJECUTIVO:
${report.executiveSummary}

CLÁUSULAS CON RIESGO CRÍTICO (${report.redFlags.length}):
${report.redFlags
  .map(
    (rf, i) =>
      `${i + 1}. [${rf.category}] ${rf.clauseTitle}\n   Problema: ${rf.legalIssue}\n   Recomendación: ${rf.recommendedText}\n`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const riskStyle = getRiskColor(report.overallRiskScore);

  const filteredFlags =
    selectedCategoryFilter === 'ALL'
      ? report.redFlags
      : report.redFlags.filter((f) => f.category === selectedCategoryFilter);

  const categoriesList = Array.from(new Set(report.redFlags.map((f) => f.category)));

  return (
    <div className="space-y-6 text-slate-800">
      {/* Active Doc Header */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">
            <span>AUDITORÍA LEGAL</span> / <span>CONTRATOS</span> / <span className="text-blue-600">{report.contractTitle.toUpperCase()}</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{report.contractTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Cliente: <strong className="text-slate-800">{report.clientName}</strong> • Contraparte: <strong className="text-blue-700">{report.counterparty}</strong> • Analizado mediante Gemini 3.6 Flash
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puntaje de Riesgo</p>
            <p className={`text-3xl font-black ${report.overallRiskScore >= 50 ? 'text-orange-600' : 'text-emerald-600'}`}>
              {report.overallRiskScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsCertifiedModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-md shadow-md transition-all cursor-pointer border border-emerald-400/40"
              title="Abre la vista previa del documento corregido listo para imprimir o guardar con Sello de Certificación Criptográfica Google IA"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Entregar Doc Corregido & Certificado</span>
            </button>

            <button
              onClick={() => generateAuditPdf(report)}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-sm transition-all cursor-pointer border border-slate-700"
              title="Descargar informe completo de auditoría en formato PDF con metadatos cifrados"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => onSaveToGoogleDocs(report)}
              disabled={isSavingGoogleDoc}
              className="flex items-center space-x-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isSavingGoogleDoc ? 'Guardando...' : 'Exportar Google Docs'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-300 transition-colors cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? '¡Copiado!' : 'Copiar Resumen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (8 cols): Key Red Flags & Context */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">

          {/* Anonymous Fraud Match Warning Banner if community matches detected */}
          {(report.communityScamMatchesCount || 0) > 0 && (
            <div className="p-4 bg-gradient-to-r from-red-900 to-rose-950 text-white rounded-xl border border-rose-700 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                  <span className="font-bold text-xs uppercase tracking-wider text-rose-200">
                    🛡️ Alerta Colectiva de Fraude / Pattern Scam Match
                  </span>
                </div>
                <span className="text-[10px] bg-rose-800 text-rose-100 font-mono font-bold px-2 py-0.5 rounded border border-rose-600">
                  SHA-256 Coincidencia Servidor
                </span>
              </div>
              <p className="text-xs text-rose-100 leading-relaxed">
                El motor del servidor detectó <strong>{report.communityScamMatchesCount} coincidencia(s) de patrones fraudulentos</strong> previamente registrados por otros usuarios de la red.
              </p>
              <div className="p-2.5 bg-black/40 rounded border border-rose-800 text-[11px] font-mono text-rose-200 flex items-center justify-between">
                <span>🔒 Aislamiento 100% Privado: Ningún dato de cliente ni texto de contrato fue compartido. La comparación se realiza comparando huellas criptográficas.</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hallazgos Críticos & Cláusulas Abusivas ({report.redFlags.length})
            </h3>
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Red Flag Cards */}
          {filteredFlags.map((flag) => {
            const isExpanded = expandedFlagId === flag.id;
            const isCritical = flag.riskLevel === 'CRITICAL';
            const isHigh = flag.riskLevel === 'HIGH';

            return (
              <div
                key={flag.id}
                className={`rounded-lg p-4 border transition-all ${
                  isCritical
                    ? 'bg-red-50 border-red-200'
                    : isHigh
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  onClick={() => setExpandedFlagId(isExpanded ? null : flag.id)}
                  className="flex justify-between items-start cursor-pointer select-none"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                        {flag.category}
                      </span>
                      {getLevelBadge(flag.riskLevel)}
                      {flag.isScamMatch && (
                        <span className="text-[10px] bg-rose-900 text-rose-200 border border-rose-700 px-2 py-0.5 rounded font-bold uppercase flex items-center space-x-1">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>Coincidencia de Estafa ({flag.scamAlertDetails?.totalCommunityMatches || 1}x en Servidor)</span>
                        </span>
                      )}
                    </div>
                    <h4
                      className={`font-bold text-sm ${
                        isCritical ? 'text-red-900' : isHigh ? 'text-orange-900' : 'text-slate-800'
                      }`}
                    >
                      {flag.clauseTitle}
                    </h4>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p
                  className={`text-xs mt-1.5 leading-relaxed font-medium ${
                    isCritical ? 'text-red-800' : isHigh ? 'text-orange-800' : 'text-slate-600'
                  }`}
                >
                  {flag.legalIssue}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Texto Original en Contrato
                      </span>
                      <p className="font-mono text-slate-700 italic">"{flag.originalText}"</p>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded border border-emerald-200 space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            Redacción Sugerida (Contrapropuesta)
                          </span>
                          {appliedCorrections[flag.id] && (
                            <span className="text-[9px] bg-emerald-700 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                              ✓ Personalizada por IA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyClause(appliedCorrections[flag.id] || flag.recommendedText, flag.id)}
                            className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            {copiedIndex === flag.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedIndex === flag.id ? 'Copiada' : 'Copiar'}</span>
                          </button>

                          <button
                            onClick={() => setActiveFixFlag(flag)}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold rounded-md shadow-sm transition-all cursor-pointer border border-blue-400/30"
                            title="Genera 3 opciones de redacción inteligente basadas en el perfil de este cliente y sus antecedentes"
                          >
                            <Wand2 className="w-3 h-3 text-amber-300" />
                            <span>✨ Corregir con IA (Perfil Cliente)</span>
                          </button>
                        </div>
                      </div>
                      <p className="font-mono text-emerald-900 font-medium">
                        {appliedCorrections[flag.id] || flag.recommendedText}
                      </p>
                    </div>

                    {/* Anonymous Scam Detection Detail or Reporting Button */}
                    {flag.isScamMatch && flag.scamAlertDetails ? (
                      <div className="p-3 bg-rose-950 text-rose-200 rounded border border-rose-800 space-y-1 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-rose-300 font-bold">
                          <span>🛡️ PATRÓN COINCIDENTE EN RED ANÓNIMA</span>
                          <span className="text-[10px] text-rose-400">HASH: {flag.scamAlertDetails.signatureHash}</span>
                        </div>
                        <p className="text-slate-300 font-sans">{flag.scamAlertDetails.description}</p>
                        <p className="text-[10px] text-rose-400">
                          Total Detecciones Colectivas en Servidor: <strong>{flag.scamAlertDetails.totalCommunityMatches}</strong> • Cero intercambio de PII/datos privados.
                        </p>
                      </div>
                    ) : (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleReportScamAlert(flag)}
                          disabled={reportedFlagIds[flag.id]}
                          className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold rounded border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
                          title="Genera un hash SHA-256 anónimo de la estructura de la cláusula y lo registra en la base de datos de estafas del servidor sin revelar datos de usuario"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            {reportedFlagIds[flag.id]
                              ? '✓ Registrado en Red Anónima'
                              : 'Registrar Patrón de Estafa en Servidor (Anónimo)'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* User Historical Context */}
          <div className="mt-2">
            <h3 className="text-xs font-bold text-slate-800 border-l-4 border-slate-400 pl-3 uppercase tracking-wider mb-2">
              Contexto Histórico del Cliente
            </h3>
            <div className="bg-slate-100 rounded-md p-3 border border-slate-200">
              <p className="text-xs text-slate-600 italic">
                "{report.historicalComparison?.insights || 'Este cliente prioriza topes de responsabilidad limitados y jurisdicción local según su perfil de auditoría recurrente.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Gemini Recommendations Panel */}
        <div className="col-span-12 lg:col-span-4 bg-blue-900 rounded-xl p-5 text-white flex flex-col shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h3 className="font-bold text-sm tracking-tight uppercase">RECOMENDACIÓN GEMINI</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Dictamen Ejecutivo</p>
              <p className="text-xs leading-relaxed opacity-95 text-blue-50 font-medium">{report.executiveSummary}</p>
            </div>

            <div>
              <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Estrategia de Renegociación</p>
              <ul className="space-y-2 text-xs text-blue-100">
                {report.keyActionItems.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-300 font-bold">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-800/60 p-3 rounded-md border border-blue-700">
              <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Cláusula Prioritaria a Modificar</p>
              <p className="text-[11px] font-mono leading-tight text-blue-100">
                "{report.redFlags[0]?.recommendedText || 'Limitación de responsabilidad tope máximo 12 meses.'}"
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSaveToGoogleDocs(report)}
              disabled={isSavingGoogleDoc}
              className="w-full bg-white text-blue-900 py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 shadow-sm cursor-pointer"
            >
              <span>{isSavingGoogleDoc ? 'Exportando...' : 'Exportar a Google Docs'}</span>
              <FileSpreadsheet className="w-4 h-4 text-blue-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive AI Legal Consultorio / Chat */}
      <ContractQAChat
        contractTitle={report.contractTitle}
        contractSnippet={report.contractTextSnippet}
      />

      {/* Clause Fix Modal */}
      {activeFixFlag && (
        <ClauseFixModal
          flag={activeFixFlag}
          contractTitle={report.contractTitle}
          clientProfile={{
            clientId: report.clientId,
            clientName: report.clientName,
            industry: 'Tecnología & Servicios Corporativos',
            totalContractsAudited: 12,
            averageRiskScore: report.overallRiskScore,
            frequentRiskCategories: ['Responsabilidad', 'Penalidades'],
            vendorRiskMap: {},
            negotiationPreferences: [
              'Tope de responsabilidad máximo 12 meses',
              'Jurisdicción y arbitraje local',
            ],
            lastUpdated: new Date().toISOString(),
          }}
          onClose={() => setActiveFixFlag(null)}
          onApplyCorrection={handleApplyCorrection}
        />
      )}

      {/* Certified Document Viewer Modal */}
      {isCertifiedModalOpen && (
        <CertifiedDocModal
          report={report}
          appliedCorrections={appliedCorrections}
          onClose={() => setIsCertifiedModalOpen(false)}
          onSaveToGoogleDocs={onSaveToGoogleDocs}
          isSavingGoogleDoc={isSavingGoogleDoc}
        />
      )}
    </div>
  );
};
