import { AppData, CalculationResults, Scenarios } from '../types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
};

export const formatPoints = (value: number): string => {
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
};

export const formatPercentage = (value: number): string => {
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%';
};

export const calculateResults = (data: AppData): CalculationResults => {
  // Updated coefficients: 5 for RP1 and 3 for RP2
  const rp1Points = (data.rp1Sales / 100000) * 5;
  const rp2Points = (data.rp2Sales / 100000) * 3;
  const totalPoints = rp1Points + rp2Points;
  const totalSales = data.rp1Sales + data.rp2Sales;
  const completionPercentage = data.committedPoints > 0 
    ? (totalPoints / data.committedPoints) * 100 
    : 0;
  const missingPoints = Math.max(data.committedPoints - totalPoints, 0);

  let status: CalculationResults['status'] = 'RỦI RO';
  if (completionPercentage >= 100) status = 'ĐẠT';
  else if (completionPercentage >= 80) status = 'GẦN ĐẠT';
  else if (completionPercentage >= 50) status = 'CHẬM';

  return {
    rp1Points,
    rp2Points,
    totalPoints,
    totalSales,
    completionPercentage,
    missingPoints,
    status
  };
};

export const calculateScenarios = (data: AppData, results: CalculationResults): Scenarios => {
  const missingPoints = results.missingPoints;
  
  if (missingPoints <= 0) {
    const emptyScenario = { rp1Additional: 0, rp2Additional: 0, totalAdditional: 0, note: '' };
    return {
      onlyRP1: { ...emptyScenario, note: 'Phù hợp khi tập trung đẩy RP1' },
      onlyRP2: { ...emptyScenario, note: 'Phù hợp khi tập trung đẩy RP2' },
      currentMix: { ...emptyScenario, note: 'Phù hợp khi giữ cơ cấu bán hàng hiện tại' }
    };
  }

  // Coefficients: 5 and 3
  const onlyRP1Sales = Math.ceil((missingPoints * 100000) / 5 / 100000) * 100000;
  const onlyRP2Sales = Math.ceil((missingPoints * 100000) / 3 / 100000) * 100000;

  let rp1Weight = 0.5;
  let rp2Weight = 0.5;
  const totalCurrentSales = data.rp1Sales + data.rp2Sales;
  
  if (totalCurrentSales > 0) {
    rp1Weight = data.rp1Sales / totalCurrentSales;
    rp2Weight = data.rp2Sales / totalCurrentSales;
  }

  const avgPointsPer100k = (rp1Weight * 5) + (rp2Weight * 3);
  const totalAdditionalMix = Math.ceil((missingPoints * 100000) / avgPointsPer100k / 100000) * 100000;
  
  return {
    onlyRP1: {
      rp1Additional: onlyRP1Sales,
      rp2Additional: 0,
      totalAdditional: onlyRP1Sales,
      note: 'Phù hợp khi tập trung đẩy RP1'
    },
    onlyRP2: {
      rp1Additional: 0,
      rp2Additional: onlyRP2Sales,
      totalAdditional: onlyRP2Sales,
      note: 'Phù hợp khi tập trung đẩy RP2'
    },
    currentMix: {
      rp1Additional: totalAdditionalMix * rp1Weight,
      rp2Additional: totalAdditionalMix * rp2Weight,
      totalAdditional: totalAdditionalMix,
      note: 'Phù hợp khi giữ cơ cấu bán hàng hiện tại'
    }
  };
};
