import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import BatchForm from './BatchForm';
import { db } from '../services/storageService';

// Mock the storage service
vi.mock('../services/storageService', () => ({
  db: {
    getCatalog: vi.fn(),
    getLocations: vi.fn(),
    addBatch: vi.fn(),
    updateBatch: vi.fn(),
  },
}));

describe('BatchForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const mockCatalog = [
    { id: 'CAT-1', name: 'Acetone', category: 'CHEMICAL' },
    { id: 'CAT-2', name: 'Beaker', category: 'GLASSWARE' },
  ];

  const mockLocations = [
    { id: 'LOC-1', name: 'Main Lab', code: 'R101' },
    { id: 'LOC-2', name: 'Storage', code: 'S01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (db.getCatalog as any).mockReturnValue(mockCatalog);
    (db.getLocations as any).mockReturnValue(mockLocations);
  });

  it('renders correctly with title "Receber Novo Lote"', () => {
    render(<BatchForm onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByText('Receber Novo Lote')).toBeInTheDocument();
  });

  it('renders all required fields', () => {
    render(<BatchForm onClose={mockOnClose} onSave={mockOnSave} />);

    // Item do Catálogo
    const catalogSelect = screen.getByLabelText(/Item do Catálogo/i);
    expect(catalogSelect).toBeInTheDocument();
    expect(catalogSelect).toHaveAttribute('required');

    // Número do Lote
    const lotInput = screen.getByLabelText(/Número do Lote/i);
    expect(lotInput).toBeInTheDocument();
    expect(lotInput).toHaveAttribute('required');

    // Validade
    const expiryInput = screen.getByLabelText(/Validade/i);
    expect(expiryInput).toBeInTheDocument();
    // Note: Validade is not marked as required in the provided code snippet but let's check input type
    expect(expiryInput).toHaveAttribute('type', 'date');

    // Quantidade
    const quantityInput = screen.getByLabelText(/Quantidade/i);
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveAttribute('required');

    // Unidade
    const unitSelect = screen.getByLabelText(/Unidade/i);
    expect(unitSelect).toBeInTheDocument();

    // Status de QA
    const qaSelect = screen.getByLabelText(/Status de QA/i);
    expect(qaSelect).toBeInTheDocument();

    // Localização
    const locationSelect = screen.getByLabelText(/Localização/i);
    expect(locationSelect).toBeInTheDocument();
    expect(locationSelect).toHaveAttribute('required');
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<BatchForm onClose={mockOnClose} onSave={mockOnSave} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('populates fields when initialBatch is provided', () => {
    const initialBatch: any = {
      id: 'BAT-1',
      catalogId: 'CAT-1',
      lotNumber: 'LOT-123',
      quantity: 10,
      unit: 'kg',
      locationId: 'LOC-1',
      qaStatus: 'approved',
      expiryDate: new Date('2025-01-01').getTime(),
    };

    render(
      <BatchForm
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialBatch={initialBatch}
      />
    );

    expect(screen.getByText('Editar Lote')).toBeInTheDocument();
    expect(screen.getByDisplayValue('LOT-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument();
  });
});
