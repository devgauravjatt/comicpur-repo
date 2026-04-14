import { create } from 'zustand';
import { chaptersListAndAction } from '@/app/actions';
import { webDataType } from '@/types';

interface ChaptersTableState {
  comicId: number;
  currentPage: number;
  chapters: webDataType['chapter'][];
  totalPages: number;
  isLoading: boolean;
  setComicId: (comicId: number) => void;
  setCurrentPage: (page: number) => void;
  fetchChapters: () => Promise<void>;
}

const useChaptersTableStore = create<ChaptersTableState>((set, get) => ({
  comicId: 0,
  currentPage: 1,
  chapters: [],
  totalPages: 0,
  isLoading: false,

  // Just update state — component's useEffect handles fetching
  setComicId: (comicId) => {
    const currentId = get().comicId;
    if (currentId !== comicId) {
      set({ comicId, currentPage: 1 });
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  fetchChapters: async () => {
    const { comicId, currentPage } = get();
    set({ isLoading: true });

    try {
      const response = await chaptersListAndAction(currentPage, comicId);

      if (response?.success && response.data) {
        set({
          chapters: response.data.chapters,
          totalPages: response.data.totalPages,
          isLoading: false,
        });
      } else {
        set({ chapters: [], totalPages: 0, isLoading: false });
      }
    } catch (err) {
      set({ chapters: [], totalPages: 0, isLoading: false });
      console.error('fetchComics error:', err);
    }
  },
}));

export default useChaptersTableStore;
