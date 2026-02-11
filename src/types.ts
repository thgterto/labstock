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

export type BatchUnit = 'L' | 'mL' | 'g' | 'kg' | 'units' | 'pcs';

export const BATCH_UNITS: { value: BatchUnit; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'units', label: 'unidades' },
  { value: 'pcs', label: 'pçs' },
];

export interface Batch {
  id: string;
  catalogId: string;
  lotNumber: string;
  expiryDate?: number; // Unix timestamp
  quantity: number;
  unit: BatchUnit;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  initials: string;
}
