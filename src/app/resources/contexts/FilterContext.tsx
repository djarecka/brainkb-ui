'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  searchTerm: string;
  selectedCategories: string[];
}

interface FilterContextType {
  filters: FilterState;
  setSearchTerm: (term: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  clearAllFilters: () => void;
}

//const FilterContext = createContext<FilterContextType | undefined>(undefined);
const FilterContext = createContext<FilterContextType>(undefined);


export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: [],
  });

  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };





  const setSelectedCategories = (categories: string[]) => {
    setFilters(prev => ({ ...prev, selectedCategories: categories }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategories: [],
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchTerm,
        setSelectedCategories,
        clearAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
    console.log("Filter Context", FilterContext);
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

