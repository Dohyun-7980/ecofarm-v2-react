import React from 'react';
import type { Greenhouse } from '../types';
import { TrashIcon } from './icons';

interface ControlPanelProps {
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
}

const DEFAULT_DEVICES = ['fan', 'circulation_fan', 'mist', 'dehumidifier', 'heater'];

const ControlPanel: React.FC<ControlPanelProps> = ({ greenhouse, onUpdate }) => {
  const { controlState, devices } = greenhouse;

  const handleToggle = (deviceKey: string) => {
    const newSettings = {
      ...controlState.manualSettings,
      [deviceKey]: !controlState.manualSettings[deviceKey],
    };
    const updatedGreenhouse = {
      ...greenhouse,
      controlState: {
        ...controlState,
        manualSettings: newSettings,
      },
    };
    onUpdate(updatedGreenhouse);
  };
  
  const handleDeleteDevice = (deviceKey: string) => {
    if (confirm(`'${devices[deviceKey]}' 장치를 정말 삭제하시겠습니까?`)) {
        const newDevices = { ...devices };
        delete newDevices[deviceKey];
        
        const newManualSettings = { ...controlState.manualSettings };
        delete newManualSettings[deviceKey];

        onUpdate({
            ...greenhouse,
            devices: newDevices,
            controlState: {
                ...controlState,
                manualSettings: newManualSettings,
            },
        });
    }
  };

  const sortedDevices = Object.entries(devices).sort(([keyA], [keyB]) => {
    const indexA = DEFAULT_DEVICES.indexOf(keyA);
    const indexB = DEFAULT_DEVICES.indexOf(keyB);
    if (indexA > -1 && indexB > -1) return indexA - indexB;
    if (indexA > -1) return -1;
    if (indexB > -1) return 1;
    return keyA.localeCompare(keyB);
  });


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedDevices.map(([key, name]) => {
        const isOn = controlState.manualSettings[key] || false;
        const isDefault = DEFAULT_DEVICES.includes(key);
        return (
          <div key={key} className="flex items-center justify-between bg-base-300/50 p-3 rounded-md">
            <span className="font-medium text-gray-300">{name}</span>
            <div className="flex items-center gap-2">
                {!isDefault && (
                    <button 
                      onClick={() => handleDeleteDevice(key)}
                      className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
                <button
                onClick={() => handleToggle(key)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                    isOn ? 'bg-secondary' : 'bg-base-300'
                }`}
                >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ControlPanel;
