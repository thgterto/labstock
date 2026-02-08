import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db } from './storageService';
import { Batch } from '../types';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('addBatch', () => {
    it('should add a new batch to localStorage', () => {
      const mockBatch: Batch = {
        id: 'BAT-TEST-001',
        catalogId: 'CAT-001',
        lotNumber: 'L2024-TEST',
        expiryDate: new Date('2025-12-31').getTime(),
        quantity: 10,
        unit: 'L',
        locationId: 'LOC-001',
        qaStatus: 'approved'
      };

      db.addBatch(mockBatch);

      const storedBatches = JSON.parse(localStorage.getItem('labcontrol_batches') || '[]');
      expect(storedBatches).toHaveLength(1);
      expect(storedBatches[0]).toEqual(mockBatch);
    });

    it('should append a batch to existing batches', () => {
      const batch1: Batch = {
        id: 'BAT-1',
        catalogId: 'CAT-1',
        lotNumber: 'L1',
        quantity: 5,
        unit: 'kg',
        locationId: 'LOC-1',
        qaStatus: 'approved'
      };

      const batch2: Batch = {
          id: 'BAT-2',
          catalogId: 'CAT-1',
          lotNumber: 'L2',
          quantity: 3,
          unit: 'kg',
          locationId: 'LOC-1',
          qaStatus: 'quarantine'
      };

      db.addBatch(batch1);
      db.addBatch(batch2);

      const storedBatches = JSON.parse(localStorage.getItem('labcontrol_batches') || '[]');
      expect(storedBatches).toHaveLength(2);
      expect(storedBatches[0]).toEqual(batch1);
      expect(storedBatches[1]).toEqual(batch2);
    });
  });
});
