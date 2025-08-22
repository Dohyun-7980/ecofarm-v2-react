
import { GoogleGenAI, Type } from "@google/genai";
import type { AIPrediction, Greenhouse } from '../types';

// TODO: 실제 Google AI Studio에서 발급받은 당신의 API 키를 여기에 입력하세요.
// 주의: 이 방식은 개발 편의를 위한 것이며, 실제 제품에서는 키를 코드에 노출해서는 안 됩니다.
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
  console.warn("Gemini API 키가 geminiService.ts 파일에 설정되지 않았습니다.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIPrediction = async (greenhouse: Greenhouse): Promise<AIPrediction> => {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Gemini API 키가 구성되지 않았습니다.");
  }
  
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    제공된 온실 데이터를 분석하여 작물의 수확량을 극대화하기 위한 최적의 환경 설정을 생성하세요.
    
    온실 이름: ${greenhouse.name}
    현재 작물: 이름을 기반으로 일반적인 작물을 가정하세요 (예: '토마토 온실'의 경우 '토마토').
    현재 센서 데이터:
    - 온도: ${greenhouse.sensorData.temp}°C
    - 습도: ${greenhouse.sensorData.humidity}%
    - CO2: ${greenhouse.sensorData.co2} ppm
    - 시간대: ${greenhouse.sensorData.isDay ? '주간' : '야간'}

    이 정보를 바탕으로 '주간'과 '야간' 모두에 대한 최적의 설정을 제공하세요.
    'temp_diff'는 건구 온도와 습구 온도의 이상적인 차이를 나타내며, 이는 습도 제어의 대리 지표로 사용됩니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            day: {
              type: Type.OBJECT,
              properties: {
                temp_min: { type: Type.NUMBER, description: "최적 주간 최저 온도 (섭씨)." },
                temp_max: { type: Type.NUMBER, description: "최적 주간 최고 온도 (섭씨)." },
                temp_diff_min: { type: Type.NUMBER, description: "최적 주간 건구/습구 최소 온도차." },
                temp_diff_max: { type: Type.NUMBER, description: "최적 주간 건구/습구 최대 온도차." },
              }
            },
            night: {
              type: Type.OBJECT,
              properties: {
                temp_min: { type: Type.NUMBER, description: "최적 야간 최저 온도 (섭씨)." },
                temp_max: { type: Type.NUMBER, description: "최적 야간 최고 온도 (섭씨)." },
                temp_diff_min: { type: Type.NUMBER, description: "최적 야간 건구/습구 최소 온도차." },
                temp_diff_max: { type: Type.NUMBER, description: "최적 야간 건구/습구 최대 온도차." },
              }
            }
          }
        },
      }
    });

    const jsonText = response.text.trim();
    const prediction = JSON.parse(jsonText) as AIPrediction;
    
    // Basic validation
    if (!prediction.day || !prediction.night) {
        throw new Error("AI 응답에 'day' 또는 'night' 속성이 없습니다.");
    }

    return prediction;

  } catch (error) {
    console.error("Error fetching AI prediction:", error);
    throw new Error("AI 모델로부터 유효한 예측을 가져오지 못했습니다.");
  }
};
