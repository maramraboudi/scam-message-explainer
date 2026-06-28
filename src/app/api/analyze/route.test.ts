import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

describe("POST /api/analyze", () => {
  it("validates short input", async () => {
    const request = new NextRequest("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ content: "short", source: "Email" }),
      headers: { "content-type": "application/json" }
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
  it("returns a structured report", async () => {
    const request = new NextRequest("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ content: "Urgent: verify your account at https://bit.ly/example", source: "SMS" }),
      headers: { "content-type": "application/json" }
    });
    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("score");
    expect(data).toHaveProperty("findings");
  });
  it("rejects cross-origin submission", async () => {
    const request = new NextRequest("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ content: "Urgent suspicious content", source: "Email" }),
      headers: { "content-type": "application/json", origin: "https://evil.example" }
    });
    expect((await POST(request)).status).toBe(403);
  });
});
