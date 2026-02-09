# Implementation Plan - LabControl 2.0 Web

This track follows the implementation plan defined in `PLANO_IMPLEMENTACAO.md`.

## 1. Catalog Management (CRUD)
- Add `updateCatalogItem` and `deleteCatalogItem` to `src/services/storageService.ts`.
- Update `src/pages/Inventory.tsx` to include Edit/Delete actions in the UI.

## 2. Batch Management (Bug Fix)
- Fix `src/components/BatchForm.tsx` by moving the submit button inside the form.

## 3. Location Management (Full CRUD)
- Update `src/services/storageService.ts` with `addLocation`, `updateLocation`, `deleteLocation`.
- Create `src/pages/Locations.tsx` with list and modal.
- Add route to `src/App.tsx`.

## 4. Import and Export (CSV)
- Create `src/utils/csvHelper.ts`.
- Update `src/pages/Settings.tsx` to support CSV import.

## 5. Visualization (Real Matrix)
- Update `Batch` type in `src/types.ts` with `position`.
- Update `src/pages/StorageMatrix.tsx` to render grid based on position.

## 6. History and Traceability
- Update `HistoryLog` type in `src/types.ts`.
- Update `src/services/storageService.ts` to log actions.
- Update `src/pages/History.tsx` to display logs.
