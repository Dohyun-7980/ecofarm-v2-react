import React, { useState, useEffect } from 'react';
import type { Greenhouse, ExpertSettings } from '../types';
import Modal from './Modal';

interface ExpertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
}

const ExpertSettingsModal: React.FC<ExpertSettingsModalProps> = ({ isOpen, onClose, greenhouse, onUpdate }) => {
  const [settings, setSettings] = useState<ExpertSettings>(greenhouse.expertSettings);

  useEffect(() => {
    setSettings(greenhouse.expertSettings);
  }, [greenhouse.expertSettings, isOpen]);

  const handleSave = () => {
    onUpdate({ ...greenhouse, expertSettings: settings });
    onClose();
  };

  const handleSliderChange = (dayNight: 'day' | 'night', key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [dayNight]: {
        ...prev[dayNight],
        [key]: value,
      }
    }));
  };
  
  const handleRangeSliderChange = (dayNight: 'day' | 'night', keyMin: string, keyMax: string, values: [number, number]) => {
     setSettings(prev => ({
      ...prev,
      [dayNight]: {
        ...prev[dayNight],
        [keyMin]: values[0],
        [keyMax]: values[1],
      }
    }));
  };

  const SettingsEditor: React.FC<{ dayNight: 'day' | 'night' }> = ({ dayNight }) => {
    const current = settings[dayNight];
    return (
      <div className="bg-base-300/50 p-4 rounded-lg space-y-4">
        <h4 className="text-lg font-semibold text-secondary">{dayNight === 'day' ? '☀️ 주간 설정' : '🌙 야간 설정'}</h4>
        <div>
          <label className="block text-sm font-medium text-gray-300">온도 범위</label>
          <div className="flex items-center gap-2">
            <input type="number" value={current.temp_min} onChange={(e) => handleSliderChange(dayNight, 'temp_min', +e.target.value)} className="w-16 bg-base-100 p-1 rounded" />
            <input type="range" min="0" max="45" step="0.5" value={current.temp_min} onChange={(e) => handleSliderChange(dayNight, 'temp_min', +e.target.value)} className="w-full" />
          </div>
           <div className="flex items-center gap-2">
            <input type="number" value={current.temp_max} onChange={(e) => handleSliderChange(dayNight, 'temp_max', +e.target.value)} className="w-16 bg-base-100 p-1 rounded" />
            <input type="range" min="0" max="45" step="0.5" value={current.temp_max} onChange={(e) => handleSliderChange(dayNight, 'temp_max', +e.target.value)} className="w-full" />
          </div>
          <p className="text-center text-white font-semibold">{current.temp_min.toFixed(1)}°C ~ {current.temp_max.toFixed(1)}°C</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">습도 관리 (건구-습구 온도차)</label>
          <div className="flex items-center gap-2">
            <input type="number" value={current.temp_diff_min} onChange={(e) => handleSliderChange(dayNight, 'temp_diff_min', +e.target.value)} className="w-16 bg-base-100 p-1 rounded" />
            <input type="range" min="0" max="10" step="0.1" value={current.temp_diff_min} onChange={(e) => handleSliderChange(dayNight, 'temp_diff_min', +e.target.value)} className="w-full" />
          </div>
           <div className="flex items-center gap-2">
            <input type="number" value={current.temp_diff_max} onChange={(e) => handleSliderChange(dayNight, 'temp_diff_max', +e.target.value)} className="w-16 bg-base-100 p-1 rounded" />
            <input type="range" min="0" max="10" step="0.1" value={current.temp_diff_max} onChange={(e) => handleSliderChange(dayNight, 'temp_diff_max', +e.target.value)} className="w-full" />
          </div>
          <p className="text-center text-white font-semibold">{current.temp_diff_min.toFixed(1)}°C ~ {current.temp_diff_max.toFixed(1)}°C</p>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="사용자 설정 모드: 자동 제어 기준값">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsEditor dayNight="day" />
          <SettingsEditor dayNight="night" />
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-base-300 rounded-md">취소</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md">설정 저장</button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpertSettingsModal;
