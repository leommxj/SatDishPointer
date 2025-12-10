// 卫星天线指向计算工具类
// 计算公式基于地球同步卫星（GEO）的几何关系

import { Language, getTranslation } from '../i18n/translations';

export interface CalculationInput {
  stationLatitude: number; // 地面站纬度（度）
  stationLongitude: number; // 地面站经度（度）
  satelliteLongitude: number; // 卫星经度（度）
  language?: Language; // 语言
}

export interface CalculationResult {
  azimuth: number; // 方位角（度）
  elevation: number; // 仰角（度）
  polarization: number; // 极化角（度）
  distance: number; // 距离（公里）
  valid: boolean; // 是否在可见范围内
  details: CalculationDetails; // 详细计算过程
}

export interface CalculationDetails {
  // 中间计算结果
  latitudeRad: number;
  longitudeRad: number;
  satelliteLongitudeRad: number;
  deltaLongitude: number;
  deltaLongitudeRad: number;
  earthRadiusKm: number;
  geosynchronousOrbitRadiusKm: number;

  // 计算步骤说明
  steps: CalculationStep[];
}

export interface CalculationStep {
  name: string;
  formula: string;
  value: number | string;
  unit?: string;
}

// 常量定义
const EARTH_RADIUS_KM = 6371; // 地球半径（公里）
const GEOSYNCHRONOUS_ORBIT_HEIGHT_KM = 35786; // 同步轨道高度（公里）
const GEOSYNCHRONOUS_ORBIT_RADIUS_KM = EARTH_RADIUS_KM + GEOSYNCHRONOUS_ORBIT_HEIGHT_KM; // 同步轨道半径

// 度转弧度
const degToRad = (degrees: number): number => {
  return degrees * Math.PI / 180;
};

// 弧度转度
const radToDeg = (radians: number): number => {
  return radians * 180 / Math.PI;
};

/**
 * 计算卫星天线指向参数
 * @param input 输入参数（地面站和卫星位置）
 * @returns 计算结果（方位角、仰角、极化角等）
 */
