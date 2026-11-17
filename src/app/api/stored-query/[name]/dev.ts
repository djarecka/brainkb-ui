// Local preview only: answers the stored queries from the UI's own copies of
// them (taxonomy/queries.ts, literature/queries.ts) against DEV_SPARQL_ENDPOINT,
// so /taxonomy and /literature work without a query service. Same name ->
// query table and substitution as scripts/gen_stored_queries.py.
import * as taxonomy from '@/src/app/taxonomy/queries';
import * as literature from '@/src/app/literature/queries';
import * as browse from '@/src/app/browse/queries';

const QUERIES: Record<string, string> = {
    'taxonomy.taxa': taxonomy.TAXA_QUERY,
    'taxonomy.revisions': taxonomy.REVISIONS_QUERY,
    'taxonomy.markers': taxonomy.MARKERS_QUERY,
    'taxonomy.papers': taxonomy.PAPERS_QUERY,
    'taxonomy.marker_papers': taxonomy.MARKER_PAPERS_QUERY,
    'taxonomy.epigenome_summaries': taxonomy.EPI_SUMMARY_QUERY,
    'taxonomy.epigenome_tracks': taxonomy.EPI_TRACKS_QUERY,
    'taxonomy.epigenome_enhancers': taxonomy.EPI_ENHANCERS_QUERY,
    'taxonomy.clusters': taxonomy.CLUSTERS_QUERY,
    'taxonomy.cells': taxonomy.CELLS_QUERY,
    'taxonomy.cell_regions': taxonomy.CELL_REGIONS_QUERY,
    'taxonomy.cell_donors': taxonomy.CELL_DONORS_QUERY,
    'literature.papers': literature.PAPERS_QUERY,
    'literature.entities': literature.ENTITIES_QUERY,
    'literature.targets': literature.TARGETS_QUERY,
    'literature.mentions': literature.DETAIL_QUERY,
    'browse.entities': browse.ENTITIES_QUERY,
    'browse.detail': browse.DETAIL_QUERY,
    'browse.cluster_taxa': browse.CLUSTER_TAXA_QUERY,
};

export const devEndpoint = () =>
    process.env.NODE_ENV !== 'production' ? process.env.DEV_SPARQL_ENDPOINT : undefined;

export async function runStoredLocally(endpoint: string, name: string, params: URLSearchParams) {
    const template = QUERIES[name];
    if (!template) return { status: 404, body: { error: `Unknown stored query ${name}.` } };
    const graph = params.get('graph') ?? '';
    const iriList = (v: string) => v.split(/\s+/).filter(Boolean).map((i) => (i.startsWith('<') ? i : `<${i}>`)).join(' ');
    const query = template
        .replace(/\{\{(tax|ner|graph)\}\}/g, graph)
        .replace(/\{\{(summaries|clusters)\}\}/g, (_, k) => iriList(params.get(k) ?? ''))
        .replace(/\{\{(\w+)\}\}/g, (_, k) => params.get(k) ?? '');
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sparql-query', 'Accept': 'application/sparql-results+json' },
        body: query,
        cache: 'no-store', // Next caches fetch in GET handlers otherwise
    });
    if (!res.ok) return { status: 502, body: { error: `DEV_SPARQL_ENDPOINT: ${res.status} ${await res.text()}` } };
    return { status: 200, body: { message: await res.json() } };
}
