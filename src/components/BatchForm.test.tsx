import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BatchForm from './BatchForm';
import { db } from '../services/storageService';
import { Batch, CatalogItem, Location } from '../types';

// Mock storage service
vi.mock('../services/storageService', () => ({
  db: {
    getCatalog: vi.fn(),
    getLocations: vi.fn(),
    addBatch: vi.fn(),
    updateBatch: vi.fn(),
  },
}));

describe('BatchForm', () => {
  const mockCatalog: CatalogItem[] = [
    {
      id: 'CAT-001',
      name: 'Acetone',
      category: 'CHEMICAL',
      ghsPictograms: [],
      ghsHazards: [],
      minStockLevel: 5,
    },
    {
      id: 'CAT-002',
      name: 'Beaker',
      category: 'GLASSWARE',
      ghsPictograms: [],
      ghsHazards: [],
      minStockLevel: 10,
    },
  ];

  const mockLocations: Location[] = [
    { id: 'LOC-001', name: 'Main Lab', code: 'R1', type: 'room' },
    { id: 'LOC-002', name: 'Cabinet A', code: 'C1', type: 'cabinet' },
  ];

  const defaultProps = {
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (db.getCatalog as any).mockReturnValue(mockCatalog);
    (db.getLocations as any).mockReturnValue(mockLocations);
  });

  it('renders correctly for new batch', () => {
    render(<BatchForm {...defaultProps} />);

    expect(screen.getByText('Receber Novo Lote')).toBeInTheDocument();
    expect(screen.getByText('Receber Lote')).toBeInTheDocument();

    // Check for inputs (checking labels exist)
    expect(screen.getByText('Item do Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Número do Lote')).toBeInTheDocument();
    expect(screen.getByText('Validade')).toBeInTheDocument();
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
    expect(screen.getByText('Unidade')).toBeInTheDocument();
    expect(screen.getByText('Status de QA')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
  });

  it('validates required fields', () => {
    render(<BatchForm {...defaultProps} />);

    const submitBtn = screen.getByText('Receber Lote');
    fireEvent.click(submitBtn);

    expect(db.addBatch).not.toHaveBeenCalled();
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('calls addBatch when submitting new batch', () => {
    render(<BatchForm {...defaultProps} />);

    // Selects: 0: Catalog, 1: Unit, 2: QA Status, 3: Location
    const selects = screen.getAllByRole('combobox');

    // Catalog
    fireEvent.change(selects[0], { target: { value: 'CAT-001' } });

    // Text inputs: Lot Number is the first 'textbox'
    // Note: input type="text" is textbox. type="number" is spinbutton. type="date" has no implicit role usually but we can use simple selectors if needed.
    const textInputs = screen.getAllByRole('textbox');
    const lotInput = textInputs[0];
    fireEvent.change(lotInput, { target: { value: 'L123' } });

    // Quantity (type="number")
    const qtyInput = screen.getByRole('spinbutton');
    fireEvent.change(qtyInput, { target: { value: '10' } });

    // Unit
    fireEvent.change(selects[1], { target: { value: 'L' } });

    // QA Status
    fireEvent.change(selects[2], { target: { value: 'quarantine' } });

    // Location
    fireEvent.change(selects[3], { target: { value: 'LOC-001' } });

    // Submit
    fireEvent.click(screen.getByText('Receber Lote'));

    expect(db.addBatch).toHaveBeenCalledTimes(1);
    expect(db.addBatch).toHaveBeenCalledWith(expect.objectContaining({
      catalogId: 'CAT-001',
      lotNumber: 'L123',
      quantity: 10,
      unit: 'L',
      locationId: 'LOC-001',
      qaStatus: 'quarantine',
    }));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('calls updateBatch when editing existing batch', () => {
    const initialBatch: Batch = {
      id: 'BAT-001',
      catalogId: 'CAT-001',
      lotNumber: 'L999',
      quantity: 50,
      unit: 'mL',
      locationId: 'LOC-002',
      qaStatus: 'approved',
      expiryDate: new Date('2025-01-01').getTime(),
    };

    render(<BatchForm {...defaultProps} initialBatch={initialBatch} />);

    expect(screen.getByText('Editar Lote')).toBeInTheDocument();
    expect(screen.getByText('Atualizar Lote')).toBeInTheDocument();

    // Change quantity
    const qtyInput = screen.getByRole('spinbutton');
    fireEvent.change(qtyInput, { target: { value: '60' } });

    fireEvent.click(screen.getByText('Atualizar Lote'));

    expect(db.updateBatch).toHaveBeenCalledTimes(1);
    expect(db.updateBatch).toHaveBeenCalledWith(expect.objectContaining({
      ...initialBatch,
      quantity: 60,
    }));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('calls onClose when cancelled', () => {
    render(<BatchForm {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancelar'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
