import { CatalogItem, Batch, Location, Category } from '../types';

const STORAGE_KEYS = {
  CATALOG: 'labcontrol_catalog',
  BATCHES: 'labcontrol_batches',
  LOCATIONS: 'labcontrol_locations',
};

// Initial Seed Data
const INITIAL_LOCATIONS: Location[] = [
  { id: 'LOC-001', name: 'Main Lab Room', code: 'R101', type: 'room' },
  { id: 'LOC-002', name: 'Flammables Cabinet', code: 'CAB-FLM', type: 'cabinet' },
  { id: 'LOC-003', name: 'Cold Storage -20C', code: 'FRZ-01', type: 'freezer' },
];

const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: 'CAT-001',
    name: 'Acetone',
    category: 'CHEMICAL',
    casNumber: '67-64-1',
    molecularFormula: 'C3H6O',
    ghsPictograms: ['GHS02', 'GHS07'],
    ghsHazards: ['H225', 'H319', 'H336'],
    description: 'Common organic solvent.',
    minStockLevel: 5,
  },
  {
    id: 'CAT-002',
    name: 'Sulfuric Acid',
    category: 'CHEMICAL',
    casNumber: '7664-93-9',
    molecularFormula: 'H2SO4',
    ghsPictograms: ['GHS05'],
    ghsHazards: ['H314'],
    description: 'Strong mineral acid.',
    minStockLevel: 2,
  },
  {
    id: 'CAT-003',
    name: 'Beaker 500mL',
    category: 'GLASSWARE',
    ghsPictograms: [],
    ghsHazards: [],
    description: 'Borosilicate glass beaker.',
    minStockLevel: 10,
  }
];

const INITIAL_BATCHES: Batch[] = [
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

class StorageService {
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
  getInventorySummary() {
    const catalog = this.getCatalog();
    const batches = this.getBatches();
    
    return catalog.map(item => {
      const itemBatches = batches.filter(b => b.catalogId === item.id);
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