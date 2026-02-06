# Track Specification: Formalize DTOs

## Goal
Standardize and separate Data Transfer Objects (DTOs) and Type definitions. Move types from `src/types.ts` to `src/dtos/` to enforce strict data shapes.

## Requirements
1.  **Structure**:
    -   Create `src/dtos/` directory.
    -   Separate interfaces into dedicated files: `UserDTO`, `CatalogDTO`, `BatchDTO`, `LocationDTO`.
2.  **Refactoring**:
    -   Maintain `src/types.ts` as a barrel file to preserve existing import paths.
    -   Ensure no functional changes or breakages.

## Context
Currently, all types are dumped in `src/types.ts`. As the application grows (Auth, Batches), this file will become unmanageable.
