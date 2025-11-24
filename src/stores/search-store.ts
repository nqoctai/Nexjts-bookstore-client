import { create } from "zustand";

interface SearchState {
    searchValue: string;
    setSearchValue: (value: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchValue: "",
    setSearchValue: (value) => set({ searchValue: value }),
}));
