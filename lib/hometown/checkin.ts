export type CheckinRow = {
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
  photo: File | null;
  /** Honeypot. Must stay empty. */
  website: string;
  locale: string;
};

function supabaseConfig(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function checkinConfigured(): boolean {
  return supabaseConfig() !== null;
}

async function rest<T>(
  path: string,
  init: RequestInit & { query?: string } = {},
): Promise<T> {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error("unconfigured");
  const { query, ...restInit } = init;
  const res = await fetch(`${cfg.url}${path}${query ?? ""}`, {
    ...restInit,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      ...restInit.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function listCheckins(): Promise<CheckinRow[]> {
  if (!checkinConfigured()) return [];
  return rest<CheckinRow[]>(
    "/rest/v1/hometown_checkins_board",
    { query: "?select=id,created_at,person_id,display_name,photo_url&order=created_at.desc&limit=80" },
  );
}

async function uploadPhoto(file: File): Promise<string | null> {
  const cfg = supabaseConfig();
  if (!cfg) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safe = ext.replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `checkins/${crypto.randomUUID()}.${safe}`;
  const res = await fetch(`${cfg.url}/storage/v1/object/hometown-checkins/${path}`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  });
  if (!res.ok) return null;
  return `${cfg.url}/storage/v1/object/public/hometown-checkins/${path}`;
}

export async function submitCheckin(input: CheckinInput): Promise<void> {
  if (input.website.trim()) return;
  const name = input.displayName.trim();
  if (!name || !input.personId) throw new Error("incomplete");
  if (!checkinConfigured()) throw new Error("unconfigured");
  let photoUrl: string | null = null;
  if (input.photo && input.photo.size > 0) {
    if (input.photo.size > 3_000_000) throw new Error("photo");
    photoUrl = await uploadPhoto(input.photo);
  }
  await rest("/rest/v1/hometown_checkins", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      person_id: input.personId,
      display_name: name.slice(0, 80),
      wechat: input.wechat.trim().slice(0, 80) || null,
      phone: input.phone.trim().slice(0, 40) || null,
      email: input.email.trim().slice(0, 120) || null,
      photo_url: photoUrl,
      locale: input.locale.slice(0, 16),
    }),
  });
}