export const calculateSatellitePointing = (input: CalculationInput): CalculationResult => {
  const { stationLatitude, stationLongitude, satelliteLongitude, language = 'zh' } = input;
  const t = getTranslation(language);

  // 初始化计算步骤记录
  const steps: CalculationStep[] = [];

  // 1. 转换为弧度
  const latRad = degToRad(stationLatitude);
  const lonRad = degToRad(stationLongitude);
  const satLonRad = degToRad(satelliteLongitude);

  steps.push({
    name: t.stepLatitudeConversion,
    formula: 'φ = latitude × π / 180',
    value: `${stationLatitude}° → ${latRad.toFixed(4)} rad`,
    unit: 'rad'
  });

  // 2. 计算经度差
  const deltaLon = satelliteLongitude - stationLongitude;
  const deltaLonRad = degToRad(deltaLon);

  steps.push({
    name: t.stepLongitudeDiff,
    formula: 'Δλ = satellite_longitude - station_longitude',
    value: deltaLon.toFixed(2),
    unit: '°'
  });

  // 3. 计算方位角
  // 使用 atan2 确保角度在正确的象限
  let azimuth: number;
  if (Math.abs(deltaLon) < 0.001) {
    // 经度差很小，卫星在正南或正北
    azimuth = stationLatitude >= 0 ? 180 : 0;
  } else {
    // 标准方位角公式
    const tanAz = Math.tan(deltaLonRad) / Math.sin(latRad);
    if (stationLatitude >= 0) {
      // 北半球
      azimuth = 180 - radToDeg(Math.atan(tanAz));
    } else {
      // 南半球
      azimuth = radToDeg(Math.atan(tanAz));
      if (deltaLon < 0) {
        azimuth = 360 + azimuth;
      }
    }
  }

  // 确保方位角在 0-360 度范围内
  if (azimuth < 0) azimuth += 360;
  if (azimuth >= 360) azimuth -= 360;

  steps.push({
    name: t.stepAzimuthCalc,
    formula: stationLatitude >= 0
      ? 'Az = 180° - atan(tan(Δλ) / sin(φ))'
      : 'Az = atan(tan(Δλ) / sin(φ))',
    value: azimuth.toFixed(2),
    unit: '°'
  });

  // 4. 计算仰角
  // 使用正确的公式计算地心角
  const cosGamma = Math.cos(latRad) * Math.cos(deltaLonRad);
  const gamma = Math.acos(cosGamma);

  steps.push({
    name: t.stepCentralAngle,
    formula: 'γ = acos(cos(φ) × cos(Δλ))',
    value: radToDeg(gamma).toFixed(2),
    unit: '°'
  });

  // 计算距离（使用余弦定理）
  const r1 = EARTH_RADIUS_KM;
  const r2 = GEOSYNCHRONOUS_ORBIT_RADIUS_KM;
  const distanceKm = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * cosGamma);

  steps.push({
    name: t.stepDistance,
    formula: 'd = √(R₁² + R₂² - 2×R₁×R₂×cos(γ))',
    value: distanceKm.toFixed(0),
    unit: 'km'
  });

  // 正确的仰角计算公式
  const sinGamma = Math.sin(gamma);
  let elevation: number;

  if (Math.abs(sinGamma) < 0.001) {
    // gamma 接近 0 或 180 度，特殊处理
    elevation = 90;
  } else {
    const tanEl = (cosGamma - r1 / r2) / sinGamma;
    elevation = radToDeg(Math.atan(tanEl));
  }

  steps.push({
    name: t.stepElevationCalc,
    formula: 'El = atan((cos(γ) - R₁/R₂) / sin(γ))',
    value: elevation.toFixed(2),
    unit: '°'
  });

  // 5. 计算极化角
  // 正确的极化角公式（北半球为正，南半球为负）
  let polarization: number;
  if (Math.abs(stationLatitude) < 0.1) {
    // 赤道附近
    polarization = 0;
  } else {
    // 标准极化角公式
    polarization = radToDeg(Math.atan(Math.sin(deltaLonRad) / Math.tan(latRad)));

    // 根据地理位置调整符号
    if (stationLatitude < 0) {
      polarization = -polarization;
    }
  }

  steps.push({
    name: t.stepPolarizationCalc,
    formula: 'Pol = atan(sin(Δλ) / tan(φ))',
    value: polarization.toFixed(2),
    unit: '°'
  });

  // 6. 判断卫星是否可见（仰角必须大于0）
  const valid = elevation > 0;

  steps.push({
    name: t.stepVisibilityCheck,
    formula: 'Elevation > 0°',
    value: valid ? t.visible : t.notVisible,
  });

  // 准备详细信息
  const details: CalculationDetails = {
    latitudeRad: latRad,
    longitudeRad: lonRad,
    satelliteLongitudeRad: satLonRad,
    deltaLongitude: deltaLon,
    deltaLongitudeRad: deltaLonRad,
    earthRadiusKm: EARTH_RADIUS_KM,
    geosynchronousOrbitRadiusKm: GEOSYNCHRONOUS_ORBIT_RADIUS_KM,
    steps: steps
  };

  return {
    azimuth: azimuth,
    elevation: elevation,
    polarization: polarization,
    distance: distanceKm,
    valid: valid,
    details: details
  };
};

/**
 * 格式化角度显示（度分秒格式）
 * @param degrees 角度值
 * @returns 格式化的字符串
 */
export const formatAngle = (degrees: number): string => {
  const absolute = Math.abs(degrees);
  const deg = Math.floor(absolute);
  const minFloat = (absolute - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);

  const sign = degrees < 0 ? '-' : '';
  return `${sign}${deg}° ${min}′ ${sec}″`;
};

/**
 * 格式化方位角为方向描述（如：南偏西30°）
 * @param azimuth 方位角（0-360度，0为正北，顺时针）
 * @param language 语言
 * @returns 方向描述字符串
 */
