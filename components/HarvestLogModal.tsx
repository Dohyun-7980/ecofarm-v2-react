import React, { useState } from 'react';
import Modal from './Modal';

interface HarvestLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HarvestLogModal: React.FC<HarvestLogModalProps> = ({ isOpen, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [yieldKg, setYieldKg] = useState('');
    const [plantCount, setPlantCount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a backend/API
        console.log({ date, yieldKg, plantCount });
        alert('수확량이 기록되었습니다! (콘솔 확인)');
        onClose();
    };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수확량 기록">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="harvest-date" className="block text-sm font-medium text-gray-300">수확일</label>
          <input
            type="date"
            id="harvest-date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="mt-1 block w-full bg-base-300 rounded-md border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="harvest-yield" className="block text-sm font-medium text-gray-300">총 수확량 (kg)</label>
          <input
            type="number"
            id="harvest-yield"
            value={yieldKg}
            onChange={e => setYieldKg(e.target.value)}
            step="0.1"
            required
            placeholder="예: 120.5"
            className="mt-1 block w-full bg-base-300 rounded-md border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="plant-count" className="block text-sm font-medium text-gray-300">재배 주수</label>
           <input
            type="number"
            id="plant-count"
            value={plantCount}
            onChange={e => setPlantCount(e.target.value)}
            required
            placeholder="예: 500"
            className="mt-1 block w-full bg-base-300 rounded-md border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end pt-4">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                기록 저장
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default HarvestLogModal;
