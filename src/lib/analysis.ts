import type { AnalysisResult, Finding, ThreatLevel } from "./types";

const patterns = [
  { id: "urgency", re: /\b(urgent|immediately|act now|within \d+ hours?|suspended|expires? today)\b/i, title: "Manufactured urgency", explanation: "The sender pressures you to act before you have time to verify the request.", severity: "High" as const, points: 17 },
  { id: "credentials", re: /\b(password|verify (?:your )?account|login|sign in|security code|one.time code|OTP)\b/i, title: "Credential request", explanation: "The message asks for information that legitimate organizations rarely request by message.", severity: "Critical" as const, points: 26 },
  { id: "money", re: /\b(gift card|wire transfer|bitcoin|crypto|payment|bank details|refund|prize|won)\b/i, title: "Financial lure", explanation: "Money, a reward, or an unusual payment method is used to motivate a risky action.", severity: "High" as const, points: 19 },
  { id: "link", re: /\b(?:https?:\/\/|www\.)[^\s]+/i, title: "Unverified link", explanation: "The message contains a link that should be inspected independently before opening.", severity: "Medium" as const, points: 13 },
  { id: "short", re: /\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy)\/\S+/i, title: "Shortened destination", explanation: "A shortened URL hides the final website address, a common phishing technique.", severity: "High" as const, points: 18 },
  { id: "authority", re: /\b(IRS|tax office|police|government|bank|Microsoft|Apple|Amazon|CEO|director)\b/i, title: "Authority impersonation", explanation: "A trusted brand or authority is invoked to make the request feel legitimate.", severity: "Medium" as const, points: 12 },
  { id: "attachment", re: /\b(attachment|invoice|document|PDF|enable macros?|download)\b/i, title: "Potentially unsafe attachment", explanation: "Unexpected files can deliver malware or redirect to a credential-stealing page.", severity: "High" as const, points: 18 }
];
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);

export function analyzeMessage(raw: string): AnalysisResult {
  const text = raw.trim().slice(0, 12000);
  const findings: Finding[] = patterns.flatMap(pattern => {
    const match = text.match(pattern.re);
    return match ? [{ id: pattern.id, title: pattern.title, explanation: pattern.explanation, severity: pattern.severity, evidence: match[0], points: pattern.points }] : [];
  });
  const score = Math.min(99, Math.max(8, findings.reduce((sum, finding) => sum + finding.points, 0)));
  const threatLevel: ThreatLevel = score >= 75 ? "Critical" : score >= 50 ? "High" : score >= 25 ? "Medium" : "Low";
  const hasMoney = findings.some(f => f.id === "money");
  const hasCredentials = findings.some(f => f.id === "credentials");
  const category = hasCredentials ? "Credential phishing" : hasMoney ? "Financial scam" : findings.some(f => f.id === "short") ? "Malicious URL" : "Suspicious message";
  const evidenceExcerpt = escapeHtml(text.slice(0, 4000));
  const highlightedText = findings.reduce(
    (result, finding) => result.replace(new RegExp(`(${finding.evidence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>"),
    evidenceExcerpt
  );
  return {
    id: `INC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    score, threatLevel, confidence: Math.min(98, 64 + findings.length * 6), category,
    summary: score >= 50 ? `This message is likely a ${category.toLowerCase()}. It combines ${findings.length} recognized manipulation and technical indicators. Do not interact with it until the sender is verified through an independent channel.` : "No decisive malicious pattern was found, but absence of a match does not prove a message is safe. Verify the sender and destination independently.",
    findings, highlightedText,
    immediateActions: ["Do not click links, open attachments, or reply.", "Contact the organization using its official website or phone number.", "If you shared credentials, change them from a trusted device and enable MFA.", "Report and delete the message after preserving evidence."],
    avoidActions: ["Do not call phone numbers included in the message.", "Do not pay a fee to unlock a prize, refund, or account.", "Do not forward the message to others without warning them."],
    preventionTips: ["Use a password manager—it will not autofill on lookalike domains.", "Turn on multi-factor authentication for important accounts.", "Pause when a message creates urgency, secrecy, or fear."],
    createdAt: new Date().toISOString()
  };
}
