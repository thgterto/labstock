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

export interface Batch {
  id: string;
  catalogId: string;
  lotNumber: string;
  expiryDate?: number; // Unix timestamp
  quantity: number;
  unit: string;
  locationId: string;
  qaStatus: 'approved' | 'quarantine' | 'rejected' | 'expired';
}

export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'room' | 'cabinet' | 'shelf' | 'freezer';
}

export interface AIAnalysisResult {
  casNumber?: string;
  molecularFormula?: string;
  ghsPictograms: string[];
  ghsHazards: string[];
  description?: string;
  safetyNote?: string;
}
