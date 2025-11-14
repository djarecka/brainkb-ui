"use client";
import {useState, useEffect} from 'react';
import {Database, Loader2, AlertCircle, ChevronLeft, ChevronRight, ExternalLink, Search} from "lucide-react";
import {useFilteredTableData} from "@/src/app/utils/tableFilterUtils";

const ITEMS_PER_PAGE = 50;

const KnowledgeBase = (
    {
        params,
    }: {
        params: {
            slug: string;
        }
    }
) => {
    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagetitle, setPageTitle] = useState("");
    const [pagesubtitle, setSubPageTitle] = useState("");
    const [entityPageSlug, setEntityPageSlug] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [categoryColumnIndex, setCategoryColumnIndex] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        setData([]);
        setHeaders([]);
        setPageTitle("");
        setSubPageTitle("");
        setEntityPageSlug("");
        setCategoryColumnIndex(null);
        const page = yaml.pages.find((page) => page.slug === "default");
        const query_to_execute = page ? page.sparql_query : "";
        const entitypage = page ? page.entitypageslug : "";
        setEntityPageSlug(entitypage);
        const page_title = page ? page.page : "";
        const page_sub_title = page ? page.description : "";
        const filter_index = page ? page.column_filter_index : null;
        setPageTitle(page_title);
        setSubPageTitle(page_sub_title);
        setCategoryColumnIndex(filter_index);

        const queryParameter = {sparql_query: query_to_execute};

        try {
            // Fetch from API route which handles server-side caching
            const response = await fetch('/api/knowledge-base?slug=default');
            const result = await response.json();
            
            if (result.success) {
                setData(result.data || []);
                setHeaders(result.headers || []);
                setPageTitle(result.pageTitle || "");
                setSubPageTitle(result.pageSubtitle || "");
                setEntityPageSlug(result.entityPageSlug || "");
            } else {
                setError(result.error || "Failed to fetch data");
            }
        } catch (e) {
            const error = e as Error;
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get unique category values from the specified column
    const categoryOptions = categoryColumnIndex !== null && headers[categoryColumnIndex] 
        ? Array.from(new Set(
            data
                .map(item => {
                    const value = item[headers[categoryColumnIndex]]?.value || '';
                    return value ? value.substring(value.lastIndexOf('/') + 1) : '';
                })
                .filter(v => v !== '')
        )).sort()
        : [];

    // Calculate filtered data for pagination (combines text search and category filter)
    const textFilteredData = useFilteredTableData(data, headers, searchQuery);
    
    // Apply category filter if set
    const filteredData = categoryFilter && categoryColumnIndex !== null && headers[categoryColumnIndex]
        ? textFilteredData.filter((item: any) => {
            const value = item[headers[categoryColumnIndex]]?.value || '';
            const displayValue = value ? value.substring(value.lastIndexOf('/') + 1) : '';
            return displayValue === categoryFilter;
        })
        : textFilteredData;
    
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const renderTable = () => {
        if (!data || !Array.isArray(data) || data.length === 0) return null;

        // Use the filtered data from the hook
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentPageData = filteredData.slice(startIndex, endIndex);
        
        // Reset to first page when search changes
        if (currentPage > Math.ceil(filteredData.length / ITEMS_PER_PAGE) && filteredData.length > 0) {
            setCurrentPage(1);
        }

        // Column width configuration: map column index to desired width
        // Example: { 1: '100px', 2: '150px' } sets column 2 to 100px and column 3 to 150px
        const columnWidths: Record<number, string> = {
            1: '160px',  // Second column (index 1)
            // Add more columns as needed:
            // 2: '150px',  // Third column (index 2)
            // 3: '80px',   // Fourth column (index 3)
        };

        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                            {headers.map((header, index) => (
                                <col 
                                    key={index}
                                    style={{ 
                                        width: columnWidths[index] || undefined 
                                    }}
                                />
                            ))}
                        </colgroup>
                        <thead className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentPageData.map((item, index) => {
                                // Use the first header's value as a unique identifier, or fallback to id if available
                                const uniqueKey = item.id?.value || item[headers[0]]?.value || index;
                                return (
                                <tr key={uniqueKey} className="hover:bg-sky-50/50 transition-colors duration-150">
                                    {headers.map((header, headerIndex) => {
                                        const cellValue = item[header]?.value || '';
                                        const displayValue = cellValue ? cellValue.substring(cellValue.lastIndexOf('/') + 1) : '';
                                        
                                        const columnWidth = columnWidths[headerIndex];
                                        return (
                                            <td 
                                                key={headerIndex} 
                                                className={`py-4 ${columnWidth ? 'px-2' : 'px-6'} whitespace-nowrap`}
                                                style={columnWidth ? { 
                                                    maxWidth: columnWidth, 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis' 
                                                } : undefined}
                                            >
                                                {headerIndex === 0 ? (
                                                    <a 
                                                        href={`knowledge-base/${entityPageSlug}/${encodeURIComponent(cellValue)}`}
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors group"
                                                    >
                                                        {displayValue}
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-700">
                                                        {displayValue}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="kb-page-margin">


            {/* Hero Section */}
            <div className="grid grid-cols-1 mb-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-transparent"></div>
                    <div className="relative px-8 py-12">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {pagetitle || "Knowledge Base"}
                        </h1>
                        {pagesubtitle && (
                            <p className="text-sky-100 text-base leading-relaxed">
                                {pagesubtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1" >
                {/* Search Bar and Category Filter */}
                {!loading && !error && data.length > 0 && (
                    <div className="mb-6 space-y-4">
                        <div className="flex gap-4 flex-col sm:flex-row">
                            {/* Text Search */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search across all columns..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                />
                            </div>
                            
                            {/* Category Filter Dropdown */}
                            {categoryColumnIndex !== null && headers[categoryColumnIndex] && categoryOptions.length > 0 && (
                                <div className="sm:w-64">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    >
                                        <option value="">All {headers[categoryColumnIndex]}</option>
                                        {categoryOptions.map((option, idx) => (
                                            <option key={idx} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        {(searchQuery.trim() !== "" || categoryFilter !== "") && (
                            <p className="text-sm text-gray-600">
                                Showing {filteredData.length} of {data.length} results
                                {categoryFilter && (
                                    <span className="ml-2">
                                        (filtered by: {' '}
                                        <a 
                                            href={`https://brain-bican.github.io/models/${categoryFilter.replace(/^bican:/, '')}/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-sky-600 hover:text-sky-700 underline"
                                        >
                                            {categoryFilter}
                                        </a>
                                        )
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
                        <p className="text-gray-600">Loading knowledge base data...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {renderTable()}

                        {filteredData.length > 0 && (
                            <nav className="flex items-center flex-wrap md:flex-row justify-between pt-6 gap-4"
                                 aria-label="Table navigation">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span
                                    className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span
                                    className="font-semibold text-gray-900">{filteredData.length}</span> entries
                                    {searchQuery.trim() !== "" && data.length !== filteredData.length && (
                                        <span className="text-gray-500"> (filtered from {data.length} total)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({length: Math.min(totalPages, 10)}, (_, index) => {
                                            let pageNum;
                                            if (totalPages <= 10) {
                                                pageNum = index + 1;
                                            } else if (currentPage <= 5) {
                                                pageNum = index + 1;
                                            } else if (currentPage >= totalPages - 4) {
                                                pageNum = totalPages - 9 + index;
                                            } else {
                                                pageNum = currentPage - 5 + index;
                                            }
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-sky-600 text-white shadow-md'
                                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </nav>
                        )}

                        {!loading && !error && filteredData.length === 0 && searchQuery.trim() !== "" && (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl font-semibold text-gray-600 mb-2">No results found</p>
                                <p className="text-gray-500">Try adjusting your search query.</p>
                            </div>
                        )}

                        {!loading && !error && data.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl font-semibold text-gray-600 mb-2">No data available</p>
                                <p className="text-gray-500">There are no entries in this knowledge base yet.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBase;

