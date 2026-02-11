import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/storageService';
import { Location, Batch, CatalogItem } from '../types';
import {
  Package,
  Box,
  Snowflake,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const StorageMatrix: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    setLocations(db.getLocations());
    setBatches(db.getBatches());
    setCatalog(db.getCatalog());
  }, []);

  const catalogMap = useMemo(() => {
    return catalog.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, CatalogItem>);
  }, [catalog]);

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'freezer': return <Snowflake className="w-5 h-5 text-blue-500" />;
      case 'cabinet': return <Box className="w-5 h-5 text-amber-600" />;
      case 'room': return <MapPin className="w-5 h-5 text-slate-500" />;
      default: return <Package className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBatchesInLocation = (locationId: string) => {
    return batches.filter(b => b.locationId === locationId);
  };

  const getItemName = (catalogId: string) => {
    return catalogMap[catalogId]?.name || 'Item Desconhecido';
  };

  // Mock grid capacity for demo purposes
  const getGridSize = (type: Location['type']) => {
    switch (type) {
        case 'freezer': return 25; // 5x5
        case 'cabinet': return 16; // 4x4
        case 'shelf': return 10; // 2x5
        default: return 0; // List view only
    }
  };

  const renderGrid = (location: Location) => {
    const size = getGridSize(location.type);
    if (size === 0) return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
        Este local não suporta visualização em grade.
      </div>
    );

    const items = getBatchesInLocation(location.id);
    const gridCells = Array.from({ length: size }, (_, i) => {
        const batch = items[i]; // Simple mapping for demo: 1st batch -> 1st slot
        return { index: i, batch };
    });

    return (
        <div className="grid grid-cols-5 gap-3">
            {gridCells.map(({ index, batch }) => (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-lg border flex items-center justify-center p-2 text-center text-xs relative group
                    ${batch ? 'bg-white border-primary-200 shadow-sm hover:border-primary-500 cursor-pointer' : 'bg-slate-50 border-slate-200 border-dashed'}
                  `}
                  title={batch ? `${getItemName(batch.catalogId)} (Lote: ${batch.lotNumber})` : 'Vazio'}
                >
                    {batch ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                                {batch.quantity}
                            </div>
                            <span className="truncate w-full font-medium text-slate-700">{getItemName(batch.catalogId)}</span>

                            {/* Tooltip on Hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <p className="font-bold mb-1">{getItemName(batch.catalogId)}</p>
                                <p>Lote: {batch.lotNumber}</p>
                                <p>Validade: {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    ) : (
                        <span className="text-slate-300 font-medium">{index + 1}</span>
                    )}
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar List */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-900">Locais de Armazenamento</h2>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {locations.map(loc => {
            const count = getBatchesInLocation(loc.id).length;
            const capacity = getGridSize(loc.type);
            const percentage = capacity > 0 ? Math.round((count / capacity) * 100) : 0;

            return (
                <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${selectedLocation?.id === loc.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-slate-50 border border-transparent'}
                    `}
                >
                    <div className={`p-2 rounded-lg ${selectedLocation?.id === loc.id ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    {getLocationIcon(loc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-900">{loc.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            {loc.code} • {count} itens
                        </p>
                    </div>
                    <div className="text-right">
                        {capacity > 0 && (
                            <div className={`text-xs font-bold ${percentage > 90 ? 'text-red-600' : 'text-slate-600'}`}>
                                {percentage}%
                            </div>
                        )}
                         <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                </button>
            );
          })}
        </div>
      </div>

      {/* Main Content / Grid View */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {selectedLocation ? (
            <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {getLocationIcon(selectedLocation.type)}
                            <h2 className="text-xl font-bold text-slate-900">{selectedLocation.name}</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Código: {selectedLocation.code} • Tipo: {selectedLocation.type}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-slate-900">{getBatchesInLocation(selectedLocation.id).length}</span>
                            <span className="text-xs text-slate-500 uppercase font-medium">Itens</span>
                        </div>
                         <div className="text-center">
                            <span className="block text-2xl font-bold text-slate-900">{getGridSize(selectedLocation.type) || '∞'}</span>
                            <span className="text-xs text-slate-500 uppercase font-medium">Capacidade</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Visualização da Grade
                    </h3>
                    {renderGrid(selectedLocation)}
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Selecione um Local</h3>
                <p className="max-w-xs mx-auto">Escolha um local de armazenamento na lista à esquerda para visualizar seu conteúdo e disponibilidade.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StorageMatrix;
