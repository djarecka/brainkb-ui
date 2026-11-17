// Runs one of the query service's stored queries (see ./queries.ts) as the
// caller, so signed-out visitors can read a public space's graph without the
// admin-only SPARQL endpoint. Rows come back as SPARQL JSON bindings.
export async function runStoredQuery(name: string, params: Record<string, string>) {
  const response = await fetch(`/api/stored-query/${encodeURIComponent(name)}?${new URLSearchParams(params)}`);
  // A proxy in front of the app answers timeouts with an HTML page.
  const json = await response.json().catch(() => null);
  if (!json) throw new Error(`Query failed (HTTP ${response.status}${response.status === 504 ? ", timed out" : ""})`);
  if (!response.ok || json.error) throw new Error(json.error || json.detail || `Query failed (HTTP ${response.status})`);
  return Array.isArray(json.message?.results?.bindings) ? json.message.results.bindings : [];
}
