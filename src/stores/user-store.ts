import { create } from "zustand";
import { AccountResType } from "@/schemaValidations/auth.schema";

type UserState = {
    user: AccountResType["data"]["account"] | null;
    tempAvatar: string | null;
    setUser: (user: AccountResType["data"]["account"] | null) => void;
    setTempAvatar: (avatar: string) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    tempAvatar: null,
    setUser: (user) => set({ user }),
    setTempAvatar: (avatar) => set({ tempAvatar: avatar }),
    clearUser: () => set({ user: null, tempAvatar: null }),
}));
