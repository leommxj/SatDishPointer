import { Language, getTranslation } from '../i18n/translations';

export interface CalculationInput {
  stationLatitude: number;
  stationLongitude: number;
  satelliteLongitude: number;
  language?: Language;
}

export interface CalculationResult {
  azimuth: number;
  elevation: number;
  polarization: number;
  distance: number;
  valid: boolean;
  details: CalculationDetails;
}

export interface CalculationDetails {
  latitudeRad: number;
  longitudeRad: number;
  satelliteLongitudeRad: number;
  deltaLongitude: number;
  deltaLongitudeRad: number;
  earthRadiusKm: number;
  geosynchronousOrbitRadiusKm: number;
  steps: CalculationStep[];
}

export interface CalculationStep {
  name: string;
  formula: string;
  value: number | string;
  unit?: string;
}

const EARTH_RADIUS_KM = 6371;
const GEOSYNCHRONOUS_ORBIT_HEIGHT_KM = 35786;
const GEOSYNCHRONOUS_ORBIT_RADIUS_KM = EARTH_RADIUS_KM + GEOSYNCHRONOUS_ORBIT_HEIGHT_KM;

const degToRad = (degrees: number): number => degrees * Math.PI / 180;
const radToDeg = (radians: number): number => radians * 180 / Math.PI;

