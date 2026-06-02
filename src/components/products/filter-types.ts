import type { ProductCategory, ResearchGoal } from "@/lib/mock-products";

export interface FilterState {
  search: string;
  categories: ProductCategory[];
  goals: ResearchGoal[];
  priceBands: string[]; // PriceBand ids
  inStockOnly: boolean;
  subscriptionOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  search: "",
  categories: [],
  goals: [],
  priceBands: [],
  inStockOnly: false,
  subscriptionOnly: false,
};

export function filtersActive(f: FilterState): boolean {
  return (
    f.search.trim() !== "" ||
    f.categories.length > 0 ||
    f.goals.length > 0 ||
    f.priceBands.length > 0 ||
    f.inStockOnly ||
    f.subscriptionOnly
  );
}
