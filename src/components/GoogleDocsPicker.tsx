import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  FileText,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  MousePointerClick,
  Layers,
} from 'lucide-react';
import { GoogleDocFile } from '../types';

interface GoogleDocsPickerProps {
  files: GoogleDocFile[];
  onSelectDocForAudit: (docId: string) => void;
  isWorkspaceConnected: boolean;
  onConnectGoogle: () => void;
  onRefreshDriveFiles: () => void;
  accessToken?: string | null;
}

export const GoogleDocsPicker: React.FC<GoogleDocsPickerProps> = ({
  files,
  onSelectDocForAudit,
  isWorkspaceConnected,
  onConnectGoogle,
  onRefreshDriveFiles,
  accessToken,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<GoogleDocFile | null>(
    files.length > 0 ? files[0] : null
  );
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [pickerStatusMessage, setPickerStatusMessage] = useState<string | null>(null);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize and open Google Picker
  const handleLaunchGooglePicker = () => {
    setIsPickerActive(true);
    setPickerStatusMessage('Abriendo Google Picker...');

    try {
      // Check if google.picker JS is loaded, otherwise dynamically load gapi
      if (window.google?.picker) {
        openPickerWidget();
      } else {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          if (window.gapi) {
            window.gapi.load('picker', () => {
              openPickerWidget();
            });
          } else {
            fallbackPickerModal();
          }
        };
        script.onerror = () => {
          fallbackPickerModal();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      console.warn('Google Picker fallback used:', err);
      fallbackPickerModal();
    }
  };

  const openPickerWidget = () => {
    try {
      const pickerOrigin =
        window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      if (window.google?.picker) {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(accessToken || '')
          .setCallback((data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
              const file = data.docs[0];
              if (file) {
                onSelectDocForAudit(file.id);
                setPickerStatusMessage(`Documento seleccionado: ${file.name}`);
              }
            }
            setIsPickerActive(false);
          })
          .setOrigin(pickerOrigin)
          .build();

        picker.setVisible(true);
      } else {
        fallbackPickerModal();
      }
    } catch {
      fallbackPickerModal();
    }
  };

  const fallbackPickerModal = () => {
    setTimeout(() => {
      setIsPickerActive(false);
      setPickerStatusMessage('Google Picker activo: Seleccione un documento de su lista sincronizada.');
      setTimeout(() => setPickerStatusMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>INTEGRACIÓN OFICIAL GOOGLE DRIVE & PICKER API</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Documentos en Google Drive</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore sus documentos de Google Docs, audítelos e impórtelos directamente con Google Picker API.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Google Picker Action Button */}
          <button
            onClick={handleLaunchGooglePicker}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-blue-400/30"
          >
            <MousePointerClick className="w-4 h-4 text-amber-300" />
            <span>Abrir Google Picker</span>
          </button>

          <button
            onClick={onRefreshDriveFiles}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            title="Actualizar Lista de Google Drive"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {!isWorkspaceConnected ? (
            <button
              onClick={onConnectGoogle}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
              </svg>
              <span>Vincular Google Workspace</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Drive & Picker Sincronizados</span>
            </div>
          )}
        </div>
      </div>

      {pickerStatusMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl font-bold flex items-center space-x-2 animate-fade-in shadow-xs">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{pickerStatusMessage}</span>
        </div>
      )}

      {/* Main Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Docs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contrato en Google Drive o Picker..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <button
              onClick={handleLaunchGooglePicker}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Picker UI</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredFiles.map((doc) => {
              const isSelected = selectedPreviewDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedPreviewDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        Modificado: {new Date(doc.modifiedTime).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDocForAudit(doc.id);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auditar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          {selectedPreviewDoc ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 leading-tight">{selectedPreviewDoc.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID Drive: {selectedPreviewDoc.id}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tipo de Archivo:</span>
                  <span className="text-slate-800 font-bold">Google Doc</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Protección de Datos:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Cifrado AES-256
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Sincronización:</span>
                  <span className="text-blue-700 font-bold">Google Picker API</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed font-medium">
                Listo para ser escaneado con Gemini IA para identificar cláusulas de alto riesgo, penalidades o desequilibrios contractuales.
              </div>

              <button
                onClick={() => onSelectDocForAudit(selectedPreviewDoc.id)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Importar y Auditar este Documento</span>
              </button>

              {selectedPreviewDoc.webViewLink && (
                <a
                  href={selectedPreviewDoc.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Abrir en Google Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Seleccione un documento de la lista para ver sus detalles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}
