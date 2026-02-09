# Implementation Plan V2

- [x] Task 1: Catalog Management (CRUD)
  - Add `updateCatalogItem` and `deleteCatalogItem` to `src/services/storageService.ts`.
  - Update `src/pages/Inventory.tsx` to handle edit and delete.
- [ ] Task 2: Batch Management (Bug Fix)
  - Refactor `src/components/BatchForm.tsx` to fix form submission.
- [ ] Task 3: Location Management (CRUD)
  - Update `src/services/storageService.ts` with location CRUD methods.
  - Create `src/pages/Locations.tsx`.
  - Add route in `src/App.tsx`.
- [ ] Task 4: Import/Export (CSV)
  - Create `src/utils/csvHelper.ts`.
  - Implement CSV import in `src/pages/Settings.tsx`.
- [ ] Task 5: Visualization (Matrix)
  - Update `Batch` type.
  - Update `src/pages/StorageMatrix.tsx`.
- [ ] Task 6: History & Traceability
  - Update types and service for logging.
  - Update History page.
