export interface SatBaraLandArea {
  hectare: number | null;
  r: number | null;
  sqMeter: number | null; // Not optional for consistency with extraction prompt
}

export interface OccupantDetail {
  name: string;
  occupancyType: string | null;
  areaShare: string | null;
}

export interface CropDetail {
  season: string | null;
  cropName: string;
  area: string | null;
}

export interface Encumbrance {
  type: string;
  details: string;
  mutationEntryNumber: string | null;
}

export interface SatBaraData {
  id?: string; // Optional: for uniquely identifying in a list/DB
  fileName?: string; // Optional: name of the source file
  extractionTimestamp?: string; // Optional: when data was extracted

  villageName: string | null;
  taluka: string | null;
  district: string | null;
  surveyNumber: string | null;
  subdivisionNumber: string | null;
  totalLandArea: SatBaraLandArea | null;
  landRevenue: number | string | null; // Can be string due to currency symbols
  occupantDetails: OccupantDetail[];
  cropDetails: CropDetail[];
  encumbrances: Encumbrance[];
  otherRights: string | null;
  mutationEntries: string[];
}

export enum AppView {
  EXTRACTOR = 'extractor',
  DATABASE = 'database',
}
