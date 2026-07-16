export const incidents = [
  { id: "SP-0717-042", title: "Harbor Bank password reset from lookalike domain", source: "Email", sender: "security@harborbnk-login.com", category: "Credential phishing", risk: 94, status: "Open", updated: "10 min ago", owner: "Maya Chen", nextStep: "Call Harbor Bank through the published support number before touching the link." },
  { id: "SP-0717-039", title: "Roadrunner Parcel customs fee text", source: "SMS", sender: "+1 (415) 907-1184", category: "Smishing", risk: 81, status: "Investigating", updated: "24 min ago", owner: "Jon Bell", nextStep: "Check the tracking number directly on Roadrunner Parcel's website." },
  { id: "SP-0717-033", title: "Omar from Finance asks for a same-day wire", source: "WhatsApp", sender: "Omar Haddad +44 7700 900384", category: "Payment diversion", risk: 76, status: "Escalated", updated: "51 min ago", owner: "Priya Nair", nextStep: "Verify the payment change in the finance approval channel." },
  { id: "SP-0717-029", title: "Northwind Q2 invoice with macro attachment", source: "Email", sender: "billing@northwind-ledger.net", category: "Malware", risk: 68, status: "Contained", updated: "1 hr ago", owner: "Theo Martin", nextStep: "Keep the attachment quarantined and request a clean invoice from the vendor portal." },
  { id: "SP-0717-018", title: "Kora Skin giveaway account takeover bait", source: "Instagram", sender: "@kora_rewards_help", category: "Giveaway scam", risk: 43, status: "Resolved", updated: "3 hrs ago", owner: "Leila Stone", nextStep: "Report the impersonating account and warn affected customers." }
];

export const knowledgeArticles = [
  ["Phishing", "Messages that imitate trusted services to steal passwords, sessions, or files.", "Open the real service yourself instead of trusting the message path."],
  ["Targeted impersonation", "A message that uses team names, vendors, or job details to sound familiar.", "Treat familiar context as a clue to verify, not proof of identity."],
  ["QR phishing", "Printed or digital QR codes that hide a credential-stealing destination.", "Preview the destination and reject QR codes in unexpected requests."],
  ["Smishing", "Text-message fraud that borrows urgency from banks, parcels, or government notices.", "Verify tracking, claims, or payments in the official app or website."],
  ["Voice pressure", "Calls that use spoofed numbers, panic, or authority to rush decisions.", "Hang up and call back through a number you already trust."],
  ["Payment diversion", "Supplier or executive impersonation used to redirect invoices or wires.", "Require second-channel approval for any banking-detail change."],
  ["Fake support", "Unsolicited helpers who claim an account or device is already compromised.", "Never grant remote access or install tools from an inbound request."],
  ["Relationship fraud", "Trust-building conversations that slowly move toward money or secrets.", "Keep identity verification separate from the conversation itself."],
  ["Investment traps", "Guaranteed returns, fake dashboards, and pressure to move funds quickly.", "Reject guaranteed returns and verify regulatory registration."],
  ["Synthetic voice risk", "Generated voices or clips that impersonate managers, relatives, or clients.", "Use a shared verification phrase and call back independently."],
  ["Hiring scams", "Fake recruiters who collect identity data or demand upfront payments.", "Real employers do not charge applicants for equipment or onboarding."],
  ["Malware lures", "Files or links that install software to steal, encrypt, or monitor.", "Keep unexpected files isolated until the sender is verified."]
];
