
import React, { useState } from 'react';
import type { Greenhouse, AIPrediction } from '../types';
import { getAIPrediction } from '../services/geminiService';
import { SparklesIcon, CheckCircleIcon } from './icons';

interface AIPredictionCardProps {
  greenhouse: Greenhouse;
  onUpdate: (greenhouse: Greenhouse) => void;
}

const AIPredictionCard: React.FC<AIPredictionCardProps> = ({ greenhouse, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);

  const handleFetchPrediction = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await getAIPrediction(greenhouse);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPrediction = () => {
    if (prediction) {
      const updatedGreenhouse = {
        ...greenhouse,
        predictedSettings: prediction,
        controlState: {
          ...greenhouse.controlState,
          autoSubType: 'ml_optimization' as const,
          activeMode: 'auto' as const,
        },
      };
      onUpdate(updatedGreenhouse);
      setPrediction(null); // Clear prediction after applying
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-6 h-6 text-accent mr-3" />
        <h3 className="text-xl font-semibold text-white">AI 수확량 최적화</h3>
      </div>
      
      {!prediction && (
         <button
            onClick={handleFetchPrediction}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors disabled:bg-base-300 disabled:cursor-wait"
        >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>분석 중...</span>
                </>
            ) : (
                'AI 추천 받기'
            )}
        </button>
      )}

      {error && <p className="mt-4 text-sm text-red-400">오류: {error}</p>}
      
      {prediction && (
        <div className="mt-4 space-y-4 text-sm">
            <div className="bg-base-300/50 p-3 rounded-md">
                <p className="font-bold text-secondary">☀️ 주간 추천 설정</p>
                <p>온도: {prediction.day.temp_min.toFixed(1)} - {prediction.day.temp_max.toFixed(1)}°C</p>
                <p>온도차: {prediction.day.temp_diff_min.toFixed(1)} - {prediction.day.temp_diff_max.toFixed(1)}</p>
            </div>
            <div className="bg-base-300/50 p-3 rounded-md">
                <p className="font-bold text-secondary">🌙 야간 추천 설정</p>
                <p>온도: {prediction.night.temp_min.toFixed(1)} - {prediction.night.temp_max.toFixed(1)}°C</p>
                <p>온도차: {prediction.night.temp_diff_min.toFixed(1)} - {prediction.night.temp_diff_max.toFixed(1)}</p>
            </div>
            <button
                onClick={handleApplyPrediction}
                className="w-full bg-secondary hover:bg-secondary/80 text-primary font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors"
            >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                적용 및 자동 모드 설정
            </button>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4 text-center">Powered by Google Gemini</p>
    </div>
  );
};

export default AIPredictionCard;
