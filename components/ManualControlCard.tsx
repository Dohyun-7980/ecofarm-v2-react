import React from 'react';
import type { Greenhouse } from '../types';
import ControlPanel from './ControlPanel';
import { PlusIcon } from './icons';

interface ManualControlCardProps {
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
  onOpenAddDeviceModal: () => void;
}

const ManualControlCard: React.FC<ManualControlCardProps> = ({ greenhouse, onUpdate, onOpenAddDeviceModal }) => {
  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">수동 제어</h3>
        <button 
          onClick={onOpenAddDeviceModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          장치 추가
        </button>
      </div>
      <ControlPanel greenhouse={greenhouse} onUpdate={onUpdate} />
    </div>
  );
};

export default ManualControlCard;
