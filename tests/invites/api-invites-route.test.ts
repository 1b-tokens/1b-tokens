import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/invites/has-submitted-club-application", () => ({
  hasSubmittedClubApplication: vi.fn(),
}));

vi.mock("@/lib/invites/send-invite-email", () => ({
  sendInviteEmail: vi.fn(),
}));

vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => "t".repeat(32)),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { GET, POST } from "@/app/api/invites/route";
import { hasSubmittedClubApplication } from "@/lib/invites/has-submitted-club-application";
import { sendInviteEmail } from "@/lib/invites/send-invite-email";
import { createAdminClient } from "@/lib/supabase/admin";

function makeCountBuilder(pendingCount: number) {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ count: pendingCount, error: null }),
      }),
    }),
  };
}

function makeInsertBuilder(id: string) {
  return {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id }, error: null }),
      }),
    }),
  };
}


describe("GET /api/invites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns invites when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "1",
                  invitee_email: "a@b.co",
                  invitee_full_name: "A",
                  pitch: "p",
                  status: "pending",
                  created_at: "2026-01-01",
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.invites).toHaveLength(1);
    expect(json.invites[0].invitee_email).toBe("a@b.co");
  });
});

describe("POST /api/invites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Name",
          email: "a@b.co",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("returns 409 when at invite limit", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      firstName: "Inviter",
      lastName: "One",
      username: null,
      primaryEmailAddress: null,
      emailAddresses: [],
    } as never);
    vi.mocked(hasSubmittedClubApplication).mockResolvedValue(true);
    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue(makeCountBuilder(3)),
    } as never);

    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Name",
          email: "a@b.co",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(409);
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  it("returns 403 when user has not submitted the club application", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      firstName: "Inviter",
      lastName: "One",
      username: null,
      primaryEmailAddress: null,
      emailAddresses: [],
    } as never);
    vi.mocked(hasSubmittedClubApplication).mockResolvedValue(false);

    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Name",
          email: "a@b.co",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toMatch(/application/i);
  });

  it("does not require application and allows invite for unrestricted admin under admin cap", async () => {
    const adminId = "user_3Cwq9euobZ767F22wNosr3nddIS";
    vi.mocked(auth).mockResolvedValue({ userId: adminId } as never);
    vi.mocked(currentUser).mockResolvedValue({
      firstName: "Admin",
      lastName: "User",
      username: null,
      primaryEmailAddress: { emailAddress: "admin@example.com" },
      emailAddresses: [],
    } as never);
    const from = vi
      .fn()
      .mockImplementationOnce(() => makeCountBuilder(0))
      .mockImplementationOnce(() => makeInsertBuilder("inv-1"));
    vi.mocked(createAdminClient).mockReturnValue({ from } as never);
    vi.mocked(sendInviteEmail).mockResolvedValue(undefined);

    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Name",
          email: "a@b.co",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(res.status).toBe(201);
    expect(hasSubmittedClubApplication).not.toHaveBeenCalled();
    expect(sendInviteEmail).toHaveBeenCalledOnce();
  });

  it("returns 409 for unrestricted admin at admin invite cap", async () => {
    const adminId = "user_3Cwq9euobZ767F22wNosr3nddIS";
    vi.mocked(auth).mockResolvedValue({ userId: adminId } as never);
    vi.mocked(currentUser).mockResolvedValue({
      firstName: "Admin",
      lastName: "User",
      username: null,
      primaryEmailAddress: { emailAddress: "admin@example.com" },
      emailAddresses: [],
    } as never);
    vi.mocked(createAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue(makeCountBuilder(99)),
    } as never);

    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Name",
          email: "a@b.co",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(res.status).toBe(409);
    expect(sendInviteEmail).not.toHaveBeenCalled();
  });

  it("creates invite and sends email on success", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_1" } as never);
    vi.mocked(currentUser).mockResolvedValue({
      firstName: "Inviter",
      lastName: "One",
      username: null,
      primaryEmailAddress: null,
      emailAddresses: [],
    } as never);
    vi.mocked(hasSubmittedClubApplication).mockResolvedValue(true);

    const from = vi
      .fn()
      .mockImplementationOnce(() => makeCountBuilder(0))
      .mockImplementationOnce(() => makeInsertBuilder("inv-1"));

    vi.mocked(createAdminClient).mockReturnValue({ from } as never);
    vi.mocked(sendInviteEmail).mockResolvedValue(undefined);

    const res = await POST(
      new Request("http://localhost/api/invites", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Invitee Person",
          email: "Invitee@Example.com",
          pitch: "x".repeat(20),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.token).toBe("t".repeat(32));
    expect(sendInviteEmail).toHaveBeenCalledOnce();
    expect(sendInviteEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "invitee@example.com",
        inviteeName: "Invitee Person",
        pitch: "x".repeat(20),
      }),
    );
  });
});
