
import React from 'react';
import type { SensorData } from '../types';
import { BeakerIcon, CloudIcon, LeafIcon, ThermometerIcon, WaterIcon, WindIcon } from './icons';

interface SensorWidgetProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}

const SensorWidget: React.FC<SensorWidgetProps> = ({ icon, title, value, unit }) => {
  return (
    <div className="bg-base-300/50 p-4 rounded-lg flex items-center space-x-4">
      <div className="bg-secondary/20 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold text-white">
          {value} <span className="text-base font-normal text-gray-300">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export const SensorGrid: React.FC<{ sensorData: SensorData }> = ({ sensorData }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <SensorWidget icon={<ThermometerIcon className="w-6 h-6 text-secondary" />} title="대기 온도" value={sensorData.temp.toFixed(1)} unit="°C" />
            <SensorWidget icon={<ThermometerIcon className="w-6 h-6 text-secondary" />} title="습구 온도" value={sensorData.wetBulbTemp.toFixed(1)} unit="°C" />
            <SensorWidget icon={<LeafIcon className="w-6 h-6 text-secondary" />} title="근권 온도" value={sensorData.rootTemp.toFixed(1)} unit="°C" />
            <SensorWidget icon={<WaterIcon className="w-6 h-6 text-secondary" />} title="상대 습도" value={sensorData.humidity.toFixed(1)} unit="%" />
            <SensorWidget icon={<CloudIcon className="w-6 h-6 text-secondary" />} title="이슬점" value={sensorData.dewPoint.toFixed(1)} unit="°C" />
            <SensorWidget icon={<WindIcon className="w-6 h-6 text-secondary" />} title="수분 부족량" value={sensorData.vpd.toFixed(2)} unit="kPa" />
            <SensorWidget icon={<BeakerIcon className="w-6 h-6 text-secondary" />} title="CO₂" value={sensorData.co2.toFixed(0)} unit="ppm" />
        </div>
    );
};


export default SensorGrid;
