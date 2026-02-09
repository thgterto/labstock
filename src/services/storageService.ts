import { CatalogItem, Batch, Location, Category } from '../types';

export const STORAGE_KEYS = {
  CATALOG: 'labcontrol_catalog',
  BATCHES: 'labcontrol_batches',
  LOCATIONS: 'labcontrol_locations',
};

// Initial Seed Data
export const INITIAL_LOCATIONS: Location[] = [
  { id: 'LOC-001', name: 'Laboratório Principal', code: 'R101', type: 'room' },
  { id: 'LOC-002', name: 'Armário de Inflamáveis', code: 'CAB-FLM', type: 'cabinet' },
  { id: 'LOC-003', name: 'Câmara Fria -20C', code: 'FRZ-01', type: 'freezer' },
];

export const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: 'CAT-001',
    name: 'Acetona',
    category: 'CHEMICAL',
    casNumber: '67-64-1',
    molecularFormula: 'C3H6O',
    ghsPictograms: ['GHS02', 'GHS07'],
    ghsHazards: ['H225', 'H319', 'H336'],
    description: 'Solvente orgânico comum.',
    minStockLevel: 5,
  },
  {
    id: 'CAT-002',
    name: 'Ácido Sulfúrico',
    category: 'CHEMICAL',
    casNumber: '7664-93-9',
    molecularFormula: 'H2SO4',
    ghsPictograms: ['GHS05'],
    ghsHazards: ['H314'],
    description: 'Ácido mineral forte.',
    minStockLevel: 2,
  },
  {
    id: 'CAT-003',
    name: 'Béquer 500mL',
    category: 'GLASSWARE',
    ghsPictograms: [],
    ghsHazards: [],
    description: 'Béquer de vidro de borossilicato.',
    minStockLevel: 10,
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'BAT-001',
    catalogId: 'CAT-001',
    lotNumber: 'L2023-001',
    expiryDate: new Date('2025-12-31').getTime(),
    quantity: 4,
    unit: 'L',
    locationId: 'LOC-002',
    qaStatus: 'approved',
  },
  {
    id: 'BAT-002',
    catalogId: 'CAT-002',
    lotNumber: 'L2024-SA',
    expiryDate: new Date('2024-05-01').getTime(), // Expiring soon
    quantity: 1,
    unit: 'L',
    locationId: 'LOC-002',
    qaStatus: 'approved',
  }
];

export class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATALOG)) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_LOCATIONS));
    }
  }

  getCatalog(): CatalogItem[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATALOG) || '[]');
  }

  getBatches(): Batch[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BATCHES) || '[]');
  }

  getLocations(): Location[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]');
  }

  addCatalogItem(item: CatalogItem) {
    const items = this.getCatalog();
    items.push(item);
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(items));
  }

  addBatch(batch: Batch) {
    const batches = this.getBatches();
    batches.push(batch);
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }

  updateBatch(updatedBatch: Batch) {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === updatedBatch.id);
    if (index !== -1) {
      batches[index] = updatedBatch;
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    }
  }

  deleteBatch(batchId: string) {
    const batches = this.getBatches();
    const filtered = batches.filter(b => b.id !== batchId);
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(filtered));
  }

  // Helper to aggregate stock by catalog ID
  getInventorySummary(catalog?: CatalogItem[], batches?: Batch[]) {
    const items = catalog || this.getCatalog();
    const allBatches = batches || this.getBatches();
    
    return items.map(item => {
      const itemBatches = allBatches.filter(b => b.catalogId === item.id);
      const totalQuantity = itemBatches.reduce((sum, b) => sum + b.quantity, 0);
      return {
        ...item,
        totalQuantity,
        batches: itemBatches,
      };
    });
  }
}

export const db = new StorageService();