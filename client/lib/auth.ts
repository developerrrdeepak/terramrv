export function saveToken(token: string) {
  localStorage.setItem("terramrv_token", token);
}
export function getToken() {
  return localStorage.getItem("terramrv_token");
}
export function clearToken() {
  localStorage.removeItem("terramrv_token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
