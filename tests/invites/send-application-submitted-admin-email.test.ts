import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@sendgrid/mail", () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn().mockResolvedValue([{}]),
  },
}));

import sgMail from "@sendgrid/mail";
import { sendApplicationSubmittedAdminEmail } from "@/lib/invites/send-application-submitted-admin-email";

const baseParams = {
  inviteId: "inv-1",
  inviteToken: "tok123",
  inviteeFullName: "Alex Builder",
  inviteeEmail: "alex@example.com",
  inviterClerkUserId: "user_inviter",
  applicantClerkUserId: "user_applicant",
  applicantEmail: "alex@example.com",
  tshirtSize: "M",
  linkedinUrl: "https://www.linkedin.com/in/alex",
  projectsDescription: "Shipping agents to prod.",
};

describe("sendApplicationSubmittedAdminEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("SENDGRID_API_KEY", "sg.test");
    vi.stubEnv("SENDGRID_FROM_EMAIL", "from@example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not call SendGrid when ADMIN_EMAIL is unset", async () => {
    vi.stubEnv("ADMIN_EMAIL", "");
    await sendApplicationSubmittedAdminEmail(baseParams);
    expect(sgMail.send).not.toHaveBeenCalled();
  });

  it("does not call SendGrid when ADMIN_EMAIL is blank", async () => {
    vi.stubEnv("ADMIN_EMAIL", "   ");
    await sendApplicationSubmittedAdminEmail(baseParams);
    expect(sgMail.send).not.toHaveBeenCalled();
  });

  it("sends to ADMIN_EMAIL when set", async () => {
    vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
    await sendApplicationSubmittedAdminEmail(baseParams);
    expect(sgMail.setApiKey).toHaveBeenCalledWith("sg.test");
    expect(sgMail.send).toHaveBeenCalledOnce();
    const arg = vi.mocked(sgMail.send).mock.calls[0][0] as {
      to: string;
      subject: string;
    };
    expect(arg.to).toBe("admin@example.com");
    expect(arg.subject).toContain("Alex Builder");
  });
});
