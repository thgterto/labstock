export type Category = 'CHEMICAL' | 'EQUIPMENT' | 'TOOL' | 'ADMINISTRATIVE' | 'GLASSWARE';

export interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  casNumber?: string;
  molecularFormula?: string;
  ghsPictograms: string[]; // e.g., ["GHS02", "GHS06"]
  ghsHazards: string[];
  description?: string;
  manufacturer?: string;
  minStockLevel: number;
}
