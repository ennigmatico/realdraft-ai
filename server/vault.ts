import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { AuditRecord, ClientProfile } from '../src/types.js';

const MASTER_SECRET = process.env.ENCRYPTION_SECRET || 'legalguard_master_vault_key_32_bytes_length!!';
const DB_FILE = path.join(process.cwd(), 'data', 'vault_db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

interface EncryptedVaultEntry {
  id: string;
  clientId: string;
  clientName: string;
  contractTitle: string;
  counterparty: string;
  analysisDate: string;
  encryptedPayload: string; // Base64 ciphertext
  iv: string; // Base64 IV
  authTag: string; // Base64 Auth Tag
  sha256Hash: string;
  algorithm: string;
}

class VaultEngine {
  private vaultEntries: EncryptedVaultEntry[] = [];
  private clientProfiles: Map<string, ClientProfile> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private getKey(salt: string): Buffer {
    // PBKDF2 Key derivation
    return crypto.pbkdf2Sync(MASTER_SECRET, salt, 10000, 32, 'sha256');
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.vaultEntries = parsed.entries || [];
        
        // Reconstruct client profiles from decrypted cache if available or disk
        if (parsed.profiles) {
          Object.entries(parsed.profiles).forEach(([clientId, profile]) => {
            this.clientProfiles.set(clientId, profile as ClientProfile);
          });
        }
      }
    } catch (err) {
      console.error('Error loading vault DB:', err);
      this.vaultEntries = [];
    }
  }

  private saveToDisk() {
    try {
      const profilesObj: Record<string, ClientProfile> = {};
      this.clientProfiles.forEach((val, key) => {
        profilesObj[key] = val;
      });

      fs.writeFileSync(
        DB_FILE,
        JSON.stringify({ entries: this.vaultEntries, profiles: profilesObj }, null, 2),
        'utf-8'
      );
    } catch (err) {
      console.error('Error saving vault DB:', err);
    }
  }

  public encryptAndStoreAudit(record: AuditRecord): AuditRecord {
    const salt = record.clientId || 'default_client';
    const key = this.getKey(salt);
    const iv = crypto.randomBytes(12);

    const plaintext = JSON.stringify(record);
    const sha256Hash = crypto.createHash('sha256').update(plaintext).digest('hex');

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedBuffer = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const encrypted = encryptedBuffer.toString('base64');

    const authTag = cipher.getAuthTag().toString('base64');

    const entry: EncryptedVaultEntry = {
      id: record.id,
      clientId: record.clientId,
      clientName: record.clientName,
      contractTitle: record.contractTitle,
      counterparty: record.counterparty,
      analysisDate: record.analysisDate,
      encryptedPayload: encrypted,
      iv: iv.toString('base64'),
      authTag: authTag,
      sha256Hash,
      algorithm: 'AES-256-GCM',
    };

    // Store in vault
    this.vaultEntries.unshift(entry);

    // Update encryption metadata on return object
    record.encryptionMetadata = {
      algorithm: 'AES-256-GCM',
      iv: entry.iv,
      authTag: entry.authTag,
      sha256Hash: entry.sha256Hash,
      encryptedAt: new Date().toISOString(),
    };

    // Update Client Legal Profile
    this.updateClientProfile(record);

    this.saveToDisk();

    return record;
  }

  public getDecryptedRecord(id: string): AuditRecord | null {
    const entry = this.vaultEntries.find((e) => e.id === id);
    if (!entry) return null;

    try {
      const salt = entry.clientId || 'default_client';
      const key = this.getKey(salt);
      const iv = Buffer.from(entry.iv, 'base64');
      const authTag = Buffer.from(entry.authTag, 'base64');

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      const decryptedBuffer = Buffer.concat([
        decipher.update(Buffer.from(entry.encryptedPayload, 'base64')),
        decipher.final(),
      ]);

      const record: AuditRecord = JSON.parse(decryptedBuffer.toString('utf8'));
      
      // Attach encryption metadata
      record.encryptionMetadata = {
        algorithm: entry.algorithm,
        iv: entry.iv,
        authTag: entry.authTag,
        sha256Hash: entry.sha256Hash,
        encryptedAt: entry.analysisDate,
      };

      return record;
    } catch (err) {
      // Prune corrupted or un-decryptable entry to avoid recurring errors
      this.vaultEntries = this.vaultEntries.filter((e) => e.id !== id);
      this.saveToDisk();
      return null;
    }
  }

  public getAuditHistoryForClient(clientId?: string): AuditRecord[] {
    const entries = clientId
      ? this.vaultEntries.filter((e) => e.clientId === clientId)
      : this.vaultEntries;

    const results: AuditRecord[] = [];
    for (const entry of entries) {
      const record = this.getDecryptedRecord(entry.id);
      if (record) {
        results.push(record);
      }
    }

    return results;
  }

  public deleteAuditRecord(id: string): boolean {
    const index = this.vaultEntries.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.vaultEntries.splice(index, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  private updateClientProfile(newRecord: AuditRecord) {
    const clientId = newRecord.clientId || 'default_client';
    const clientHistory = this.getAuditHistoryForClient(clientId);

    const totalCount = clientHistory.length;
    const avgRisk = totalCount > 0
      ? Math.round(clientHistory.reduce((acc, r) => acc + r.overallRiskScore, 0) / totalCount)
      : newRecord.overallRiskScore;

    // Frequent risk categories
    const categoryCounts: Record<string, number> = {};
    clientHistory.forEach((r) => {
      r.redFlags.forEach((rf) => {
        categoryCounts[rf.category] = (categoryCounts[rf.category] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat)
      .slice(0, 4);

    // Vendor risk map
    const existingProfile = this.clientProfiles.get(clientId);
    const vendorMap = existingProfile?.vendorRiskMap || {};

    if (newRecord.counterparty) {
      const existingVendor = vendorMap[newRecord.counterparty] || {
        auditCount: 0,
        avgRisk: 0,
        lastAudited: newRecord.analysisDate,
      };

      const newAuditCount = existingVendor.auditCount + 1;
      const newVendorAvgRisk = Math.round(
        (existingVendor.avgRisk * existingVendor.auditCount + newRecord.overallRiskScore) /
          newAuditCount
      );

      vendorMap[newRecord.counterparty] = {
        auditCount: newAuditCount,
        avgRisk: newVendorAvgRisk,
        lastAudited: newRecord.analysisDate,
      };
    }

    const updatedProfile: ClientProfile = {
      clientId,
      clientName: newRecord.clientName || 'Cliente Principal',
      industry: existingProfile?.industry || 'Empresa / Servicios',
      totalContractsAudited: totalCount,
      averageRiskScore: avgRisk,
      frequentRiskCategories: topCategories,
      vendorRiskMap: vendorMap,
      negotiationPreferences: [
        'Límite de responsabilidad máximo de 12 meses de facturación',
        'Jurisdicción y tribunales locales',
        'Cláusulas de resolución de controversias con arbitraje previo',
        'Acuerdos de confidencialidad de 3 a 5 años máximo',
      ],
      lastUpdated: new Date().toISOString(),
    };

    this.clientProfiles.set(clientId, updatedProfile);
  }

  public getClientProfile(clientId: string): ClientProfile | null {
    return this.clientProfiles.get(clientId) || null;
  }

  public getAllClientProfiles(): ClientProfile[] {
    return Array.from(this.clientProfiles.values());
  }

  public getVaultSecurityStatus() {
    return {
      activeEntriesCount: this.vaultEntries.length,
      cipherAlgorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2-HMAC-SHA256 (10,000 iterations)',
      integrityProtection: '128-bit Authentication Tag + SHA-256 Hash',
      masterKeyConfigured: !!process.env.ENCRYPTION_SECRET,
      lastSyncTime: new Date().toISOString(),
    };
  }
}

export const vaultEngine = new VaultEngine();
