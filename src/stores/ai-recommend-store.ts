import { create } from "zustand";


type PositionType = "home" | "search" | "cart";

interface RecommendedProduct {
    productId: number;
    position: PositionType;
}

interface AIRecommendState {
    recommendedProducts: Map<number, PositionType>;
    addRecommendedProducts: (productIds: number[], position: PositionType) => void;
    isRecommended: (productId: number) => boolean;
    getProductPosition: (productId: number) => PositionType | null;
    clearRecommendedProducts: () => void;
}

export const useAIRecommendStore = create<AIRecommendState>((set, get) => ({
    recommendedProducts: new Map(),

    addRecommendedProducts: (productIds: number[], position: PositionType) => {
        set((state) => {
            const newMap = new Map(state.recommendedProducts);
            productIds.forEach((id) => {
                newMap.set(id, position);
            });
            return { recommendedProducts: newMap };
        });
    },

    isRecommended: (productId: number) => {
        return get().recommendedProducts.has(productId);
    },

    getProductPosition: (productId: number) => {
        return get().recommendedProducts.get(productId) || null;
    },

    clearRecommendedProducts: () => {
        set({ recommendedProducts: new Map() });
    },
}));

export const getAIRecommendStore = () => useAIRecommendStore.getState();