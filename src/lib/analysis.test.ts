import { describe, expect, it } from "vitest";
import { analyzeMessage } from "./analysis";

describe("analysis engine", () => {
  it("detects a high-risk credential phishing message", () => {
    const result = analyzeMessage("URGENT: Verify your account and password immediately at https://bit.ly/login or your bank account will be suspended.");
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.threatLevel).toBe("Critical");
    expect(result.category).toBe("Credential phishing");
    expect(result.findings.map(item => item.id)).toContain("short");
  });
  it("returns a cautious low-risk result for neutral text", () => {
    const result = analyzeMessage("Hello, are we still meeting for lunch tomorrow?");
    expect(result.threatLevel).toBe("Low");
    expect(result.score).toBe(8);
  });
  it("encodes untrusted HTML before highlighting evidence", () => {
    const result = analyzeMessage('<script>alert("xss")</script> urgent');
    expect(result.highlightedText).not.toContain("<script>");
    expect(result.highlightedText).toContain("&lt;script&gt;");
  });
  it("caps content length and risk score", () => {
    const result = analyzeMessage("urgent password bitcoin https://bit.ly/x Microsoft invoice download ".repeat(1000));
    expect(result.score).toBeLessThanOrEqual(99);
    expect(result.highlightedText.length).toBeLessThan(13000);
  });
});
