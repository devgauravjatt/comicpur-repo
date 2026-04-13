import { create } from 'zustand';
import { comicsListAndSearchAction } from '@/app/actions';
import { Comic } from '@/types/comic';

interface ComicsTableState {
  search: string;
  currentPage: number;
  comics: Comic[];
  totalPages: number;
  isLoading: boolean;
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  clearSearch: () => void;
  fetchComics: () => Promise<void>;
}

const useComicsTableStore = create<ComicsTableState>((set, get) => ({
  search: '',
  currentPage: 1,
  comics: [],
  totalPages: 0,
  isLoading: false,

  // Just update state — component's useEffect handles fetching
  setSearch: (search) => set({ search, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  clearSearch: () => set({ search: '', currentPage: 1 }),

  fetchComics: async () => {
    const { search, currentPage } = get();
    set({ isLoading: true });

    try {
      const response = await comicsListAndSearchAction(currentPage, search || undefined);

      if (response?.success && response.data) {
        set({
          comics: response.data.comics,
          totalPages: response.data.totalPages,
          isLoading: false,
        });
      } else {
        set({ comics: [], totalPages: 0, isLoading: false });
      }
    } catch (err) {
      set({ comics: [], totalPages: 0, isLoading: false });
      console.error('fetchComics error:', err);
    }
  },
}));

export default useComicsTableStore;
