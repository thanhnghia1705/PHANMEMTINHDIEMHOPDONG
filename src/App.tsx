import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Target,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppData } from './types';
import { 
  calculateResults, 
  calculateScenarios, 
  formatCurrency, 
  formatPoints, 
  formatPercentage 
} from './utils/calculations';
import { FallingItems } from './components/FallingItems';

export default function App() {
  // State for inputs
  const [formData, setFormData] = useState<AppData>({
    committedPoints: 2000,
    rp1Sales: 0,
    rp2Sales: 0
  });

  // State for view mode
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Derived calculations
  const results = useMemo(() => calculateResults(formData), [formData]);
  const scenarios = useMemo(() => calculateScenarios(formData, results), [formData, results]);

  // Handlers
  const handleInputChange = (field: keyof AppData, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const num = numericValue === '' ? 0 : parseInt(numericValue, 10);
    
    setFormData(prev => ({
      ...prev,
      [field]: num
    }));
  };

  const resetData = () => {
    setFormData({
      committedPoints: 2000,
      rp1Sales: 0,
      rp2Sales: 0
    });
  };

  return (
    <div className="min-h-screen bg-red-50 pb-12 relative overflow-hidden text-red-900 font-bold">
      <FallingItems />
      
      {/* Header */}
      <header className="bg-red-900 text-white py-10 px-4 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Calculator className="w-10 h-10 text-red-200" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-tight">
              PHẦN MỀM TÍNH ĐIỂM HỢP ĐỒNG<br className="md:hidden" /> TÍCH LŨY NĂM 2026
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-red-200 text-sm md:text-base font-semibold"
          >
            Tổng điểm = (DS RP1 / 100.000 × 5) + (DS RP2 / 100.000 × 3)
          </motion.p>

          {/* View Mode Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="bg-red-950/50 p-1 rounded-xl flex items-center border border-red-800">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'mobile' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-red-400 hover:text-red-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Điện thoại
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'desktop' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-red-400 hover:text-red-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Máy tính
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 mt-8 space-y-8 relative z-10 transition-all duration-500 ${
        viewMode === 'mobile' ? 'max-w-md' : 'max-w-5xl'
      }`}>
        {/* Input Section */}
        <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black flex items-center gap-2 text-red-900 uppercase">
              <Target className="w-5 h-5 text-red-600" />
              Nhập Dữ Liệu
            </h2>
            <button 
              onClick={resetData}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>

          <div className={`grid gap-6 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            <div className="space-y-2">
              <label className="text-sm font-black text-red-900">Mức điểm cam kết</label>
              <select 
                value={formData.committedPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, committedPoints: parseInt(e.target.value, 10) }))}
                className="w-full h-12 px-4 rounded-xl border border-red-100 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold text-red-900"
              >
                <option value={2000}>2.000 điểm</option>
                <option value={4000}>4.000 điểm</option>
                <option value={5000}>5.000 điểm</option>
                <option value={8000}>8.000 điểm</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-red-900">Doanh số RP1 (VND)</label>
              <input 
                type="text"
                inputMode="numeric"
                value={formData.rp1Sales === 0 ? '' : formData.rp1Sales.toLocaleString('vi-VN')}
                onChange={(e) => handleInputChange('rp1Sales', e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl border border-red-100 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold text-red-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-red-900">Doanh số RP2 (VND)</label>
              <input 
                type="text"
                inputMode="numeric"
                value={formData.rp2Sales === 0 ? '' : formData.rp2Sales.toLocaleString('vi-VN')}
                onChange={(e) => handleInputChange('rp2Sales', e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl border border-red-100 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold text-red-900"
              />
            </div>
          </div>
        </section>

        {/* Results Overview */}
        <section className={`grid gap-4 ${viewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div className="bg-white/95 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-[10px] text-red-500 uppercase font-black mb-1">Điểm Cam Kết</p>
            <p className="text-xl font-black text-red-900">{formatPoints(formData.committedPoints)}</p>
          </div>
          <div className="bg-white/95 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-[10px] text-red-500 uppercase font-black mb-1">Tổng Doanh Số</p>
            <p className="text-xl font-black text-red-900">{formatCurrency(results.totalSales)}</p>
          </div>
          <div className="bg-white/95 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-[10px] text-red-500 uppercase font-black mb-1">Điểm RP1</p>
            <p className="text-xl font-black text-red-900">{formatPoints(results.rp1Points)}</p>
          </div>
          <div className="bg-white/95 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-[10px] text-red-500 uppercase font-black mb-1">Điểm RP2</p>
            <p className="text-xl font-black text-red-900">{formatPoints(results.rp2Points)}</p>
          </div>
        </section>

        {/* Status Section */}
        <section className="bg-white/95 rounded-2xl p-6 shadow-sm border border-red-100 overflow-hidden relative">
          <div className={`flex flex-col justify-between gap-6 mb-8 ${viewMode === 'mobile' ? '' : 'md:flex-row md:items-center'}`}>
            <div className="space-y-1">
              <p className="text-sm font-black text-red-500 uppercase tracking-wider text-bold">Tổng điểm tích lũy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-red-700">{formatPoints(results.totalPoints)}</span>
                <span className="text-red-400 font-bold">/ {formatPoints(formData.committedPoints)} điểm</span>
              </div>
            </div>

            <div className={`flex items-center gap-4 ${viewMode === 'mobile' ? 'justify-between' : ''}`}>
              <div className={`px-4 py-2 rounded-full border-2 font-black text-sm uppercase ${
                results.status === 'ĐẠT' ? 'bg-green-100 text-green-700 border-green-200' :
                results.status === 'GẦN ĐẠT' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                TRẠNG THÁI: {results.status}
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-red-500 uppercase">Hoàn thành</p>
                <p className="text-3xl font-black text-red-700">{formatPercentage(results.completionPercentage)}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-6 w-full bg-red-100 rounded-full overflow-hidden border border-red-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(results.completionPercentage, 100)}%` }}
              className={`h-full progress-bar-fill ${
                results.completionPercentage >= 100 ? 'bg-green-500' :
                results.completionPercentage >= 80 ? 'bg-amber-500' :
                'bg-red-600'
              }`}
            />
          </div>

          {results.completionPercentage < 100 ? (
            <div className="mt-6 p-4 bg-red-900 text-white rounded-xl flex items-center gap-3">
              <Clock className="w-6 h-6 shrink-0" />
              <p className="text-lg font-black">Bạn còn thiếu {formatPoints(results.missingPoints)} điểm để đạt mục tiêu.</p>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-green-600 text-white rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="text-lg font-black">Tuyệt vời! Bạn đã vượt cam kết {formatPoints(results.totalPoints - formData.committedPoints)} điểm.</p>
            </div>
          )}
        </section>

        {/* Scenarios */}
        {results.completionPercentage < 100 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2 text-red-900 uppercase">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Cần Thêm Để Đạt Cam Kết
            </h2>
            <div className={`grid gap-4 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              {[
                { label: 'Kịch bản 1', sub: 'Chỉ bán thêm RP1', data: scenarios.onlyRP1 },
                { label: 'Kịch bản 2', sub: 'Chỉ bán thêm RP2', data: scenarios.onlyRP2 },
                { label: 'Kịch bản 3', sub: 'Theo cơ cấu hiện tại', data: scenarios.currentMix }
              ].map((s, idx) => (
                <div key={idx} className="bg-white/95 rounded-2xl p-5 border border-red-100 shadow-md">
                  <p className="text-[10px] font-black text-red-500 uppercase mb-1">{s.label}</p>
                  <p className="text-lg font-black text-red-900 mb-4">{s.sub}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-red-500">RP1:</span>
                      <span>{formatCurrency(s.data.rp1Additional)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-red-500">RP2:</span>
                      <span>{formatCurrency(s.data.rp2Additional)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-red-100">
                    <p className="text-[10px] font-black text-red-500 uppercase mb-1">Tổng cộng cần thêm</p>
                    <p className="text-xl font-black text-red-700">{formatCurrency(s.data.totalAdditional)}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-700 leading-tight">{s.data.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-red-700 text-xs font-black uppercase">
        <p>Hệ thống tính điểm nội bộ dành cho teamsales RP Santav - được sáng lập bởi NGUYENTHANHNGHIA</p>
      </footer>
    </div>
  );
}
