export type PublicCheckin = {
  id: string;
  created_at: string;
  person_id: string;
  display_name: string;
  photo_url: string | null;
};

export type CheckinInput = {
  personId: string;
  displayName: string;
  wechat: string;
  phone: string;
  email: string;
  photo?: File | null;
  locale: string;
  honeypot: string;
};

function envUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/$/, "");
}

function envKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
}

export function hometownWired(): boolean {
  return Boolean(envUrl() && envKey());
}

function headers(json = true): HeadersInit {
  const key = envKey();
  const h: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function uploadPhoto(file: File): Promise<string | null> {
  const url = envUrl();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `checkins/${crypto.randomUUID()}.${ext}`;
  const res = await fetch(`${url}/storage/v1/object/hometown-checkins/${path}`, {
    method: "POST",
    headers: {
      ...headers(false),
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  });
  if (!res.ok) return null;
  return `${url}/storage/v1/object/public/hometown-checkins/${path}`;
}

export async function listCheckins(): Promise<PublicCheckin[]> {
  if (!hometownWired()) return [];
  const res = await fetch(
    `${envUrl()}/rest/v1/hometown_checkins?select=id,created_at,person_id,display_name,photo_url&order=created_at.desc&limit=80`,
    { headers: headers(), cache: "no-store" },
  );
  if (!res.ok) return [];
  return (await res.json()) as PublicCheckin[];
}

export async function submitCheckin(input: CheckinInput): Promise<{ ok: boolean; fake?: boolean }> {
  if (input.honeypot.trim()) return { ok: true, fake: true };
  if (!hometownWired()) return { ok: false };

  let photoUrl: string | null = null;
  if (input.photo && input.photo.size > 0) {
    photoUrl = await uploadPhoto(input.photo);
  }

  const res = await fetch(`${envUrl()}/rest/v1/hometown_checkins`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({
      person_id: input.personId,
      display_name: input.displayName.trim(),
      wechat: input.wechat.trim() || null,
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      photo_url: photoUrl,
      locale: input.locale,
    }),
  });
  return { ok: res.ok };
}
