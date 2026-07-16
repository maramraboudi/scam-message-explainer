import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Account } from "./account";
import { Incidents } from "./incidents";
import { Platform } from "./platform";

beforeEach(() => localStorage.clear());

describe("startup product workflows", () => {
  it("navigates to the complete product guide", () => {
    render(<Platform />);
    fireEvent.click(screen.getByRole("button", { name: "Method" }));
    expect(screen.getByRole("heading", { name: "Message triage with a human audit trail." })).toBeInTheDocument();
    expect(screen.getByText("From noisy messages to named cases")).toBeInTheDocument();
  });

  it("selects and persists a premium plan", () => {
    render(<Platform />);
    fireEvent.click(screen.getByRole("button", { name: "Plans" }));
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
    fireEvent.change(screen.getByPlaceholderText(/search cases/i), { target: { value: "Roadrunner" } });
    expect(screen.getByText("SP-0717-039")).toBeInTheDocument();
    expect(screen.queryByText("SP-0717-042")).not.toBeInTheDocument();
    const bookmark = screen.getByRole("button", { name: /bookmark SP-0717-039/i });
    fireEvent.click(bookmark);
    expect(screen.getByRole("button", { name: /remove bookmark from SP-0717-039/i })).toBeInTheDocument();
  });
});
