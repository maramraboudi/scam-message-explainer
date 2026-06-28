import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Account } from "./account";
import { Incidents } from "./incidents";
import { Platform } from "./platform";

beforeEach(() => localStorage.clear());

describe("startup product workflows", () => {
  it("navigates to the complete product guide", () => {
    render(<Platform />);
    fireEvent.click(screen.getByRole("button", { name: "Product guide" }));
    expect(screen.getByRole("heading", { name: "Security guidance people can actually use." })).toBeInTheDocument();
    expect(screen.getByText("From uncertainty to action")).toBeInTheDocument();
  });

  it("selects and persists a premium plan", () => {
    render(<Platform />);
    fireEvent.click(screen.getByRole("button", { name: "Premium" }));
    fireEvent.click(screen.getByRole("button", { name: "Choose Premium" }));
    expect(localStorage.getItem("sme-plan-v1")).toBe("Premium");
    expect(screen.getByRole("button", { name: "Current plan" })).toBeDisabled();
  });

  it("validates account credentials and submits a valid session", () => {
    const login = vi.fn();
    render(<Account user={null} onLogin={login} onLogout={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "analyst@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secure-passphrase" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in securely/i }));
    expect(login).toHaveBeenCalledWith({ name: "analyst", email: "analyst@example.com" });
  });

  it("filters incidents and toggles a bookmark", () => {
    render(<Incidents notify={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/search incidents/i), { target: { value: "delivery" } });
    expect(screen.getByText("INC-2026-2846")).toBeInTheDocument();
    expect(screen.queryByText("INC-2026-2847")).not.toBeInTheDocument();
    const bookmark = screen.getByRole("button", { name: /bookmark INC-2026-2846/i });
    fireEvent.click(bookmark);
    expect(screen.getByRole("button", { name: /remove bookmark from INC-2026-2846/i })).toBeInTheDocument();
  });
});
