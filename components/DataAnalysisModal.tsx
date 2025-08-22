import React, { useState } from 'react';
import Modal from './Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock historical data generation
const generateMockData = (start: Date, end: Date) => {
    const data = [];
    let current = new Date(start);
    while (current <= end) {
        data.push({
            date: current.toLocaleDateString(),
            온도: 20 + Math.random() * 5,
            습도: 60 + Math.random() * 10,
            난방기: Math.random() > 0.7 ? 1 : 0, // 1 for ON, 0 for OFF
        });
        current.setDate(current.getDate() + 1);
    }
    return data;
};


const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any[]>([]);

  const handleFetchData = () => {
    setData(generateMockData(new Date(startDate), new Date(endDate)));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기간별 데이터 분석">
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 p-4 bg-base-300/50 rounded-lg">
                <label>기간:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-base-100 p-2 rounded-md" />
                <span>~</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-base-100 p-2 rounded-md" />
                <button onClick={handleFetchData} className="px-4 py-2 bg-primary text-white rounded-md">조회</button>
            </div>
            
            <div className="w-full h-96">
                {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" label={{ value: '°C / %', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} stroke="#9CA3AF" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 1]} tick={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="온도" stroke="#ef4444" />
                        <Line yAxisId="left" type="monotone" dataKey="습도" stroke="#3b82f6" />
                        <Line yAxisId="right" type="step" dataKey="난방기" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        조회할 기간을 선택하고 '조회' 버튼을 누르세요.
                    </div>
                )}
            </div>
        </div>
    </Modal>
  );
};

export default DataAnalysisModal;
