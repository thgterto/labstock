import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BatchForm from './BatchForm';
import { db } from '../services/storageService';
import { CatalogItem, Location } from '../types';

// Mock the storage service
vi.mock('../services/storageService', () => ({
  db: {
    getCatalog: vi.fn(),
    getLocations: vi.fn(),
    addBatch: vi.fn(),
    updateBatch: vi.fn(),
  },
}));

const mockCatalog: CatalogItem[] = [
  {
    id: 'CAT-001',
    name: 'Test Item',
    category: 'CHEMICAL',
    ghsPictograms: [],
    ghsHazards: [],
    minStockLevel: 5,
  },
];

const mockLocations: Location[] = [
  {
    id: 'LOC-001',
    name: 'Test Location',
    code: 'T01',
    type: 'room',
  },
];

describe('BatchForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (db.getCatalog as any).mockReturnValue(mockCatalog);
    (db.getLocations as any).mockReturnValue(mockLocations);
  });

  it('prevents submission when required fields are missing', () => {
    render(<BatchForm onClose={mockOnClose} onSave={mockOnSave} />);

    // Try to submit without filling any fields
    const submitButton = screen.getByText('Receber Lote');
    fireEvent.click(submitButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(db.addBatch).not.toHaveBeenCalled();
  });

  it('allows submission when all required fields are filled', () => {
    render(<BatchForm onClose={mockOnClose} onSave={mockOnSave} />);

    // Fill in required fields
    // Select Catalog Item
    const catalogSelect = screen.getByLabelText(/Item do Catálogo/i);
    fireEvent.change(catalogSelect, { target: { value: 'CAT-001' } });

    // Fill Lot Number
    const lotInput = screen.getByLabelText(/Número do Lote/i);
    fireEvent.change(lotInput, { target: { value: 'L-123' } });

    // Select Location
    const locationSelect = screen.getByLabelText(/Localização/i);
    fireEvent.change(locationSelect, { target: { value: 'LOC-001' } });

    // Fill Quantity
    const quantityInput = screen.getByLabelText(/Quantidade/i);
    fireEvent.change(quantityInput, { target: { value: '10' } });

    // Submit
    const submitButton = screen.getByText('Receber Lote');
    fireEvent.click(submitButton);

    expect(mockOnSave).toHaveBeenCalled();
    expect(db.addBatch).toHaveBeenCalledWith(expect.objectContaining({
      catalogId: 'CAT-001',
      lotNumber: 'L-123',
      locationId: 'LOC-001',
      quantity: 10,
    }));
  });
});
