import React, { useState } from 'react';
import {
  History,
  Lock,
  Search,
  FileText,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  KeyRound,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { AuditRecord } from '../types';
import { AuditReportView } from './AuditReportView';
import { generateAuditPdf } from '../utils/pdfGenerator';

interface VaultHistoryProps {
  history: AuditRecord[];
  onDeleteRecord: (id: string) => void;
  onSaveToGoogleDocs: (record: AuditRecord) => void;
}

export const VaultHistory: React.FC<VaultHistoryProps> = ({
  history,
  onDeleteRecord,
  onSaveToGoogleDocs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filtered = history.filter(
    (item) =>
      item.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.counterparty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <Lock className="w-3.5 h-3.5" />
            <span>BÓVEDA DE SEGURIDAD CIFRADA AES-256-GCM</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Historial de Auditorías por Cliente</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Todos los contratos analizados se cifran de forma aislada para cada cliente garantizando confidencialidad legal.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-md flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{history.length} Auditorías Encriptadas</span>
        </div>
      </div>

      {selectedRecord ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRecord(null)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-300 transition-colors cursor-pointer"
          >
            ← Volver a la Lista
          </button>
          <AuditReportView report={selectedRecord} onSaveToGoogleDocs={onSaveToGoogleDocs} />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título de contrato, cliente o proveedor..."
              className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              No hay auditorías registradas que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => {
                const isHighRisk = item.overallRiskScore >= 60;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <div
                        className={`p-2 rounded-md border flex-shrink-0 ${
                          isHighRisk
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        }`}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.contractTitle}</h4>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-200 text-slate-700 rounded">
                            {item.contractType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cliente: <strong className="text-slate-800">{item.clientName}</strong> • Proveedor:{' '}
                          <strong className="text-blue-700">{item.counterparty}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          SHA-256: {item.encryptionMetadata?.sha256Hash?.slice(0, 10)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Riesgo</span>
                        <span
                          className={`text-xs font-black ${
                            isHighRisk ? 'text-red-600' : 'text-emerald-600'
                          }`}
                        >
                          {item.overallRiskScore}%
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateAuditPdf(item);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors border border-transparent hover:border-emerald-200 cursor-pointer"
                        title="Descargar informe PDF cifrado"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
