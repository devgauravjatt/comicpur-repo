import { create } from 'zustand';

interface LoginState {
  login: boolean;
  toggleLogin: () => void;
}

const userLoginStore = create<LoginState>((set) => ({
  login: true,
  toggleLogin: () => set((state) => ({ login: !state.login })),
}));

export default userLoginStore;
