import React, { useState } from 'react';
import type { Greenhouse } from '../types';
import Modal from './Modal';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, greenhouse, onUpdate }) => {
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!key.match(/^[a-zA-Z0-9_]+$/)) {
      setError('장치 영문 ID는 알파벳, 숫자, 밑줄(_)만 사용할 수 있습니다.');
      return;
    }
    if (greenhouse.devices[key]) {
      setError('이미 사용 중인 장치 ID입니다.');
      return;
    }
    
    const newDevices = { ...greenhouse.devices, [key]: name };
    const newManualSettings = { ...greenhouse.controlState.manualSettings, [key]: false };

    onUpdate({
        ...greenhouse,
        devices: newDevices,
        controlState: {
            ...greenhouse.controlState,
            manualSettings: newManualSettings,
        }
    });

    setKey('');
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 제어 장치 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="device-key" className="block text-sm font-medium text-gray-300">장치 영문 ID</label>
          <input
            type="text"
            id="device-key"
            value={key}
            onChange={e => setKey(e.target.value)}
            required
            placeholder="예: fan2, side_curtain"
            className="mt-1 block w-full bg-base-300 rounded-md border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="device-name" className="block text-sm font-medium text-gray-300">장치 한글 이름</label>
          <input
            type="text"
            id="device-name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="예: 2번 팬, 측면 커튼"
            className="mt-1 block w-full bg-base-300 rounded-md border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
          />
        </div>
        
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end pt-4">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                장치 추가
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;
