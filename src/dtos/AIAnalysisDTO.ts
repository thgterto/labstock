export interface AIAnalysisResult {
  casNumber?: string;
  molecularFormula?: string;
  ghsPictograms: string[];
  ghsHazards: string[];
  description?: string;
  safetyNote?: string;
}
