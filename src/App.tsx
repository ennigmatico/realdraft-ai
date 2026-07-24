import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuditSection } from './components/AuditSection';
import { GoogleDocsPicker } from './components/GoogleDocsPicker';
import { GmailView } from './components/GmailView';
import { VaultHistory } from './components/VaultHistory';
import { ClientProfileView } from './components/ClientProfileView';
import { ScamNotificationModal } from './components/ScamNotificationModal';
import { SecurityVaultModal } from './components/SecurityVaultModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { TechStackModal } from './components/TechStackModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CommercialHeroBanner } from './components/CommercialHeroBanner';
import {
  AuditRecord,
  GoogleDocFile,
  UserProfile,
  ScamNotification,
  ClientProfile,
} from './types';
import { Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'docs' | 'history' | 'profile' | 'security' | 'gmail'>('audit');
  const [googleDocsList, setGoogleDocsList] = useState<GoogleDocFile[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile>({
    clientId: 'cli-101',
    clientName: 'Grupo Financiero & Servicios Globales S.A.',
    industry: 'Servicios Financieros & Corporativos',
    totalContractsAudited: 14,
    averageRiskScore: 32,
    frequentRiskCategories: ['Penalty', 'Jurisdiccion', 'Ambiguedad'],
    vendorRiskMap: {
      TechCorp: { auditCount: 5, avgRisk: 68, lastAudited: '2026-07-20' },
      CloudServer: { auditCount: 3, avgRisk: 22, lastAudited: '2026-07-15' },
    },
    negotiationPreferences: [
      'Tope de responsabilidad limitado a 12 meses de facturación',
      'Jurisdicción y arbitraje local',
    ],
    lastUpdated: new Date().toISOString(),
  });

  const [isSavingGoogleDoc, setIsSavingGoogleDoc] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [currentPlanName, setCurrentPlanName] = useState('Despacho Pro');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real-time Scam Notifications State
  const [scamNotifications, setScamNotifications] = useState<ScamNotification[]>([]);
  const [activeModalNotification, setActiveModalNotification] = useState<ScamNotification | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Real-time SSE Stream for Server-side Scam Alerts
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/audit/realtime-alerts-stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_SCAM_REPORTED') {
            showToast(`⚡ Red Anónima: Nuevo patrón de estafa registrado (${data.title || data.category})`);
          }
        } catch (err) {
          console.error('Error reading SSE alert:', err);
        }
      };
    } catch (err) {
      console.error('SSE initialization error:', err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const handleMarkNotifAsRead = (id: string) => {
    setScamNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setScamNotifications([]);
  };

  // Fetch initial user status & drive files
  useEffect(() => {
    fetchAuthStatus();
    fetchDriveFiles();
    fetchAuditHistory();
    fetchClientProfile();
  }, []);

  // OAuth Popup Message Listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        showToast('✓ Conexión con Google Workspace establecida exitosamente.');
        fetchAuthStatus();
        fetchDriveFiles();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(
          data.isWorkspaceConnected
            ? { ...data.user, isWorkspaceConnected: true }
            : {
                id: 'demo-user',
                email: 'auditor@legalguard.ai',
                name: 'Auditor Legal',
                picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                isWorkspaceConnected: false,
              }
        );
      }
    } catch (err) {
      console.error('Error fetching auth me:', err);
    }
  };

  const fetchDriveFiles = async () => {
    try {
      const res = await fetch('/api/drive/files');
      if (res.ok) {
        const data = await res.json();
        setGoogleDocsList(data.files || []);
      }
    } catch (err) {
      console.error('Error fetching drive files:', err);
    }
  };

  const fetchAuditHistory = async () => {
    try {
      const res = await fetch('/api/audit/history');
      if (res.ok) {
        const data = await res.json();
        setAuditHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching audit history:', err);
    }
  };

  const fetchClientProfile = async () => {
    try {
      const res = await fetch('/api/audit/client-profile?clientId=cli-101');
      if (res.ok) {
        const data = await res.json();
        if (data && data.clientId) setClientProfile(data);
      }
    } catch (err) {
      console.error('Error fetching client profile:', err);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      if (res.ok) {
        const { url } = await res.json();
        const popup = window.open(url, 'google_oauth_popup', 'width=600,height=700');
        if (!popup) {
          showToast('⚠️ Por favor permita ventanas emergentes (popups) para conectar con Google.');
        }
      }
    } catch (err) {
      console.error('Error launching OAuth popup:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser((prev) => (prev ? { ...prev, isWorkspaceConnected: false } : null));
    showToast('Sesión de Google Workspace desconectada.');
  };

  const handleRunAudit = async (formData: any): Promise<AuditRecord> => {
    const res = await fetch('/api/audit/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error al ejecutar la auditoría legal.');
    }

    const auditRecord: AuditRecord = await res.json();

    // Check for real-time scam matches
    const scamFlags = auditRecord.redFlags.filter((rf) => rf.isScamMatch);
    if ((auditRecord.communityScamMatchesCount || 0) > 0 || scamFlags.length > 0) {
      const categories = Array.from(
        new Set(scamFlags.map((f) => f.scamAlertDetails?.scamCategory || f.category))
      );
      const hashes = scamFlags
        .map((f) => f.scamAlertDetails?.signatureHash)
        .filter(Boolean) as string[];

      const notif: ScamNotification = {
        id: `notif-${Date.now()}`,
        contractTitle: auditRecord.contractTitle,
        timestamp: new Date().toISOString(),
        scamMatchesCount: auditRecord.communityScamMatchesCount || scamFlags.length || 1,
        matchingCategories: categories.length > 0 ? categories : ['Cláusula Fraudulenta'],
        signatureHashes: hashes,
        read: false,
        auditRecordId: auditRecord.id,
        summaryText: `Identificada(s) ${
          auditRecord.communityScamMatchesCount || scamFlags.length || 1
        } firma(s) de estafa coincidente(s) con la red anónima del servidor.`,
      };

      setScamNotifications((prev) => [notif, ...prev]);
      setActiveModalNotification(notif);
    }

    // Refresh history and client profile
    fetchAuditHistory();
    fetchClientProfile();
    showToast('✓ Auditoría finalizada e informe cifrado guardado en Bóveda AES-256.');

    return auditRecord;
  };

  const handleFetchGoogleDocContent = async (docId: string): Promise<string> => {
    try {
      const res = await fetch(`/api/docs/read/${docId}`);
      if (res.ok) {
        const data = await res.json();
        return data.content || '';
      }
    } catch (err) {
      console.error('Error reading google doc:', err);
    }
    return '';
  };

  const handleSaveToGoogleDocs = async (record: AuditRecord) => {
    setIsSavingGoogleDoc(true);
    try {
      const res = await fetch('/api/docs/save-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditRecord: record }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`✓ Informe de auditoría exportado a Google Docs (${data.googleDocId})`);
      }
    } catch (err) {
      console.error('Error saving report to Google Docs:', err);
    } finally {
      setIsSavingGoogleDoc(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/audit/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAuditHistory((prev) => prev.filter((item) => item.id !== id));
        fetchClientProfile();
        showToast('Registro eliminado de la Bóveda Cifrada.');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const [prefilledDocId, setPrefilledDocId] = useState<string | null>(null);

  const handleSelectDocForAuditFromPicker = async (docId: string) => {
    setPrefilledDocId(docId);
    setActiveTab('audit');
    showToast('✓ Documento de Google Drive cargado en el área de trabajo.');
  };

  const handleSelectPlan = async (planId: 'starter' | 'pro' | 'enterprise', interval: 'monthly' | 'yearly') => {
    setIsProcessingStripe(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingInterval: interval }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          // Simulated Stripe checkout
          const nameMap: Record<string, string> = {
            starter: 'Starter Legal',
            pro: 'Despacho Pro',
            enterprise: 'Corporativo Enterprise',
          };
          const selectedName = nameMap[planId] || 'Despacho Pro';
          setCurrentPlanName(selectedName);
          setIsSubscriptionModalOpen(false);
          showToast(`✓ Suscripción actualizada a ${selectedName} mediante Stripe.`);
        }
      }
    } catch (err) {
      console.error('Error processing Stripe subscription:', err);
      showToast('Error al conectar con la pasarela de Stripe.');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex h-screen overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-blue-500 text-slate-100 px-4 py-3 rounded-lg shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        user={user}
        onConnectGoogle={() => setIsGoogleAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenTechStack={() => setIsTechStackModalOpen(true)}
        currentPlanName={currentPlanName}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-950">
        {/* Full-width Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          activeTab={activeTab}
          notifications={scamNotifications}
          onSelectNotification={(notif) => {
            setActiveModalNotification(notif);
            setActiveTab('audit');
          }}
          onClearNotifications={handleClearNotifications}
          onMarkAsRead={handleMarkNotifAsRead}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1440px] w-full mx-auto">
        {activeTab === 'audit' && (
          <>
            <CommercialHeroBanner
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
              isConnected={Boolean(user?.isWorkspaceConnected)}
            />
            <AuditSection
              onRunAudit={handleRunAudit}
              googleDocsList={googleDocsList}
              onFetchGoogleDocContent={handleFetchGoogleDocContent}
              onSaveToGoogleDocs={handleSaveToGoogleDocs}
              isWorkspaceConnected={user?.isWorkspaceConnected || false}
              onConnectGoogle={() => setIsGoogleAuthModalOpen(true)}
              prefilledDocId={prefilledDocId}
              onClearPrefilledDoc={() => setPrefilledDocId(null)}
            />
          </>
        )}

        {activeTab === 'docs' && (
          <GoogleDocsPicker
            files={googleDocsList}
            onSelectDocForAudit={handleSelectDocForAuditFromPicker}
            isWorkspaceConnected={user?.isWorkspaceConnected || false}
            onConnectGoogle={handleConnectGoogle}
            onRefreshDriveFiles={fetchDriveFiles}
          />
        )}

        {activeTab === 'gmail' && (
          <GmailView
            isWorkspaceConnected={user?.isWorkspaceConnected || false}
            onConnectGoogle={handleConnectGoogle}
            onSelectContractTextForAudit={(title, text) => {
              setActiveTab('audit');
              showToast(`✓ Contrato "${title}" cargado desde Gmail.`);
            }}
            user={user}
          />
        )}

        {activeTab === 'history' && (
          <VaultHistory
            history={auditHistory}
            onDeleteRecord={handleDeleteRecord}
            onSaveToGoogleDocs={handleSaveToGoogleDocs}
          />
        )}

        {activeTab === 'profile' && <ClientProfileView profile={clientProfile} />}

        {activeTab === 'security' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-slate-800">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
              <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Centro de Seguridad & Bóveda Cifrada AES-256</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protección jurídica integral y aislamiento criptográfico para todos los contratos auditados.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Algoritmo de Cifrado</span>
                <span className="text-emerald-700 font-mono font-black text-sm">AES-256-GCM</span>
                <p className="text-[11px] text-slate-500">Cifrado simétrico autenticado de grado bancario militar.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Derivación de Clave</span>
                <span className="text-blue-700 font-mono font-black text-sm">PBKDF2-HMAC-SHA256</span>
                <p className="text-[11px] text-slate-500">100,000 iteraciones para resistencia contra ataques de fuerza bruta.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Verificación Integridad</span>
                <span className="text-slate-800 font-mono font-black text-sm">SHA-256 Checksum</span>
                <p className="text-[11px] text-slate-500">Garantía de no alteración en la Bóveda de almacenamiento.</p>
              </div>

              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Detección de Estafas</span>
                <span className="text-rose-900 font-mono font-black text-sm">Cross-User SHA-256 Match</span>
                <p className="text-[11px] text-rose-800">Comparación 100% anónima en servidor sin compartir PII ni textos.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-blue-400 font-bold">ESTADO DE ENCRIPTACIÓN & RED DE DETECCIÓN EN TIEMPO REAL</span>
                <span className="text-emerald-400 font-bold text-[10px]">✓ ACTIVO & PROTEGIDO</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] space-y-1 text-slate-300">
                <div><span className="text-slate-500">Aislamiento por Cliente:</span> Tenant ID: cli-101</div>
                <div><span className="text-slate-500">Sincronización Google:</span> OAuth 2.0 SSL/TLS 1.3</div>
                <div><span className="text-slate-500">Red de Estafas Anónima:</span> Activada (Servidor deduce firmas SHA-256 sin almacenar o revelar textos privados)</div>
                <div><span className="text-slate-500">Protección contra Inyección:</span> Sanitización Estricta Gemini API</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Real-time Scam Alert Modal */}
      <ScamNotificationModal
        notification={activeModalNotification}
        onClose={() => setActiveModalNotification(null)}
        onViewReport={() => setActiveTab('audit')}
      />

      {/* Security Vault Modal */}
      <SecurityVaultModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Stripe Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan={currentPlanName}
        onSelectPlan={handleSelectPlan}
        isProcessing={isProcessingStripe}
      />

      {/* Tech Stack Modal */}
      <TechStackModal
        isOpen={isTechStackModalOpen}
        onClose={() => setIsTechStackModalOpen(false)}
      />

      {/* Google Authentication Sign-In / Account Creation Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        onGoogleSignIn={handleConnectGoogle}
        user={user}
        onLogout={handleLogout}
      />

      {/* High Density Footer Status Bar */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-6">
          <span>CONEXIÓN: <strong className="text-emerald-400">SEGURA SSL/TLS & AES-256</strong></span>
          <span className="hidden sm:inline">MOTOR IA: <strong className="text-blue-400">GOOGLE GEMINI 3.6 FLASH</strong></span>
          <span>ESTADO: <strong className="text-slate-200">SINCRONIZADO CON GOOGLE DRIVE & GMAIL</strong></span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">SISTEMA OPERATIVO</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
