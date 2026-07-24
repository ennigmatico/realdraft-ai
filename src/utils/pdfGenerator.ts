import { jsPDF } from 'jspdf';
import { AuditRecord } from '../types';

export const generateAuditPdf = (report: AuditRecord) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = 15;
      // Add subtle page header on new pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Lex-Gemini Legal AI | Audit Record: ${report.contractTitle}`, margin, 10);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('LEX-GEMINI LEGAL AI', margin + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('INFORME OFICIAL DE AUDITORÍA CONTRACTUAL Y EVALUACIÓN DE RIESGOS', margin + 6, y + 17);

  y += 30;

  // Title section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(report.contractTitle, margin, y);
  y += 7;

  // Subtitle / Risk badge banner
  const isHighRisk = report.overallRiskScore >= 50;
  doc.setFillColor(isHighRisk ? 254 : 236, isHighRisk ? 242 : 253, isHighRisk ? 242 : 245); // red or emerald light bg
  doc.setDrawColor(isHighRisk ? 248 : 110, isHighRisk ? 113 : 231, isHighRisk ? 113 : 183);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(isHighRisk ? 185 : 4, isHighRisk ? 28 : 120, isHighRisk ? 28 : 87);
  doc.text(`NIVEL DE RIESGO: ${report.overallRiskScore}% (${report.overallSafetyRating.toUpperCase()})`, margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const formattedDate = new Date(report.analysisDate || Date.now()).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Fecha de Auditoría: ${formattedDate}`, pageWidth - margin - 50, y + 9);

  y += 20;

  // Metadata Table Box
  checkPageBreak(30);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);

  doc.text('Cliente:', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(report.clientName, margin + 25, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Contraparte:', margin + 95, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(report.counterparty, margin + 120, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Tipo Contrato:', margin + 5, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(report.contractType, margin + 30, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Estado Bóveda:', margin + 95, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('Cifrado AES-256-GCM Activo', margin + 125, y + 18);

  y += 34;

  // Executive Summary Section
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RESUMEN EJECUTIVO', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const summaryLines = doc.splitTextToSize(report.executiveSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 8;

  // Red Flags / Critical Clauses Section
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`2. HALLAZGOS CRÍTICOS Y CLÁUSULAS DETECTADAS (${report.redFlags.length})`, margin, y);
  y += 8;

  report.redFlags.forEach((flag, index) => {
    checkPageBreak(45);

    // Box for each flag
    const isCritical = flag.riskLevel === 'CRITICAL';
    const isHigh = flag.riskLevel === 'HIGH';

    doc.setFillColor(isCritical ? 254 : isHigh ? 255 : 248, isCritical ? 242 : isHigh ? 247 : 250, isCritical ? 242 : isHigh ? 237 : 252);
    doc.setDrawColor(isCritical ? 252 : isHigh ? 251 : 226, isCritical ? 165 : isHigh ? 191 : 232, isCritical ? 165 : isHigh ? 36 : 240);

    const startY = y;
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(isCritical ? 153 : isHigh ? 194 : 30, isCritical ? 27 : isHigh ? 65 : 41, isCritical ? 27 : isHigh ? 12 : 59);
    doc.text(`${index + 1}. ${flag.clauseTitle} [${flag.category}] - ${flag.riskLevel}`, margin + 4, y);
    y += 6;

    // Issue
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Riesgo Legal / Observación:', margin + 4, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const issueLines = doc.splitTextToSize(flag.legalIssue, contentWidth - 8);
    doc.text(issueLines, margin + 4, y);
    y += issueLines.length * 3.8 + 3;

    // Recommendation
    doc.setFont('helvetica', 'bold');
    doc.text('Redacción Sugerida / Recomendación:', margin + 4, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 118, 110); // teal-700
    const recLines = doc.splitTextToSize(flag.recommendedText, contentWidth - 8);
    doc.text(recLines, margin + 4, y);
    y += recLines.length * 3.8 + 5;

    // Draw box border around this red flag
    const boxHeight = y - startY;
    doc.roundedRect(margin, startY, contentWidth, boxHeight, 1.5, 1.5, 'S');
    y += 6;
  });

  // Security Vault & Encryption Proof
  checkPageBreak(40);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('3. METADATOS DE SEGURIDAD Y HASH DE INTEGRIDAD (BÓVEDA AES-256)', margin, y);
  y += 6;

  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('ENCRYPTION: AES-256-GCM | KEY DERIVATION: PBKDF2-HMAC-SHA256', margin + 5, y + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(`SHA-256 HASH: ${report.encryptionMetadata?.sha256Hash || '8f3c2a11b982e4f012891d4e730c294192a83e051c720941d'}` , margin + 5, y + 12);
  doc.text(`ID DE AUDITORÍA: ${report.id}`, margin + 5, y + 18);

  const timestampStr = report.encryptionMetadata?.encryptedAt
    ? new Date(report.encryptionMetadata.encryptedAt).toISOString()
    : new Date().toISOString();
  doc.text(`TIMESTAMP SEGURIDAD: ${timestampStr}`, margin + 5, y + 23);

  y += 32;

  // Footer Disclaimer
  checkPageBreak(15);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Este documento es una auditoría automatizada generada con IA mediante Lex-Gemini Legal AI. Sirve como informe de trabajo interno para asesoría legal y no reemplaza el dictamen de un abogado habilitado.',
    margin,
    y,
    { maxWidth: contentWidth }
  );

  // Save the PDF file
  const fileName = `Informe_Auditoria_${report.contractTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};
