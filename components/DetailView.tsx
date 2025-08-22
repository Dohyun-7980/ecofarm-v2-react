import React from 'react';
import type { Greenhouse } from '../types';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import SensorGrid from './SensorWidget';
import AIPredictionCard from './AIPrediction';
import MollierChart from './MollierChart';
import InfoCard from './InfoCard';
import AutoModeCard from './AutoModeCard';
import ManualControlCard from './ManualControlCard';
import ExpertSettingsModal from './ExpertSettingsModal';
import DataAnalysisModal from './DataAnalysisModal';
import HarvestLogModal from './HarvestLogModal';
import AddDeviceModal from './AddDeviceModal';

type ModalType = 'expert' | 'analysis' | 'harvest' | 'addDevice' | null;

interface DetailViewProps {
  greenhouse: Greenhouse;
  allGreenhouses: Greenhouse[];
  onReturn: () => void;
  onUpdate: (greenhouse: Greenhouse) => void;
  onNavigate: (id: string) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ greenhouse, allGreenhouses, onReturn, onUpdate, onNavigate, activeModal, setActiveModal }) => {
    
  const currentIndex = allGreenhouses.findIndex(g => g.id === greenhouse.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + allGreenhouses.length) % allGreenhouses.length;
    onNavigate(allGreenhouses[prevIndex].id);
  };
  
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allGreenhouses.length;
    onNavigate(allGreenhouses[nextIndex].id);
  };

  const handleSetMode = (mode: 'auto' | 'manual') => {
    onUpdate({ ...greenhouse, controlState: { ...greenhouse.controlState, activeMode: mode } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onReturn}
          className="flex items-center px-4 py-2 bg-base-200 hover:bg-base-300 rounded-md transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          대시보드로 돌아가기
        </button>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={handlePrev} className="p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors">
                <ChevronLeftIcon className="w-6 h-6"/>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center min-w-[150px] sm:min-w-[250px] truncate">{greenhouse.name}</h2>
            <button onClick={handleNext} className="p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors">
                <ChevronRightIcon className="w-6 h-6"/>
            </button>
        </div>
        <div className="w-0 sm:w-[180px]"></div> {/* Spacer */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">실시간 센서 데이터</h3>
            <SensorGrid sensorData={greenhouse.sensorData} />
          </div>
           <div className="bg-base-200 p-6 rounded-lg shadow-lg">
             <h3 className="text-xl font-semibold mb-4 text-white">습공기 선도 (건구 온도 vs 습구 온도)</h3>
             <MollierChart greenhouse={greenhouse} />
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <AIPredictionCard greenhouse={greenhouse} onUpdate={onUpdate} />
           <InfoCard 
             greenhouse={greenhouse} 
             onUpdate={onUpdate}
             onSetMode={handleSetMode}
             onOpenModal={setActiveModal}
            />
        </div>

        <div className="lg:col-span-3">
          {greenhouse.controlState.activeMode === 'auto' ? (
            <AutoModeCard greenhouse={greenhouse} onUpdate={onUpdate} />
          ) : (
            <ManualControlCard greenhouse={greenhouse} onUpdate={onUpdate} onOpenAddDeviceModal={() => setActiveModal('addDevice')} />
          )}
        </div>
      </div>

      {/* Modals */}
      <ExpertSettingsModal 
        isOpen={activeModal === 'expert'} 
        onClose={() => setActiveModal(null)}
        greenhouse={greenhouse}
        onUpdate={onUpdate}
      />
      <DataAnalysisModal 
        isOpen={activeModal === 'analysis'} 
        onClose={() => setActiveModal(null)}
      />
       <HarvestLogModal 
        isOpen={activeModal === 'harvest'} 
        onClose={() => setActiveModal(null)}
      />
      <AddDeviceModal
        isOpen={activeModal === 'addDevice'}
        onClose={() => setActiveModal(null)}
        greenhouse={greenhouse}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default DetailView;
