export const incidents = [
  { id: "INC-2026-2847", title: "Unusual sign-in — verify now", source: "Email", category: "Credential phishing", risk: 94, status: "Open", updated: "2 min ago" },
  { id: "INC-2026-2846", title: "Package delivery fee required", source: "SMS", category: "Smishing", risk: 81, status: "Investigating", updated: "18 min ago" },
  { id: "INC-2026-2845", title: "CEO requests urgent transfer", source: "WhatsApp", category: "BEC", risk: 76, status: "Escalated", updated: "42 min ago" },
  { id: "INC-2026-2844", title: "Invoice attached for review", source: "Email", category: "Malware", risk: 68, status: "Contained", updated: "1 hr ago" },
  { id: "INC-2026-2843", title: "Claim your summer giveaway", source: "Instagram", category: "Giveaway scam", risk: 43, status: "Resolved", updated: "3 hrs ago" }
];
export const knowledgeArticles = [
  ["Phishing", "Deceptive messages designed to steal credentials or deliver malware.", "Check the sender, inspect links, and open the real service yourself."],
  ["Spear phishing", "Targeted phishing personalized with details about a person or organization.", "Treat familiar details as context—not proof of identity."],
  ["QR phishing", "Malicious QR codes that hide credential-stealing destinations.", "Preview the destination and avoid QR codes in unexpected messages."],
  ["Smishing", "Phishing delivered through SMS or mobile messaging.", "Never trust a delivery or bank link solely because it arrived by text."],
  ["Vishing", "Voice calls using pressure, spoofed numbers, or impersonation.", "Hang up and call the verified number on the official website."],
  ["Business Email Compromise", "Impersonation of executives or suppliers to redirect payments.", "Require a second-channel approval for payment-detail changes."],
  ["Tech support scams", "Fake support agents claim your device or account is compromised.", "Never grant remote access after an unsolicited contact."],
  ["Romance scams", "A fabricated relationship is used to build trust before requesting money.", "Never send funds to someone whose identity you cannot verify."],
  ["Crypto & investment scams", "Guaranteed returns and fake platforms lure victims into irreversible transfers.", "Reject guaranteed returns and verify regulatory registration."],
  ["AI & deepfake scams", "Generated voices, images, or text impersonate trusted people.", "Use a shared verification phrase and call back independently."],
  ["Job scams", "Fake recruiters collect identity data or demand upfront payments.", "Legitimate employers do not charge applicants for equipment or training."],
  ["Malware campaigns", "Files or links install software that steals, encrypts, or spies.", "Keep systems patched and scan unexpected files before opening."]
];
