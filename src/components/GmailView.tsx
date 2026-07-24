import React, { useState } from 'react';
import {
  Mail,
  Search,
  Send,
  FileText,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  User,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';

interface GmailMessage {
  id: string;
  threadId: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  bodySnippet: string;
  hasAttachment: boolean;
  attachmentName?: string;
  contractSnippet?: string;
}

interface GmailViewProps {
  isWorkspaceConnected: boolean;
  onConnectGoogle: () => void;
  onSelectContractTextForAudit: (title: string, text: string) => void;
  user: UserProfile | null;
}

export const GmailView: React.FC<GmailViewProps> = ({
  isWorkspaceConnected,
  onConnectGoogle,
  onSelectContractTextForAudit,
  user,
}) => {
  const [searchQuery, setSearchQuery] = useState('contrato OR legal OR acuerdo');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showConfirmSendModal, setShowConfirmSendModal] = useState(false);

  // Compose State
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('Informe de Auditoría Legal - RealDraft AI');
  const [emailBody, setEmailBody] = useState(
    'Estimado cliente,\n\nAdjunto y detallo el informe de auditoría contractual realizado mediante el sistema RealDraft AI (Google Gemini 3.6 Flash).\n\nSe han analizado las cláusulas de penalidad, vigencia y confidencialidad. Por favor revise el resumen adjunto en la plataforma Bóveda RealDraft AI.\n\nAtentamente,\nDespacho Legal / RealDraft AI'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Sample Gmail messages containing legal contracts & documents
  const [messages, setMessages] = useState<GmailMessage[]>([
    {
      id: 'msg-101',
      threadId: 'th-101',
      sender: 'Lic. Roberto Gómez (TechCorp)',
      senderEmail: 'roberto.gomez@techcorp-latam.com',
      subject: 'Borrador Contrato de Servicios SaaS y SLA 2026',
      snippet: 'Estimados, envío para revisión el acuerdo definitivo de provisión de licencias y soporte...',
      date: 'Hoy, 10:42 AM',
      hasAttachment: true,
      attachmentName: 'Contrato_Servicios_SaaS_TechCorp_v3.pdf',
      bodySnippet:
        'Estimados abogados,\n\nLes comparto el borrador del contrato de servicios SaaS para el nuevo período. Incluye la cláusula de indemnización sin tope máximo por interrupción del servicio y prórroga automática tacita a 36 meses sin penalidad.\n\nFavor de auditar con urgencia antes del cierre de trimestre.\n\nSaludos,\nRoberto Gómez',
      contractSnippet:
        'CLÁUSULA DÉCIMA QUINTA: VIGENCIA Y PRÓRROGA AUTOMÁTICA. El presente contrato se renovará automáticamente por períodos consecutivos de 36 meses, a menos que la contratante notifique por escrito con una anticipación no menor a 180 días calendarios. De no hacerlo, se aplicará una pena convencional equivalente al 200% del valor total asignado.',
    },
    {
      id: 'msg-102',
      threadId: 'th-102',
      sender: 'Valeria Mendoza (Inmobiliaria Urbano)',
      senderEmail: 'v.mendoza@urbano-desarrollos.com',
      subject: 'Acuerdo de Confidencialidad NDA - Proyecto San Isidro',
      snippet: 'Adjunto el acuerdo NDA firmado por nuestro representante legal. Quedamos a la espera de su dictamen...',
      date: 'Ayer, 4:15 PM',
      hasAttachment: true,
      attachmentName: 'NDA_Confidencialidad_Urbano_2026.docx',
      bodySnippet:
        'Hola,\n\nAdjunto el NDA relativo a la transmisión de datos comerciales del Proyecto San Isidro. Se ha incluido una cláusula de exclusividad territorial de 5 años e irrenunciabilidad de tribunales extranjeros en Delaware.\n\nAgradecemos su análisis y comentarios con el sistema RealDraft AI.',
      contractSnippet:
        'CLÁUSULA OCTAVA: JURISDICCIÓN Y COMPETENCIA. Todas las controversias derivadas de este Acuerdo de Confidencialidad se someterán exclusivamente a la jurisdicción de los Tribunales Estatales de Delaware, EE.UU., renunciando expresamente las partes al fuero de su domicilio habitual.',
    },
    {
      id: 'msg-103',
      threadId: 'th-103',
      sender: 'Dirección Jurídica Global',
      senderEmail: 'legal@global-corp-group.org',
      subject: 'Contrato de Promesa de Compraventa y Suministro',
      snippet: 'Se reenvía contrato marco de suministro comercial con términos de penalización por atraso...',
      date: '22 Jul 2026',
      hasAttachment: false,
      bodySnippet:
        'Estimado equipo legal,\n\nRevisen el siguiente texto de la penalización por retrasos en entregas de suministros:\n\n"En caso de que el Proveedor incurra en demora superior a 3 días hábiles en la entrega de bienes, pagará una penalidad de $5,000 USD por cada día calendario de atraso, sin derecho a reclamación fortuita o fuerza mayor."',
      contractSnippet:
        'CLÁUSULA QUINTA: DE LAS PENALIDADES POR INCUMPLIMIENTO. En caso de mora o retraso superior a tres días en las entregas, la contratista pagará el equivalente al 5% diario del monto total del contrato, acumulable indefinidamente sin límite de tope.',
    },
  ]);

  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAuditEmailContract = (msg: GmailMessage) => {
    const title = `[Gmail Import] ${msg.subject}`;
    const textToAudit = msg.contractSnippet || msg.bodySnippet;
    onSelectContractTextForAudit(title, textToAudit);
  };

  const handleOpenComposeForMessage = (msg: GmailMessage) => {
    setRecipientEmail(msg.senderEmail);
    setEmailSubject(`RE: Audit Report RealDraft AI - ${msg.subject}`);
    setShowComposeModal(true);
  };

  const handleConfirmSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowConfirmSendModal(false);
      setShowComposeModal(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Integración Gmail API Workspace</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Gestión de Contratos & Correos en Gmail
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Importe adjuntos y contratos recibidos por correo electrónico directamente al motor
            RealDraft AI, o envíe informes ejecutivos firmados por Gmail.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          {!isWorkspaceConnected ? (
            <button
              onClick={onConnectGoogle}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-blue-400/30"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
              </svg>
              <span>Vincular Cuenta de Gmail</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gmail Conectado ({user?.email || 'Workspace'})</span>
            </div>
          )}

          <button
            onClick={() => {
              setRecipientEmail('');
              setShowComposeModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Redactar Correo</span>
          </button>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl font-bold flex items-center space-x-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>¡Correo enviado con éxito desde su cuenta corporativa de Gmail!</span>
        </div>
      )}

      {/* Main Mail Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Email Inbox List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en correos de Gmail (ej. contrato, NDA, penalidad)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer text-xs font-bold shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-rose-500 bg-slate-800/90 shadow-md ring-1 ring-rose-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-rose-950 border border-rose-800 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                        {msg.sender.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-200 truncate">{msg.sender}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.date}</span>
                  </div>

                  <h3 className="text-xs font-extrabold text-white truncate">{msg.subject}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{msg.snippet}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    {msg.hasAttachment ? (
                      <span className="flex items-center space-x-1 text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{msg.attachmentName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Texto en cuerpo</span>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAuditEmailContract(msg);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auditar con Gemini</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Detail & Quick Mail Audit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                    Gmail Message Detail
                  </span>
                  <span className="text-[10px] text-slate-500">{selectedMessage.date}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white leading-snug">{selectedMessage.subject}</h3>
                <div className="text-xs text-slate-300">
                  De: <strong className="text-white">{selectedMessage.sender}</strong> ({selectedMessage.senderEmail})
                </div>
              </div>

              {/* Message Body Box */}
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs leading-relaxed text-slate-300 max-h-56 overflow-y-auto">
                <p className="whitespace-pre-line">{selectedMessage.bodySnippet}</p>
              </div>

              {/* Extracted Clause Preview */}
              {selectedMessage.contractSnippet && (
                <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cláusula Detectada en el Mensaje</span>
                  </div>
                  <p className="text-[11px] text-amber-200 italic font-mono leading-relaxed">
                    "{selectedMessage.contractSnippet}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleAuditEmailContract(selectedMessage)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-blue-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Importar Contrato e Iniciar Auditoría</span>
                </button>

                <button
                  onClick={() => handleOpenComposeForMessage(selectedMessage)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-rose-400" />
                  <span>Responder / Enviar Reporte por Gmail</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">Seleccione un correo de la lista izquierda para auditarlo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Gmail Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>Redactar Correo por Gmail API</span>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Destinatario (Email):</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="cliente@empresa.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Asunto del Correo:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Cuerpo del Mensaje / Reporte:</label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowConfirmSendModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Continuar a Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Workspace Confirmation Modal before Sending Email */}
      {showConfirmSendModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Confirmación de Envío por Gmail</h3>
                <p className="text-[10px] text-slate-400">Protección de Datos & Políticas Google Workspace</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs text-slate-300">
              <p>
                Está a punto de enviar un correo oficial utilizando la API de Gmail en nombre de su cuenta corporativa:
              </p>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-rose-300 space-y-0.5">
                <div><strong>Para:</strong> {recipientEmail || 'Sin especificar'}</div>
                <div><strong>Asunto:</strong> {emailSubject}</div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                ¿Confirma el envío de este mensaje a la dirección de correo indicada?
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setShowConfirmSendModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSendEmail}
                disabled={isSending}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                {isSending ? (
                  <span>Enviando por Gmail...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Sí, Enviar Correo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
