export interface AppData {
  committedPoints: number;
  rp1Sales: number;
  rp2Sales: number;
  viewMode?: 'mobile' | 'desktop';
}

export interface CalculationResults {
  rp1Points: number;
  rp2Points: number;
  totalPoints: number;
  totalSales: number;
  completionPercentage: number;
  missingPoints: number;
  status: 'ĐẠT' | 'GẦN ĐẠT' | 'CHẬM' | 'RỦI RO';
}

export interface Scenario {
  rp1Additional: number;
  rp2Additional: number;
  totalAdditional: number;
  note: string;
}

export interface Scenarios {
  onlyRP1: Scenario;
  onlyRP2: Scenario;
  currentMix: Scenario;
}
