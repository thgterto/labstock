import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from './storageService';
import { CatalogItem } from '../types';

describe('StorageService CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Re-init db to populate initial data if needed, or we can just manipulate it
    // But since db is a singleton instantiated at module level, we might need to be careful.
    // However, storageService reads from localStorage on every getCatalog() call.
  });

  it('should update a catalog item', () => {
    const newItem: CatalogItem = {
      id: 'TEST-1',
      name: 'Original Name',
      category: 'CHEMICAL',
      minStockLevel: 10,
      description: 'Test',
      ghsPictograms: [],
      ghsHazards: []
    };

    db.addCatalogItem(newItem);

    let catalog = db.getCatalog();
    expect(catalog.find(i => i.id === 'TEST-1')?.name).toBe('Original Name');

    const updatedItem: CatalogItem = {
      ...newItem,
      name: 'Updated Name',
      minStockLevel: 20
    };

    db.updateCatalogItem(updatedItem);

    catalog = db.getCatalog();
    const item = catalog.find(i => i.id === 'TEST-1');
    expect(item?.name).toBe('Updated Name');
    expect(item?.minStockLevel).toBe(20);
  });

  it('should delete a catalog item', () => {
    const newItem: CatalogItem = {
      id: 'TEST-2',
      name: 'To Delete',
      category: 'GLASSWARE',
      minStockLevel: 5,
      description: 'Test',
      ghsPictograms: [],
      ghsHazards: []
    };

    db.addCatalogItem(newItem);

    let catalog = db.getCatalog();
    expect(catalog.find(i => i.id === 'TEST-2')).toBeDefined();

    db.deleteCatalogItem('TEST-2');

    catalog = db.getCatalog();
    expect(catalog.find(i => i.id === 'TEST-2')).toBeUndefined();
  });
});
