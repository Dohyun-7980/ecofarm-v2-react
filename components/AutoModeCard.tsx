import React from 'react';
import type { Greenhouse, JojoGaonRule } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface AutoModeCardProps {
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
}

const AutoModeCard: React.FC<AutoModeCardProps> = ({ greenhouse, onUpdate }) => {
  const { controlState, devices } = greenhouse;

  const handleToggle = (key: keyof typeof controlState) => {
    onUpdate({ ...greenhouse, controlState: { ...controlState, [key]: !controlState[key] } });
  };

  const setAutoSubType = (subType: 'stable' | 'ml_optimization') => {
    onUpdate({ ...greenhouse, controlState: { ...controlState, autoSubType: subType } });
  };
  
  const handleAddJojoRule = () => {
    const newRule: JojoGaonRule = { id: Date.now().toString(), timeBeforeSunrise: 2, targetTemp: 15 };
    onUpdate({ ...greenhouse, controlState: { ...controlState, jojoGaonRules: [...controlState.jojoGaonRules, newRule] } });
  };

  const handleUpdateJojoRule = (id: string, key: keyof Omit<JojoGaonRule, 'id'>, value: number) => {
    const updatedRules = controlState.jojoGaonRules.map(rule => 
      rule.id === id ? { ...rule, [key]: value } : rule
    );
    onUpdate({ ...greenhouse, controlState: { ...controlState, jojoGaonRules: updatedRules } });
  };
  
  const handleDeleteJojoRule = (id: string) => {
     const updatedRules = controlState.jojoGaonRules.filter(rule => rule.id !== id);
     onUpdate({ ...greenhouse, controlState: { ...controlState, jojoGaonRules: updatedRules } });
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">자동 제어 설정</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Status Panel */}
        <div className="bg-base-300/50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-gray-200 mb-2">작동 상태</h4>
          {Object.entries(devices).map(([key, name]) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span>{name}</span>
              <span className={`font-bold ${controlState.manualSettings[key] ? 'text-green-400' : 'text-gray-500'}`}>
                {controlState.manualSettings[key] ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="bg-base-300/50 p-4 rounded-lg space-y-4">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">제어 기준 설정</h4>
            <div className="flex justify-between items-center bg-base-100 p-3 rounded-md">
                <span>사용자 정의 설정 사용</span>
                <button
                    onClick={() => handleToggle('useExpertSettings')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${controlState.useExpertSettings ? 'bg-secondary' : 'bg-base-200'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${controlState.useExpertSettings ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">'사용자 설정 모드'에서 저장한 값으로 제어합니다.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">자동 모드 종류</h4>
            <div className="flex rounded-md" role="group">
                <button onClick={() => setAutoSubType('stable')} type="button" className={`py-2 px-4 text-sm font-medium flex-1 rounded-l-lg ${controlState.autoSubType === 'stable' ? 'bg-secondary text-primary' : 'bg-base-200 hover:bg-base-300'}`}>
                    안정 생육 모드
                </button>
                <button onClick={() => setAutoSubType('ml_optimization')} type="button" className={`py-2 px-4 text-sm font-medium flex-1 rounded-r-lg ${controlState.autoSubType === 'ml_optimization' ? 'bg-secondary text-primary' : 'bg-base-200 hover:bg-base-300'}`}>
                    생산량 최적화 모드
                </button>
            </div>
          </div>
        </div>

        {/* JoJo Gaon Panel */}
        <div className="bg-base-300/50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-200 mb-2">조조가온 설정</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {controlState.jojoGaonRules.length > 0 ? (
                    controlState.jojoGaonRules.map(rule => (
                        <div key={rule.id} className="flex items-center gap-2 text-sm bg-base-100 p-2 rounded-md">
                            <select value={rule.timeBeforeSunrise} onChange={(e) => handleUpdateJojoRule(rule.id, 'timeBeforeSunrise', +e.target.value)} className="bg-base-200 rounded">
                                {[1,2,3].map(h => <option key={h} value={h}>일출 {h}시간 전</option>)}
                            </select>
                            <input type="number" value={rule.targetTemp} onChange={(e) => handleUpdateJojoRule(rule.id, 'targetTemp', +e.target.value)} className="w-16 bg-base-200 rounded p-1" />
                            <span>°C</span>
                            <button onClick={() => handleDeleteJojoRule(rule.id)} className="ml-auto p-1 text-gray-400 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))
                ) : <p className="text-xs text-gray-500 text-center py-4">설정된 규칙이 없습니다.</p>}
            </div>
             <button onClick={handleAddJojoRule} className="w-full mt-2 flex items-center justify-center gap-1 text-sm py-2 px-4 font-medium text-secondary hover:bg-secondary/10 rounded-md">
                <PlusIcon className="w-4 h-4"/> 조조가온 규칙 추가
            </button>
        </div>

      </div>
    </div>
  );
};

export default AutoModeCard;
