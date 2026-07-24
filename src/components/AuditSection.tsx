import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  FolderKanban,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { AuditRecord, GoogleDocFile } from '../types';
import { AuditReportView } from './AuditReportView';

interface AuditSectionProps {
  onRunAudit: (formData: any) => Promise<AuditRecord>;
  googleDocsList: GoogleDocFile[];
  onFetchGoogleDocContent: (docId: string) => Promise<string>;
  onSaveToGoogleDocs: (record: AuditRecord) => void;
  isWorkspaceConnected: boolean;
  onConnectGoogle: () => void;
  prefilledDocId?: string | null;
  onClearPrefilledDoc?: () => void;
}

export const AuditSection: React.FC<AuditSectionProps> = ({
  onRunAudit,
  googleDocsList,
  onFetchGoogleDocContent,
  onSaveToGoogleDocs,
  isWorkspaceConnected,
  onConnectGoogle,
  prefilledDocId,
  onClearPrefilledDoc,
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'gdoc' | 'upload'>('text');
  const [contractTitle, setContractTitle] = useState('Contrato Marco de Servicios SaaS & SLA');
  const [clientName, setClientName] = useState('Cliente Auditor S.A.S.');
  const [clientId, setClientId] = useState('cli-101');
  const [counterparty, setCounterparty] = useState('Proveedor Global Tech S.A.');
  const [contractType, setContractType] = useState('Servicios SaaS');
  const [contractContent, setContractContent] = useState(`CONTRATO MARCO DE PRESTACIÓN DE SERVICIOS TECNOLÓGICOS Y NIVEL DE SERVICIO (SLA)

Entre PROVEEDOR GLOBAL TECH S.A. ("El Proveedor") y CLIENTE AUDITOR S.A.S. ("El Cliente").

CLÁUSULA PRIMERA - OBJETO DEL CONTRATO:
El Proveedor prestará al Cliente el servicio de acceso a plataforma de gestión empresarial en la nube. El Proveedor intentará mantener la plataforma activa sin garantizar funcionamiento ininterrumpido.

CLÁUSULA SEGUNDA - LIMITACIÓN DE RESPONSABILIDAD EXTREMA:
En ningún caso la responsabilidad acumulada del Proveedor por cualquier reclamo, incumplimiento o falla técnica superará el monto máximo fijo de USD $50.00 (cincuenta dólares). El Cliente renuncia expresamente a reclamar daños directos, indirectos, lucro cesante o pérdidas operativas. Por su parte, el Cliente responderá sin límite alguno frente a cualquier daño directo o reclamación formulada por el Proveedor.

CLÁUSULA TERCERA - PENALIDAD Y RESCISIÓN ANTICIPADA:
Si el Cliente rescinde este acuerdo antes de completar los 36 meses fijados, deberá abonar el 100% de la totalidad de los cánones mensuales restantes como multa por terminación anticipada, más un recargo del 20% por gastos de gestión.

CLÁUSULA CUARTA - AUMENTO UNILATERAL DE PRECIOS:
El Proveedor se reserva el derecho de ajustar las tarifas en cualquier momento mediante aviso publicado en su sitio web con 5 días de anticipación. Si el Cliente no rechaza explícitamente el aumento en 48 horas, se considerará aceptado.

CLÁUSULA QUINTA - JURISDICCIÓN Y TRIBUNALES APLICABLES:
Las partes acuerdan que cualquier discrepancia jurídica se resolverá exclusivamente ante los Tribunales del Estado de Delaware, Estados Unidos de América, renunciando el Cliente a la jurisdicción de su domicilio local.`);

  const [selectedGDocId, setSelectedGDocId] = useState<string>('');
  const [googleDocUrl, setGoogleDocUrl] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState<string>('');
  const [auditReport, setAuditReport] = useState<AuditRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledDocId) {
      setInputMode('gdoc');
      handleSelectGDoc(prefilledDocId);
    }
  }, [prefilledDocId]);

  const handleSelectGDoc = async (docId: string) => {
    setSelectedGDocId(docId);
    try {
      const doc = googleDocsList.find((d) => d.id === docId);
      if (doc) {
        setContractTitle(doc.name.replace('.gdoc', ''));
        if (doc.webViewLink) setGoogleDocUrl(doc.webViewLink);
      }
      const text = await onFetchGoogleDocContent(docId);
      if (text) {
        setContractContent(text);
      }
    } catch (err) {
      console.error('Error fetching Google Doc content:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setContractContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractContent || contractContent.trim().length < 20) {
      setErrorMsg('Por favor proporcione el texto del contrato para auditar.');
      return;
    }

    setErrorMsg(null);
    setIsAuditing(true);

    const steps = [
      '1/5 Parseando sintaxis contractual y estructura jurídica...',
      '2/5 Extrayendo cláusulas de responsabilidad, penalidades y jurisdicción...',
      '3/5 Consultando modelo Gemini para detectar desequilibrios y abusos...',
      '4/5 Analizando patrón histórico de riesgos de este cliente...',
      '5/5 Generando informe final y encriptando datos en Bóveda AES-256...',
    ];

    for (const step of steps) {
      setAuditStep(step);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const result = await onRunAudit({
        contractTitle,
        clientName,
        clientId,
        counterparty,
        contractType,
        contractContent,
        googleDocId: selectedGDocId || undefined,
        googleDocUrl: googleDocUrl || undefined,
      });

      setAuditReport(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al ejecutar la auditoría legal con IA.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* If Audit Report is available, show Report View + button to start new audit */}
      {auditReport ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400">
              Mostrando Auditoría Legal Finalizada
            </span>
            <button
              onClick={() => setAuditReport(null)}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Auditar Otro Contrato</span>
            </button>
          </div>
          <AuditReportView
            report={auditReport}
            onSaveToGoogleDocs={onSaveToGoogleDocs}
          />
        </div>
      ) : (
        /* Audit Form Workspace */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative text-slate-800">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Super Auditoría Legal de Contratos</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Análisis profundo con Gemini IA, comparación con historial del cliente y cifrado de seguridad AES-256.
              </p>
            </div>

            {/* Input Mode Selector */}
            <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                  inputMode === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Pegar Texto</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('gdoc')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                  inputMode === 'gdoc' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Google Docs</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                  inputMode === 'upload' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Archivo</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-md flex items-center space-x-3 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStartAudit} className="space-y-6">
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Contract Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Título del Contrato</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="ej: Contrato SaaS 2026"
                  />
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Cliente Auditor</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="Nombre del Cliente"
                  />
                </div>
              </div>

              {/* Counterparty / Vendor */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Contraparte / Proveedor</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="Empresa Contraparte"
                  />
                </div>
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo de Contrato</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Servicios SaaS">Servicios SaaS & SLA</option>
                    <option value="NDA / Confidencialidad">Acuerdo de Confidencialidad (NDA)</option>
                    <option value="Suministro / Proveeduría">Suministro y Logística</option>
                    <option value="Arrendamiento">Arrendamiento Comercial</option>
                    <option value="Prestación de Servicios">Prestación de Servicios Prof.</option>
                    <option value="Licenciamiento Software">Licencia de Software / IP</option>
                    <option value="Trabajo / Empleo">Contrato Laboral / Empleo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Input Mode Dynamic Panels */}
            {inputMode === 'gdoc' && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <FolderKanban className="w-4 h-4" />
                    <span>Seleccionar Documento desde Google Drive / Docs</span>
                  </label>
                  {!isWorkspaceConnected && (
                    <button
                      type="button"
                      onClick={onConnectGoogle}
                      className="text-xs text-blue-600 hover:underline cursor-pointer font-bold"
                    >
                      Conectar Google Workspace →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {googleDocsList.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectGDoc(doc.id)}
                      className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedGDocId === doc.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                      {selectedGDocId === doc.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inputMode === 'upload' && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-md p-6 text-center">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Seleccione o arrastre un archivo de contrato (.txt, .doc, .docx)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  El archivo se procesará de forma segura y se analizará con Gemini IA.
                </p>
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="mt-3 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
            )}

            {/* Contract Content Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">
                  Texto del Contrato a Auditar
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Caracteres: {contractContent.length.toLocaleString()}
                </span>
              </div>

              <textarea
                rows={12}
                required
                value={contractContent}
                onChange={(e) => setContractContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed"
                placeholder="Pegue aquí las cláusulas del contrato..."
              />
            </div>

            {/* Submit Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Auditoría protegida bajo Bóveda de Cifrado AES-256-GCM</span>
              </div>

              <button
                type="submit"
                disabled={isAuditing}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Ejecutando Auditoría Legal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auditar Contrato con Gemini IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Progress Stepper during Analysis */}
            {isAuditing && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Escaneo Legal Inteligente Activo</span>
                </div>
                <p className="text-xs text-blue-800 font-mono">{auditStep}</p>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
