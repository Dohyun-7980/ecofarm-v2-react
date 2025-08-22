import React from 'react';
import type { Greenhouse } from '../types';
import { CalendarIcon, CogIcon, ChartBarIcon, ClipboardDocumentListIcon } from './icons';

type ModalType = 'expert' | 'analysis' | 'harvest' | 'addDevice' | null;

interface InfoCardProps {
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
  onSetMode: (mode: 'auto' | 'manual') => void;
  onOpenModal: (modal: ModalType) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ greenhouse, onUpdate, onSetMode, onOpenModal }) => {
  const { plantingDate, controlState } = greenhouse;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...greenhouse, plantingDate: e.target.value });
  };

  const ActionButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-base-300 hover:bg-base-300/80 text-gray-200 font-semibold rounded-md transition-colors"
    >
      {icon}
      {text}
    </button>
  );

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">핵심 정보 및 제어</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="planting-date" className="block text-sm font-medium text-gray-400 mb-2">정식일</label>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="planting-date"
                value={plantingDate}
                onChange={handleDateChange}
                className="w-full bg-base-300 text-white rounded-md border-gray-600 focus:ring-secondary focus:border-secondary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <ActionButton icon={<CogIcon className="w-5 h-5"/>} text="사용자 설정" onClick={() => onOpenModal('expert')} />
             <ActionButton icon={<ChartBarIcon className="w-5 h-5"/>} text="데이터 분석" onClick={() => onOpenModal('analysis')} />
             <ActionButton icon={<ClipboardDocumentListIcon className="w-5 h-5"/>} text="수확량 기록" onClick={() => onOpenModal('harvest')} />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">제어 모드 선택</h3>
        <div className="flex justify-around">
            <button 
            onClick={() => onSetMode('auto')}
            className={`w-full py-3 rounded-l-md font-semibold transition-colors text-center ${controlState.activeMode === 'auto' ? 'bg-secondary text-primary' : 'bg-base-300'}`}
            >
            자동 모드
            </button>
            <button 
            onClick={() => onSetMode('manual')}
            className={`w-full py-3 rounded-r-md font-semibold transition-colors text-center ${controlState.activeMode === 'manual' ? 'bg-secondary text-primary' : 'bg-base-300'}`}
            >
            수동 모드
            </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
