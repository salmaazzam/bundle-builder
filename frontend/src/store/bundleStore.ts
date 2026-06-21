import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ReviewLineItem } from '../types';

type Selections = Record<string, Record<string, number>>;

interface BundleStore {
  selections: Selections;
  activeVariants: Record<string, string>;
  currentStep: number;
  saveConfirmed: boolean;

  initDefaults: (products: Product[]) => void;
  setQuantity: (productId: string, variantId: string, qty: number) => void;
  selectSingle: (productId: string, stepProducts: Product[]) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  setStep: (step: number) => void;
  confirmSave: () => void;
  dismissSave: () => void;

  getVariantQty: (productId: string, variantId: string) => number;
  getActiveVariantId: (productId: string, fallback?: string) => string;
  getActiveQty: (productId: string) => number;
  getTotalQtyForProduct: (productId: string) => number;
  getSelectedCountForStep: (products: Product[]) => number;
  getReviewItems: (products: Product[]) => ReviewLineItem[];
}

export const useBundleStore = create<BundleStore>()(
  persist(
    (set, get) => ({
      selections: {},
      activeVariants: {},
      currentStep: 1,
      saveConfirmed: false,

      initDefaults: (products) => {
        if (Object.keys(get().selections).length > 0) return;

        const selections: Selections = {};
        const activeVariants: Record<string, string> = {};

        for (const p of products) {
          const variantId = p.defaultVariantId ?? p.variants?.[0]?.id ?? 'default';
          activeVariants[p.id] = variantId;

          if (p.singleSelect && p.defaultSelected) {
            selections[p.id] = { [variantId]: 1 };
          } else if (!p.singleSelect && p.defaultQty && p.defaultQty > 0) {
            selections[p.id] = { [variantId]: p.defaultQty };
          }
        }

        set({ selections, activeVariants });
      },

      setQuantity: (productId, variantId, qty) => {
        set((state) => ({
          selections: {
            ...state.selections,
            [productId]: {
              ...state.selections[productId],
              [variantId]: Math.max(0, qty),
            },
          },
        }));
      },

      selectSingle: (productId, stepProducts) => {
        set((state) => {
          const next: Selections = { ...state.selections };
          for (const p of stepProducts) {
            if (p.singleSelect) {
              const vId = state.activeVariants[p.id] ?? p.variants?.[0]?.id ?? 'default';
              next[p.id] = { [vId]: p.id === productId ? 1 : 0 };
            }
          }
          return { selections: next };
        });
      },

      setActiveVariant: (productId, variantId) => {
        set((state) => ({
          activeVariants: { ...state.activeVariants, [productId]: variantId },
        }));
      },

      setStep: (step) => set({ currentStep: step }),

      confirmSave: () => set({ saveConfirmed: true }),
      dismissSave: () => set({ saveConfirmed: false }),

      getVariantQty: (productId, variantId) =>
        get().selections[productId]?.[variantId] ?? 0,

      getActiveVariantId: (productId, fallback = 'default') =>
        get().activeVariants[productId] ?? fallback,

      getActiveQty: (productId) => {
        const state = get();
        const variantId = state.activeVariants[productId] ?? 'default';
        return state.selections[productId]?.[variantId] ?? 0;
      },

      getTotalQtyForProduct: (productId) => {
        const slots = get().selections[productId] ?? {};
        return Object.values(slots).reduce((sum, q) => sum + q, 0);
      },

      getSelectedCountForStep: (products) => {
        const state = get();
        return products.filter((p) => {
          const total = Object.values(state.selections[p.id] ?? {}).reduce(
            (s, q) => s + q,
            0
          );
          return total > 0;
        }).length;
      },

      getReviewItems: (products) => {
        const state = get();
        const items: ReviewLineItem[] = [];

        for (const p of products) {
          const slots = state.selections[p.id] ?? {};
          for (const [variantId, qty] of Object.entries(slots)) {
            if (qty <= 0) continue;
            const variant = p.variants?.find((v) => v.id === variantId);
            items.push({
              productId: p.id,
              variantId,
              name: p.name,
              variantName: variant?.name,
              image: p.image,
              price: p.price,
              comparePrice: p.comparePrice,
              priceSuffix: p.priceSuffix,
              qty,
              singleSelect: p.singleSelect,
              stepId: p.stepId,
            });
          }
        }

        return items;
      },
    }),
    {
      name: 'bundle-builder-state',
      partialize: (state) => ({
        selections: state.selections,
        activeVariants: state.activeVariants,
        currentStep: state.currentStep,
      }),
    }
  )
);
