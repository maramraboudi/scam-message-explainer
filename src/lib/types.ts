export type ThreatLevel = "Critical" | "High" | "Medium" | "Low";
export interface Finding {
  id: string;
  title: string;
  explanation: string;
  severity: ThreatLevel;
  evidence: string;
  points: number;
}
export interface AnalysisResult {
  id: string;
  score: number;
  threatLevel: ThreatLevel;
  confidence: number;
  category: string;
  summary: string;
  findings: Finding[];
  highlightedText: string;
  immediateActions: string[];
  avoidActions: string[];
  preventionTips: string[];
  createdAt: string;
}
