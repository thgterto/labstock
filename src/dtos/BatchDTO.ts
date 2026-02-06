export interface Batch {
  id: string;
  catalogId: string;
  lotNumber: string;
  expiryDate?: number; // Unix timestamp
  quantity: number;
  unit: string;
  locationId: string;
  qaStatus: 'approved' | 'quarantine' | 'rejected' | 'expired';
}
