# Plano de Implementação - LabControl 2.0 Web

Este documento detalha as modificações necessárias e snippets de código para resolver as pendências identificadas.

## 1. Gerenciamento de Catálogo (CRUD)

### Arquivos Afetados
*   `src/services/storageService.ts`
*   `src/pages/Inventory.tsx`

### Snippets Propostos

**1.1. Atualizar Serviço (`src/services/storageService.ts`)**
```typescript
// Adicionar métodos de Update e Delete para CatalogItem
updateCatalogItem(updatedItem: CatalogItem) {
  const items = this.getCatalog();
  const index = items.findIndex(i => i.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(items));
    this.logAction('update', 'item', `Atualizou item: ${updatedItem.name}`, 'Admin'); // Se log for implementado
  }
}

deleteCatalogItem(itemId: string) {
  const items = this.getCatalog();
  const filtered = items.filter(i => i.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(filtered));
  // Opcional: Verificar se existem lotes associados antes de deletar
}
```

**1.2. Atualizar Componente (`src/pages/Inventory.tsx`)**
*   **Estado:** Adicionar `editingItem: CatalogItem | null`.
*   **Handlers:**
    ```typescript
    const handleEdit = (item: CatalogItem) => {
      setNewItem(item); // Preenche o form
      setEditingItem(item);
      setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
      if (confirm('Deseja excluir este item permanentemente?')) {
        db.deleteCatalogItem(id);
        loadItems();
      }
    };
    ```
*   **Render:** Implementar chamadas nos botões do dropdown `MoreHorizontal`.

## 2. Gerenciamento de Lotes (Correção de Bug)

### Arquivos Afetados
*   `src/components/BatchForm.tsx`

### Snippets Propostos
**Mover botão de submit para dentro do form:**
```tsx
<form onSubmit={handleSubmit} className="p-6 space-y-6">
  {/* Campos existentes... */}

  {/* Footer do Form */}
  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
    <button type="button" onClick={onClose} className="...">Cancelar</button>
    <button type="submit" className="...">Salvar</button>
  </div>
</form>
```

## 3. Gerenciamento de Locais (CRUD Completo)

### Arquivos Afetados
*   `src/types.ts` (Já possui `Location`)
*   `src/services/storageService.ts`
*   `src/pages/Locations.tsx` (Novo arquivo)
*   `src/App.tsx` (Nova rota)

### Snippets Propostos

**3.1. Serviço (`src/services/storageService.ts`)**
```typescript
addLocation(location: Location) {
  const locations = this.getLocations();
  locations.push(location);
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
}
// Implementar updateLocation e deleteLocation similar ao Catalog
```

**3.2. Página (`src/pages/Locations.tsx`)**
*   Criar estrutura similar a `Inventory.tsx` com tabela listando: Nome, Código, Tipo.
*   Modal para adicionar/editar local com campos: `name`, `code`, `type` (select: room, cabinet, shelf, freezer).

## 4. Importação e Exportação (CSV)

### Arquivos Afetados
*   `src/pages/Settings.tsx`
*   `src/utils/csvHelper.ts` (Novo helper sugerido)

### Snippets Propostos

**4.1. Helper de CSV (Nativo JS)**
```typescript
export const parseCSV = (text: string): any[] => {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index]?.trim();
      return obj;
    }, {} as any);
  });
};

export const generateCSV = (data: any[]): string => {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
  ].join('\n');
  return csvContent;
};
```

**4.2. Uso em `Settings.tsx`**
```tsx
const handleImportCatalog = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const data = parseCSV(text);
    // Validar e salvar no db
    data.forEach(item => db.addCatalogItem(mapCsvToItem(item)));
  };
  reader.readAsText(file);
};
```

## 5. Visualização (Matriz Real)

### Arquivos Afetados
*   `src/types.ts`
*   `src/pages/StorageMatrix.tsx`

### Snippets Propostos

**5.1. Atualizar Tipo (`src/types.ts`)**
```typescript
export interface Batch {
  // ... campos existentes
  position?: number; // Índice do slot (0 a capacidade-1)
}
```

**5.2. Atualizar Grid (`src/pages/StorageMatrix.tsx`)**
```tsx
const renderGrid = (location: Location) => {
  const size = getGridSize(location.type);
  const items = getBatchesInLocation(location.id);

  // Criar array preenchido com vazios
  const gridCells = Array(size).fill(null);

  // Preencher slots ocupados baseados na posição (se existir) ou fallback sequencial
  items.forEach((batch, i) => {
    const pos = batch.position !== undefined ? batch.position : i;
    if (pos < size) gridCells[pos] = batch;
  });

  return (
    <div className="grid grid-cols-5 gap-3">
      {gridCells.map((batch, index) => (
        <div key={index} onClick={() => handleSlotClick(index)}>
           {/* Renderizar Lote ou Vazio com opção de adicionar */}
        </div>
      ))}
    </div>
  );
};
```

## 6. Histórico e Rastreabilidade

### Arquivos Afetados
*   `src/types.ts`
*   `src/services/storageService.ts`
*   `src/pages/History.tsx`

### Snippets Propostos

**6.1. Tipo (`src/types.ts`)**
```typescript
export interface HistoryLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'consume';
  entity: 'batch' | 'item' | 'location';
  description: string;
  user: string; // Nome ou ID do usuário logado
  timestamp: string; // ISO String
}
```

**6.2. Serviço (`src/services/storageService.ts`)**
```typescript
// Nova chave no localStorage: 'labcontrol_history'

logAction(action: HistoryLog['action'], entity: HistoryLog['entity'], description: string, user: string) {
  const logs: HistoryLog[] = JSON.parse(localStorage.getItem('labcontrol_history') || '[]');
  const newLog: HistoryLog = {
    id: `LOG-${Date.now()}`,
    action,
    entity,
    description,
    user,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog); // Adiciona no início
  localStorage.setItem('labcontrol_history', JSON.stringify(logs));
}

// Exemplo de uso
addBatch(batch: Batch) {
  // ... logica existente ...
  this.logAction('create', 'batch', `Lote ${batch.lotNumber} criado`, 'Admin');
}
```