export const formatAzimuthDirection = (azimuth: number, language: Language = 'zh'): string => {
  const t = getTranslation(language);

  // 归一化到 0-360
  let az = azimuth % 360;
  if (az < 0) az += 360;

  const threshold = 0.5; // 角度阈值，小于此值视为正方向

  // 判断主方向和偏移
  if (az < threshold || az > 360 - threshold) {
    return t.dueNorth; // 正北
  } else if (Math.abs(az - 90) < threshold) {
    return t.dueEast; // 正东
  } else if (Math.abs(az - 180) < threshold) {
    return t.dueSouth; // 正南
  } else if (Math.abs(az - 270) < threshold) {
    return t.dueWest; // 正西
  } else if (az > 0 && az < 45) {
    // 北偏东 (0-45)
    return `${t.northByEast} ${az.toFixed(1)}°`;
  } else if (az >= 45 && az < 90) {
    // 东偏北 (45-90)
    return `${t.eastByNorth} ${(90 - az).toFixed(1)}°`;
  } else if (az > 90 && az < 135) {
    // 东偏南 (90-135)
    return `${t.eastBySouth} ${(az - 90).toFixed(1)}°`;
  } else if (az >= 135 && az < 180) {
    // 南偏东 (135-180)
    return `${t.southByEast} ${(180 - az).toFixed(1)}°`;
  } else if (az > 180 && az < 225) {
    // 南偏西 (180-225)
    return `${t.southByWest} ${(az - 180).toFixed(1)}°`;
  } else if (az >= 225 && az < 270) {
    // 西偏南 (225-270)
    return `${t.westBySouth} ${(270 - az).toFixed(1)}°`;
  } else if (az > 270 && az < 315) {
    // 西偏北 (270-315)
    return `${t.westByNorth} ${(az - 270).toFixed(1)}°`;
  } else {
    // 北偏西 (315-360)
    return `${t.northByWest} ${(360 - az).toFixed(1)}°`;
  }
};

/**
 * 计算天线增益（简化模型）
 * @param diameter 天线直径（米）
 * @param frequency 频率（GHz）
 * @param efficiency 天线效率（0-1）
 * @returns 增益（dBi）
 */
export const calculateAntennaGain = (
  diameter: number,
  frequency: number,
  efficiency: number = 0.65
): number => {
  // G = 10 * log10(efficiency * (π * D * f / c)²)
  // 其中 c = 0.3 (光速，单位：m/GHz)
  const c = 0.3; // 光速 (m/GHz)
  const gain = 10 * Math.log10(efficiency * Math.pow(Math.PI * diameter * frequency / c, 2));
  return gain;
};

/**
 * 计算3dB波束宽度
 * @param diameter 天线直径（米）
 * @param frequency 频率（GHz）
 * @returns 波束宽度（度）
 */
export const calculateBeamwidth = (diameter: number, frequency: number): number => {
  // θ = 70 * λ / D = 70 * c / (f * D)
  // 其中 c = 0.3 (光速，单位：m/GHz)
  const c = 0.3; // 光速 (m/GHz)
  const beamwidth = 70 * c / (frequency * diameter);
  return beamwidth;
};

/**
 * 根据仰角计算路径衰减（自由空间路径损耗）
 * @param distance 距离（公里）
 * @param frequency 频率（GHz）
 * @returns 路径损耗（dB）
 */
export const calculatePathLoss = (distance: number, frequency: number): number => {
  // L = 20 * log10(distance) + 20 * log10(frequency) + 92.45
  const loss = 20 * Math.log10(distance) + 20 * Math.log10(frequency) + 92.45;
  return loss;
};

/**
 * 计算雨衰（简化模型，仅供参考）
 * @param elevation 仰角（度）
 * @param frequency 频率（GHz）
 * @param rainRate 降雨率（mm/h）
 * @returns 雨衰（dB）
 */
export const calculateRainAttenuation = (
  elevation: number,
  frequency: number,
  rainRate: number = 10
): number => {
  // 简化的雨衰模型
  // 仅在Ku波段（12-18 GHz）有显著影响
  if (frequency < 10) return 0;

  // 路径长度因子（仰角越低，路径越长）
  const pathFactor = 1 / Math.sin(degToRad(Math.max(elevation, 5)));

  // 频率因子
  const freqFactor = Math.pow(frequency / 10, 2);

  // 雨衰 = 雨率因子 * 路径因子 * 频率因子
  const attenuation = 0.01 * rainRate * pathFactor * freqFactor;

  return Math.min(attenuation, 20); // 限制最大值
};