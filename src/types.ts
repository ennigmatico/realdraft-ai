export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RedFlag {
  id: string;
  category: 'Abusiva' | 'Penalty' | 'Ambiguedad' | 'Responsabilidad' | 'Jurisdiccion' | 'Vigencia' | 'Confidencialidad' | 'Otro';
  riskLevel: RiskLevel;
  clauseTitle: string;
  originalText: string;
  legalIssue: string;
  recommendedText: string;
  legalReference?: string;
  isScamMatch?: boolean;
  scamAlertDetails?: {
    signatureHash: string;
    totalCommunityMatches: number;
    scamCategory: string;
    description: string;
    firstDetectedAt: string;
  };
}

export interface RiskCategoryBreakdown {
  category: string;
  score: number; // 0-100 (0 = safe, 100 = high risk)
  count: number;
}

export interface ClientProfile {
  clientId: string;
  clientName: string;
  industry?: string;
  totalContractsAudited: number;
  averageRiskScore: number;
  frequentRiskCategories: string[];
  vendorRiskMap: { [vendorName: string]: { auditCount: number; avgRisk: number; lastAudited: string } };
  negotiationPreferences: string[];
  lastUpdated: string;
}

export interface HistoricalComparison {
  previousContractId?: string;
  previousContractName?: string;
  riskDifference: number; // e.g. +12% riskier or -5% safer
  keyChangesDetected: string[];
  insights: string;
}

export interface AuditRecord {
  id: string;
  clientId: string;
  clientName: string;
  contractTitle: string;
  counterparty: string; // Vendor or Client name in the contract
  contractType: string; // e.g., 'NDA', 'SaaS', 'Prestación de Servicios', 'Arrendamiento', 'Empleo', 'Suministro'
  analysisDate: string;
  overallRiskScore: number; // 0 to 100
  overallSafetyRating: 'Sano' | 'Riesgo Moderado' | 'Alto Riesgo' | 'Crítico / Abusivo';
  executiveSummary: string;
  contractTextSnippet: string;
  googleDocId?: string;
  googleDocUrl?: string;
  redFlags: RedFlag[];
  categoryBreakdown: RiskCategoryBreakdown[];
  historicalComparison?: HistoricalComparison;
  keyActionItems: string[];
  communityScamMatchesCount?: number;
  encryptionMetadata: {
    algorithm: string;
    iv: string;
    authTag: string;
    sha256Hash: string;
    encryptedAt: string;
  };
}

export interface GoogleDocFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isWorkspaceConnected: boolean;
}

export interface ScamNotification {
  id: string;
  contractTitle: string;
  timestamp: string;
  scamMatchesCount: number;
  matchingCategories: string[];
  signatureHashes: string[];
  read: boolean;
  auditRecordId?: string;
  summaryText: string;
}

export interface AnalysisRequest {
  contractTitle: string;
  clientId: string;
  clientName: string;
  counterparty: string;
  contractType: string;
  contractContent: string;
  googleDocId?: string;
  googleDocUrl?: string;
}
