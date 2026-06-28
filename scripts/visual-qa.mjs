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
await page.getByRole("button", { name: "Product guide" }).click();
await page.getByRole("heading", { name: "Security guidance people can actually use." }).waitFor();
await page.waitForTimeout(700);
await page.screenshot({ path: ".qa-guide.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Premium", exact: true }).click();
await page.getByRole("button", { name: "Choose Premium" }).click();
await page.getByText("Premium is now your active plan.").waitFor();
await page.waitForTimeout(700);
await page.screenshot({ path: ".qa-pricing.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Sign in" }).click();
await page.getByLabel("Email address").fill("analyst@example.com");
await page.getByLabel("Password").fill("secure-passphrase");
await page.getByRole("button", { name: "Sign in securely" }).click();
await page.getByText("Welcome, analyst.").waitFor();
await page.getByRole("button", { name: "New analysis" }).click();
await page.getByRole("button", { name: "Load demo example" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: ".qa-analyzer.png", fullPage: true });
await page.getByRole("button", { name: "Analyze threat" }).click();
await page.getByText("Analysis complete").waitFor({ state: "visible" });
await page.waitForTimeout(900);
await page.screenshot({ path: ".qa-report.png", fullPage: true, animations: "disabled" });
await page.getByRole("button", { name: "Copy summary" }).click();
await page.getByText("Security summary copied to clipboard.").waitFor();
console.log(JSON.stringify({ title: await page.title(), errors, url: page.url() }, null, 2));
await browser.close();
