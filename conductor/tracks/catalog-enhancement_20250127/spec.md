# Catalog Enhancement Specification

## Overview
This track enhances the Inventory Management (Catalog) feature to provide a complete CRUD experience.

## Requirements

### 1. Catalog Form Component
- Extract the "Add Item" form from `Inventory.tsx` into `src/components/CatalogForm.tsx`.
- Support `initialItem` prop for editing.
- Support `readonly` prop for viewing details.
- Validate required fields: Name, Category, Min Stock Level.

### 2. Edit Functionality
- Allow users to edit existing catalog items.
- Update `StorageService` to support `updateCatalogItem`.

### 3. Delete Functionality
- Allow users to delete catalog items with confirmation.
- Update `StorageService` to support `deleteCatalogItem`.

### 4. View Details
- Allow users to view item details in a read-only modal.

### 5. Validation
- Ensure numeric fields (Min Stock Level) are valid.
- Ensure required fields are populated before saving.
