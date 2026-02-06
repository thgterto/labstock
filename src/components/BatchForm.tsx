import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { Batch, CatalogItem, Location } from '../types';
import { X, Calendar, Package } from 'lucide-react';

interface BatchFormProps {
  onClose: () => void;
  onSave: () => void;
  initialBatch?: Batch;
}

const BatchForm: React.FC<BatchFormProps> = ({ onClose, onSave, initialBatch }) => {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState<Partial<Batch>>({
    catalogId: '',
    lotNumber: '',
    quantity: 0,
    unit: 'L', // Default to L, but should probably infer from item
    locationId: '',
    qaStatus: 'quarantine', // Default for new batches
    expiryDate: undefined,
  });

  const [expiryDateString, setExpiryDateString] = useState('');

  useEffect(() => {
    setCatalog(db.getCatalog());
    setLocations(db.getLocations());

    if (initialBatch) {
      setFormData(initialBatch);
      if (initialBatch.expiryDate) {
        setExpiryDateString(new Date(initialBatch.expiryDate).toISOString().split('T')[0]);
      }
    }
  }, [initialBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.catalogId || !formData.lotNumber || !formData.locationId) return;

    const batchToSave: Batch = {
      ...formData,
      id: initialBatch?.id || `BAT-${Date.now()}`,
      expiryDate: expiryDateString ? new Date(expiryDateString).getTime() : undefined,
    } as Batch;

    if (initialBatch) {
      db.updateBatch(batchToSave);
    } else {
      db.addBatch(batchToSave);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">
            {initialBatch ? 'Edit Batch' : 'Receive New Batch'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Catalog Item Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catalog Item</label>
            <select
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={formData.catalogId}
              onChange={(e) => setFormData({...formData, catalogId: e.target.value})}
              disabled={!!initialBatch} // Prevent changing item on edit for simplicity
            >
              <option value="">Select Item...</option>
              {catalog.map(item => (
                <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Lot Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lot Number</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={formData.lotNumber}
                onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
              />
            </div>
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none pl-10"
                  value={expiryDateString}
                  onChange={(e) => setExpiryDateString(e.target.value)}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Quantity */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
              />
            </div>
            {/* Unit */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="L">L</option>
                <option value="mL">mL</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="units">units</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
            {/* QA Status */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">QA Status</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={formData.qaStatus}
                onChange={(e) => setFormData({...formData, qaStatus: e.target.value as Batch['qaStatus']})}
              >
                <option value="quarantine">Quarantine</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <select
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={formData.locationId}
              onChange={(e) => setFormData({...formData, locationId: e.target.value})}
            >
              <option value="">Select Location...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.code})</option>
              ))}
            </select>
          </div>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            {initialBatch ? 'Update Batch' : 'Receive Batch'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchForm;
