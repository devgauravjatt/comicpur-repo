import { create } from 'zustand';
import { premiumListAndSearchAction } from '@/app/actions';
import { webDataType } from '@/types';

interface PremiumTableState {
  search: string;
  active: string | undefined;
  currentPage: string;
  premiums: webDataType['premium'][];
  totalPages: number;
  isLoading: boolean;
  setSearch: (search: string) => void;
  setActive: (active: string | undefined) => void;
  setCurrentPage: (page: string) => void;
  clearFilters: () => void;
  fetchPremiums: () => Promise<void>;
}

const usePremiumTableStore = create<PremiumTableState>((set, get) => ({
  search: '',
  active: undefined,
  currentPage: '1',
  premiums: [],
  totalPages: 0,
  isLoading: false,

  setSearch: (search) => set({ search, currentPage: '1' }),

  setActive: (active) => set({ active, currentPage: '1' }),

  setCurrentPage: (page) => set({ currentPage: page }),

  clearFilters: () => set({ search: '', active: undefined, currentPage: '1' }),

  fetchPremiums: async () => {
    const { search, active, currentPage } = get();
    set({ isLoading: true });

    try {
      const response = await premiumListAndSearchAction({
        userMail: search || undefined,
        active: active || undefined,
        page: currentPage,
      });

      if (response?.success && response.data) {
        set({
          premiums: response.data.premiumSubscriptions || [],
          totalPages: response.data.totalPages || 0,
          isLoading: false,
        });
      } else {
        set({ premiums: [], totalPages: 0, isLoading: false });
      }
    } catch (err) {
      set({ premiums: [], totalPages: 0, isLoading: false });
      console.error('fetchPremiums error:', err);
    }
  },
}));

export default usePremiumTableStore;
