import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  StorageService,
  STORAGE_KEYS,
  INITIAL_CATALOG,
  INITIAL_BATCHES,
  INITIAL_LOCATIONS
} from './storageService';

describe('StorageService Initialization', () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let getItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes default data when localStorage is empty', () => {
    new StorageService();

    // Verify checks for existence
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEYS.CATALOG);
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEYS.BATCHES);
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEYS.LOCATIONS);

    // Verify initialization
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEYS.CATALOG,
      JSON.stringify(INITIAL_CATALOG)
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEYS.BATCHES,
      JSON.stringify(INITIAL_BATCHES)
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEYS.LOCATIONS,
      JSON.stringify(INITIAL_LOCATIONS)
    );
  });

  it('does not overwrite existing data in localStorage', () => {
    // Setup existing data
    const dummyData = JSON.stringify([{ id: 'existing' }]);
    localStorage.setItem(STORAGE_KEYS.CATALOG, dummyData);
    localStorage.setItem(STORAGE_KEYS.BATCHES, dummyData);
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, dummyData);

    // Clear the setItem calls from setup
    setItemSpy.mockClear();

    new StorageService();

    // Should still check
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEYS.CATALOG);

    // Should NOT set
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('initializes only missing keys', () => {
    // Setup partial data (only Catalog exists)
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    setItemSpy.mockClear();

    new StorageService();

    // Catalog should not be touched
    expect(setItemSpy).not.toHaveBeenCalledWith(STORAGE_KEYS.CATALOG, expect.any(String));

    // Others should be initialized
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEYS.BATCHES,
      JSON.stringify(INITIAL_BATCHES)
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEYS.LOCATIONS,
      JSON.stringify(INITIAL_LOCATIONS)
    );
  });
});
