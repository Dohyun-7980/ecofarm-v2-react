import React from 'react';
import type { Greenhouse } from '../types';
import { SunIcon, MoonIcon, ThermometerIcon, WaterIcon, ArrowRightIcon, PlusIcon, TrashIcon } from './icons';

interface GreenhouseCardProps {
  greenhouse: Greenhouse;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const GreenhouseCard: React.FC<GreenhouseCardProps> = ({ greenhouse, onSelect, onDelete }) => {
  const { name, sensorData } = greenhouse;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onDelete(greenhouse.id);
  };

  return (
    <div
      className="bg-base-200 rounded-lg p-6 shadow-lg hover:shadow-primary/50 hover:border-primary border-2 border-transparent transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
      onClick={() => onSelect(greenhouse.id)}
    >
       <button onClick={handleDelete} className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors opacity-0 group-hover:opacity-100">
         <TrashIcon className="w-4 h-4" />
      </button>

      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white pr-8">{name}</h3>
          {sensorData.isDay ? (
            <SunIcon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          ) : (
            <MoonIcon className="w-8 h-8 text-blue-300 flex-shrink-0" />
          )}
        </div>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center">
            <ThermometerIcon className="w-5 h-5 mr-3 text-secondary" />
            <span>온도: <span className="font-semibold text-white">{sensorData.temp.toFixed(1)}°C</span></span>
          </div>
          <div className="flex items-center">
            <WaterIcon className="w-5 h-5 mr-3 text-secondary" />
            <span>습도: <span className="font-semibold text-white">{sensorData.humidity.toFixed(1)}%</span></span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end items-center text-secondary">
        <span className="text-sm font-semibold group-hover:underline">상세 보기</span>
        <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

interface DashboardProps {
  greenhouses: Greenhouse[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ greenhouses, onSelect, onAdd, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">나의 온실</h2>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-md transition-colors">
          <PlusIcon className="w-5 h-5" />
          새 온실 추가
        </button>
      </div>
      
      {greenhouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {greenhouses.map((gh) => (
            <GreenhouseCard key={gh.id} greenhouse={gh} onSelect={onSelect} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-base-200 rounded-lg">
          <p className="text-gray-400">온실을 찾을 수 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">'새 온실 추가' 버튼을 눌러 시작하세요.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
