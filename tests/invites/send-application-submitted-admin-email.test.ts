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
  inviterName: "Pat Inviter",
  inviterEmail: "pat@example.com",
  inviterAboutJoiner: "Alex is shipping real agents in production.",
  inviteeFullName: "Alex Builder",
  inviteeEmail: "alex@example.com",
  phoneCountryCode: "+420",
  phoneNumber: "777123456",
  linkedinUrl: "https://www.linkedin.com/in/alex",
  shipping: {
    line1: "1 Lane",
    line2: "Suite 2" as string | null,
    city: "Prague",
    postal: "11000",
    country: "Czechia",
  },
  tshirtSize: "M",
  merchGender: "unisex" as const,
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
      from: { name: string; email: string };
      subject: string;
    };
    expect(arg.to).toBe("admin@example.com");
    expect(arg.from).toEqual({
      name: "1B Tokens",
      email: "from@example.com",
    });
    expect(arg.subject).toContain("Alex Builder");
  });
});