export const calculateSatellitePointing = (input: CalculationInput): CalculationResult => {
  const { stationLatitude, stationLongitude, satelliteLongitude, language = 'zh' } = input;
  const t = getTranslation(language);
  const steps: CalculationStep[] = [];

  const latRad = degToRad(stationLatitude);
  const lonRad = degToRad(stationLongitude);
  const satLonRad = degToRad(satelliteLongitude);

  steps.push({
    name: t.stepLatitudeConversion,
    formula: 'φ = latitude × π / 180',
    value: `${stationLatitude}° → ${latRad.toFixed(4)} rad`,
    unit: 'rad'
  });

  const deltaLon = satelliteLongitude - stationLongitude;
  const deltaLonRad = degToRad(deltaLon);

  steps.push({
    name: t.stepLongitudeDiff,
    formula: 'Δλ = satellite_longitude - station_longitude',
    value: deltaLon.toFixed(2),
    unit: '°'
  });

  let azimuth: number;
  if (Math.abs(deltaLon) < 0.001) {
    azimuth = stationLatitude >= 0 ? 180 : 0;
  } else {
    const tanAz = Math.tan(deltaLonRad) / Math.sin(latRad);
    if (stationLatitude >= 0) {
      azimuth = 180 - radToDeg(Math.atan(tanAz));
    } else {
      azimuth = radToDeg(Math.atan(tanAz));
      if (deltaLon < 0) {
        azimuth = 360 + azimuth;
      }
    }
  }

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

  const cosGamma = Math.cos(latRad) * Math.cos(deltaLonRad);
  const gamma = Math.acos(cosGamma);

  steps.push({
    name: t.stepCentralAngle,
    formula: 'γ = acos(cos(φ) × cos(Δλ))',
    value: radToDeg(gamma).toFixed(2),
    unit: '°'
  });

  const r1 = EARTH_RADIUS_KM;
  const r2 = GEOSYNCHRONOUS_ORBIT_RADIUS_KM;
  const distanceKm = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * cosGamma);

  steps.push({
    name: t.stepDistance,
    formula: 'd = √(R₁² + R₂² - 2×R₁×R₂×cos(γ))',
    value: distanceKm.toFixed(0),
    unit: 'km'
  });

  const sinGamma = Math.sin(gamma);
  let elevation: number;

  if (Math.abs(sinGamma) < 0.001) {
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

  let polarization: number;
  if (Math.abs(stationLatitude) < 0.1) {
    polarization = 0;
  } else {
    polarization = radToDeg(Math.atan(Math.sin(deltaLonRad) / Math.tan(latRad)));
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

  const valid = elevation > 0;

  steps.push({
    name: t.stepVisibilityCheck,
    formula: 'Elevation > 0°',
    value: valid ? t.visible : t.notVisible,
  });

  const details: CalculationDetails = {
    latitudeRad: latRad,
    longitudeRad: lonRad,
    satelliteLongitudeRad: satLonRad,
    deltaLongitude: deltaLon,
    deltaLongitudeRad: deltaLonRad,
    earthRadiusKm: EARTH_RADIUS_KM,
    geosynchronousOrbitRadiusKm: GEOSYNCHRONOUS_ORBIT_RADIUS_KM,
    steps
  };

  return { azimuth, elevation, polarization, distance: distanceKm, valid, details };
};

export const formatAngle = (degrees: number): string => {
  const absolute = Math.abs(degrees);
  const deg = Math.floor(absolute);
  const minFloat = (absolute - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  const sign = degrees < 0 ? '-' : '';
  return `${sign}${deg}° ${min}′ ${sec}″`;
};

export const formatAzimuthDirection = (azimuth: number, language: Language = 'zh'): string => {
  const t = getTranslation(language);

  let az = azimuth % 360;
  if (az < 0) az += 360;

  const threshold = 0.5;

  if (az < threshold || az > 360 - threshold) {
    return t.dueNorth;
  } else if (Math.abs(az - 90) < threshold) {
    return t.dueEast;
  } else if (Math.abs(az - 180) < threshold) {
    return t.dueSouth;
  } else if (Math.abs(az - 270) < threshold) {
    return t.dueWest;
  } else if (az > 0 && az < 90) {
    return `${t.northByEast} ${az.toFixed(1)}°`;
  } else if (az > 90 && az < 180) {
    return `${t.southByEast} ${(180 - az).toFixed(1)}°`;
  } else if (az > 180 && az < 270) {
    return `${t.southByWest} ${(az - 180).toFixed(1)}°`;
  } else {
    return `${t.northByWest} ${(360 - az).toFixed(1)}°`;
  }
};

export const calculateAntennaGain = (
  diameter: number,
  frequency: number,
  efficiency: number = 0.65
): number => {
  const c = 0.3;
  return 10 * Math.log10(efficiency * Math.pow(Math.PI * diameter * frequency / c, 2));
};

export const calculateBeamwidth = (diameter: number, frequency: number): number => {
  const c = 0.3;
  return 70 * c / (frequency * diameter);
};

export const calculatePathLoss = (distance: number, frequency: number): number => {
  return 20 * Math.log10(distance) + 20 * Math.log10(frequency) + 92.45;
};

export const calculateRainAttenuation = (
  elevation: number,
  frequency: number,
  rainRate: number = 10
): number => {
  if (frequency < 10) return 0;
  const pathFactor = 1 / Math.sin(degToRad(Math.max(elevation, 5)));
  const freqFactor = Math.pow(frequency / 10, 2);
  const attenuation = 0.01 * rainRate * pathFactor * freqFactor;
  return Math.min(attenuation, 20);
};

export interface NearbySatelliteInfo {
  id: string;
  name: string;
  name_en: string;
  longitude: number;
  azimuth: number;
  elevation: number;
  azimuthDiff: number;
  elevationDiff: number;
}

export const findNearbySatellites = (
  stationLatitude: number,
  stationLongitude: number,
  targetSatelliteLongitude: number,
  satellites: Array<{ id: string; name: string; name_en: string; longitude: number }>,
  azimuthThreshold: number = 10,
  elevationThreshold: number = 5
): NearbySatelliteInfo[] => {
  const targetResult = calculateSatellitePointing({
    stationLatitude,
    stationLongitude,
    satelliteLongitude: targetSatelliteLongitude
  });

  if (!targetResult.valid) return [];

  const nearbySatellites: NearbySatelliteInfo[] = [];

  for (const sat of satellites) {
    if (Math.abs(sat.longitude - targetSatelliteLongitude) < 0.1) continue;

    const result = calculateSatellitePointing({
      stationLatitude,
      stationLongitude,
      satelliteLongitude: sat.longitude
    });

    if (!result.valid) continue;

    const azimuthDiff = Math.abs(result.azimuth - targetResult.azimuth);
    const elevationDiff = Math.abs(result.elevation - targetResult.elevation);

    if (azimuthDiff <= azimuthThreshold && elevationDiff <= elevationThreshold) {
      nearbySatellites.push({
        id: sat.id,
        name: sat.name,
        name_en: sat.name_en,
        longitude: sat.longitude,
        azimuth: result.azimuth,
        elevation: result.elevation,
        azimuthDiff,
        elevationDiff
      });
    }
  }

  nearbySatellites.sort((a, b) => a.azimuthDiff - b.azimuthDiff);
  return nearbySatellites;
};

export const findSatellitesByPointing = (
  stationLatitude: number,
  stationLongitude: number,
  targetAzimuth: number,
  targetElevation: number,
  satellites: Array<{ id: string; name: string; name_en: string; longitude: number }>,
  azimuthThreshold: number = 10,
  elevationThreshold: number = 5
): NearbySatelliteInfo[] => {
  const matches: NearbySatelliteInfo[] = [];

  for (const sat of satellites) {
    const result = calculateSatellitePointing({
      stationLatitude,
      stationLongitude,
      satelliteLongitude: sat.longitude
    });

    if (!result.valid) continue;

    const rawAzimuthDiff = Math.abs(result.azimuth - targetAzimuth);
    const azimuthDiff = rawAzimuthDiff > 180 ? 360 - rawAzimuthDiff : rawAzimuthDiff;
    const elevationDiff = Math.abs(result.elevation - targetElevation);

    if (azimuthDiff <= azimuthThreshold && elevationDiff <= elevationThreshold) {
      matches.push({
        id: sat.id,
        name: sat.name,
        name_en: sat.name_en,
        longitude: sat.longitude,
        azimuth: result.azimuth,
        elevation: result.elevation,
        azimuthDiff,
        elevationDiff
      });
    }
  }

  matches.sort((a, b) => (a.azimuthDiff + a.elevationDiff) - (b.azimuthDiff + b.elevationDiff));
  return matches;
};
