import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import type { Greenhouse, Setpoint } from '../types';

interface MollierChartProps {
  greenhouse: Greenhouse;
}

const getZoneCoords = (setpoint: Setpoint) => ({
    x1: setpoint.temp_min,
    x2: setpoint.temp_max,
    y1: setpoint.temp_min - setpoint.temp_diff_max,
    y2: setpoint.temp_max - setpoint.temp_diff_min,
});

const MollierChart: React.FC<MollierChartProps> = ({ greenhouse }) => {
  const { sensorData, expertSettings, predictedSettings } = greenhouse;
  const isDay = sensorData.isDay;

  const currentData = [{
    x: sensorData.temp,
    y: sensorData.wetBulbTemp,
    z: 150, // Value for Z-axis to control size
  }];

  const optimalZone = isDay ? expertSettings.day : expertSettings.night;
  const optimalCoords = getZoneCoords(optimalZone);

  const predictedZone = predictedSettings ? (isDay ? predictedSettings.day : predictedSettings.night) : null;
  const predictedCoords = predictedZone ? getZoneCoords(predictedZone) : null;
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis type="number" dataKey="x" name="건구 온도" unit="°C" domain={[0, 45]} stroke="#9CA3AF" />
          <YAxis type="number" dataKey="y" name="습구 온도" unit="°C" domain={[0, 45]} stroke="#9CA3AF" />
          <ZAxis type="number" dataKey="z" range={[150, 150]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />

          {/* Optimal Zone */}
          <ReferenceArea {...optimalCoords} stroke="#97BC62" strokeOpacity={0.6} fill="#97BC62" fillOpacity={0.2}>
            <Label value="현재 설정값" position="insideTopLeft" fill="#97BC62" fontSize={12} />
          </ReferenceArea>
          
          {/* Predicted Zone */}
          {predictedCoords && (
            <ReferenceArea {...predictedCoords} stroke="#5bc0de" strokeOpacity={0.8} fill="#5bc0de" fillOpacity={0.2} strokeDasharray="5 5">
               <Label value="AI 추천값" position="insideBottomRight" fill="#5bc0de" fontSize={12} />
            </ReferenceArea>
          )}

          <Scatter name="현재 상태" data={currentData} fill="#EF4444" shape="star" />

        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MollierChart;