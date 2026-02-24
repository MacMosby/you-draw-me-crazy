import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Role = "drawer" | "guesser" | null;

type User = {
  id: number;
  email: string;
  username: string;
};

type SessionState = {
  accessToken: string | null;
  user: User | null;
  roomId: number | null;
  role: Role;

  setAuth: (token: string | null, user: User | null) => void;
  setRoom: (roomId: number | null) => void;
  setRole: (role: Role) => void;

  logout: () => void;
  clearRoom: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      roomId: null,
      role: null,

      setAuth: (accessToken, user) => set({ accessToken, user }),
      setRoom: (roomId) => set({ roomId }),
      setRole: (role) => set({ role }),

      logout: () => set({ accessToken: null, user: null, roomId: null, role: null }),
      clearRoom: () => set({ roomId: null, role: null }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    }
  )
);
