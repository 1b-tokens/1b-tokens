import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/invites/send-application-submitted-admin-email", () => ({
  sendApplicationSubmittedAdminEmail: vi.fn().mockResolvedValue(undefined),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { POST } from "@/app/api/invites/[token]/apply/route";
import { sendApplicationSubmittedAdminEmail } from "@/lib/invites/send-application-submitted-admin-email";
import { createAdminClient } from "@/lib/supabase/admin";

const validBody = {
  shipping_address_line1: "1 Lane",
  shipping_city: "City",
  shipping_postal_code: "12345",
  shipping_country: "CZ",
  phone_country_code: "+420",
  phone_number: "777123456",
  projects_description: "Building agentic workflows end to end.",
  linkedin_url: "https://www.linkedin.com/in/me",
  tshirt_size: "L",
  merch_gender: "unisex",
};

describe("POST /api/invites/[token]/apply", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await POST(
      new Request("http://localhost/api/invites/tok/apply", {
        method: "POST",
        body: JSON.stringify(validBody),
        headers: { "Content-Type": "application/json" },
      }),
      { params: Promise.resolve({ token: "tok" }) },
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 when signed-in email does not match invite", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_applicant" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddressId: "e1",
      emailAddresses: [{ id: "e1", emailAddress: "wrong@example.com" }],
    } as never);

    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                id: "inv-1",
                invitee_email: "invited@example.com",
                invitee_full_name: "Invited Person",
                inviter_clerk_user_id: "user_inviter",
                token: "tok",
                status: "pending",
              },
              error: null,
            }),
          }),
        }),
      }),
    } as never);

    const res = await POST(
      new Request("http://localhost/api/invites/tok/apply", {
        method: "POST",
        body: JSON.stringify(validBody),
        headers: { "Content-Type": "application/json" },
      }),
      { params: Promise.resolve({ token: "tok" }) },
    );
    expect(res.status).toBe(403);
  });

  it("submits application and marks invite submitted", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_applicant" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      primaryEmailAddressId: "e1",
      emailAddresses: [{ id: "e1", emailAddress: "invited@example.com" }],
    } as never);

    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const updateEqMock = vi.fn().mockResolvedValue({ error: null });
    let invitesFromCalls = 0;

    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "invites") {
          invitesFromCalls += 1;
          if (invitesFromCalls === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: {
                      id: "inv-1",
                      invitee_email: "invited@example.com",
                      invitee_full_name: "Invited Person",
                      inviter_clerk_user_id: "user_inviter",
                      token: "tok",
                      status: "pending",
                    },
                    error: null,
                  }),
                }),
              }),
            };
          }
          return {
            update: vi.fn().mockReturnValue({
              eq: updateEqMock,
            }),
          };
        }
        if (table === "invite_applications") {
          return { insert: insertMock };
        }
        throw new Error(`unexpected table ${table}`);
      }),
    } as never);

    const res = await POST(
      new Request("http://localhost/api/invites/tok/apply", {
        method: "POST",
        body: JSON.stringify(validBody),
        headers: { "Content-Type": "application/json" },
      }),
      { params: Promise.resolve({ token: "tok" }) },
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(insertMock).toHaveBeenCalled();
    expect(updateEqMock).toHaveBeenCalled();
    expect(sendApplicationSubmittedAdminEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        inviteId: "inv-1",
        inviteToken: "tok",
        inviteeFullName: "Invited Person",
        applicantEmail: "invited@example.com",
      }),
    );
  });
});
