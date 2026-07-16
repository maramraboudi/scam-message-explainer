import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1, acceptDownloads: true });
const errors = [];
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", error => errors.push(error.message));
await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: ".qa-desktop.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Method" }).click();
await page.getByRole("heading", { name: "Message triage with a human audit trail." }).waitFor();
await page.waitForTimeout(700);
await page.screenshot({ path: ".qa-guide.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Plans", exact: true }).click();
await page.getByRole("button", { name: "Choose Premium" }).click();
await page.getByText("Premium is now your active plan.").waitFor();
await page.waitForTimeout(700);
await page.screenshot({ path: ".qa-pricing.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: ".qa-account.png", fullPage: true, animations: "disabled" });
await page.getByLabel("Email address").fill("analyst@example.com");
await page.getByLabel("Password").fill("secure-passphrase");
await page.getByRole("button", { name: "Sign in securely" }).click();
await page.getByText("Welcome, analyst.").waitFor();
await page.getByRole("button", { name: "Triage desk" }).click();
await page.getByRole("button", { name: "Load Harbor Bank sample" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: ".qa-analyzer.png", fullPage: true });
await page.getByRole("button", { name: "Run triage" }).click();
await page.getByText("Triage complete").waitFor({ state: "visible" });
await page.waitForTimeout(900);
await page.screenshot({ path: ".qa-report.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Copy summary" }).click();
await page.getByText("Case summary copied to clipboard.").waitFor();
await page.getByRole("button", { name: "Case queue" }).click();
await page.getByText("SP-0717-042").click();
await page.getByRole("heading", { name: "Harbor Bank password reset from lookalike domain" }).waitFor();
await page.screenshot({ path: ".qa-incidents.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Close" }).click().catch(async () => {
  await page.locator(".detail-close").click();
});
await page.getByRole("button", { name: "Field notes" }).click();
await page.getByRole("button", { name: /Open note/ }).first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: ".qa-knowledge.png", fullPage: true, animations: "disabled" });
console.log(JSON.stringify({ title: await page.title(), errors, url: page.url() }, null, 2));
await browser.close();
