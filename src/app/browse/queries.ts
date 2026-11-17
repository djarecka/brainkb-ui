// Stored-query versions of the /browse queries, for pages whose graph is too
// large for the signed-out space fallback (Patch-seq lives in
// bican-basal-ganglia). The query service runs them as stored queries
// (core/stored_queries.py in BrainKB), generated from this file by
// scripts/gen_stored_queries.py — rerun it and redeploy the query service after
// changing a query here. {{graph}} is the page's graph; the other parameters
// are IRIs, validated by the query service.

const PREFIXES = `PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX bican: <https://identifiers.org/brain-bican/vocab/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`;

export const LIMITS = { ENTITIES: 2000, DETAIL: 2000, CLUSTER_TAXA: 500 };

// The entities of one class ({{category}}, an IRI-valued biolink:category),
// with their label and description.
export const ENTITIES_QUERY = `${PREFIXES}
SELECT ?id (SAMPLE(?label) AS ?name) (SAMPLE(?desc) AS ?description)
WHERE {
  GRAPH <{{graph}}> {
    ?id biolink:category <{{category}}> .
    OPTIONAL { ?id rdfs:label ?label }
    OPTIONAL { ?id dct:description ?desc }
  }
}
GROUP BY ?id
ORDER BY ?name ?id
LIMIT ${LIMITS.ENTITIES}`;

// One entity's detail view ({{id}}): its own triples, what points at it, and
// each neighbour's class and label. Data that links by IRI only, so none of the
// typed-literal branches of the default detail query.
export const DETAIL_QUERY = `${PREFIXES}
SELECT DISTINCT ?direction ?predicate ?other ?otherCategory ?otherLabel
WHERE {
  GRAPH <{{graph}}> {
    { BIND("out" AS ?direction) <{{id}}> ?predicate ?other . }
    UNION
    { BIND("in" AS ?direction) ?other ?predicate <{{id}}> . }
    UNION
    { BIND("class" AS ?direction) <{{id}}> ?predicate ?other . ?other biolink:category ?otherCategory . }
    UNION
    { BIND("class" AS ?direction) ?other ?predicate <{{id}}> . ?other biolink:category ?otherCategory . }
    UNION
    { BIND("label" AS ?direction) <{{id}}> ?predicate ?other . FILTER(isIRI(?other)) ?other rdfs:label ?otherLabel . }
    UNION
    { BIND("label" AS ?direction) ?other ?predicate <{{id}}> . ?other rdfs:label ?otherLabel . }
  }
}
LIMIT ${LIMITS.DETAIL}`;

// Each cluster's named taxa ({{clusters}}, a list of cluster IRIs), with the
// level order; the deepest one is the cell type /taxonomy opens on.
// has_parent+, because a cluster may point only at its cluster-level taxon.
export const CLUSTER_TAXA_QUERY = `${PREFIXES}
SELECT ?cluster ?taxon ?order
WHERE {
  VALUES ?cluster { {{clusters}} }
  GRAPH <{{graph}}> {
    ?cluster bican:has_parent+ ?taxon .
    ?taxon bican:accession_id ?accession ;
           bican:part_of_set/bican:order ?order .
  }
}
LIMIT ${LIMITS.CLUSTER_TAXA}`;
