export interface SensorData {
  temp: number;
  rootTemp: number;
  humidity: number;
  dewPoint: number;
  vpd: number;
  co2: number;
  isDay: boolean;
  wetBulbTemp: number;
}

export interface ManualSettings {
  [key: string]: boolean;
}

export interface JojoGaonRule {
  id: string;
  timeBeforeSunrise: number;
  targetTemp: number;
}

export interface ControlState {
  activeMode: 'manual' | 'auto';
  manualSettings: ManualSettings;
  useExpertSettings: boolean;
  autoSubType: 'stable' | 'ml_optimization';
  jojoGaonRules: JojoGaonRule[];
}

export interface Setpoint {
    temp_min: number;
    temp_max: number;
    temp_diff_min: number;
    temp_diff_max: number;
}

export interface ExpertSettings {
    day: Setpoint;
    night: Setpoint;
}

export interface Greenhouse {
  id: string;
  name: string;
  plantingDate: string;
  sensorData: SensorData;
  controlState: ControlState;
  devices: { [key: string]: string };
  expertSettings: ExpertSettings;
  predictedSettings?: ExpertSettings;
}

export interface AIPrediction {
    day: Setpoint;
    night: Setpoint;
}
