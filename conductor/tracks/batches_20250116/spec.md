# Track Specification: Batch Management

## Goal
Implement a module to manage inventory batches, including tracking lot numbers, expiry dates, and locations.

## Requirements
1.  **Batch List**:
    -   Display all batches.
    -   Show details: Catalog Name, Lot #, Expiry, Quantity, Location, QA Status.
    -   Highlight expiring/expired batches.
2.  **Add Batch**:
    -   Form to create a new batch linked to a Catalog Item.
    -   Fields: Catalog Item (Select), Lot Number, Expiry Date, Quantity, Unit, Location (Select).
3.  **Actions**:
    -   **Consume**: Reduce quantity of a batch.
    -   **Dispose**: Remove a batch (or mark as 0 quantity/disposed).

## Technical Approach
-   Extend `storageService` with `updateBatch` and `deleteBatch`.
-   Use a Modal for the "Add Batch" form.
-   Use `date` inputs for expiry.
