import React from 'react';
import { NearbySatelliteInfo } from '../utils/satelliteCalculator';
import { Language, getTranslation } from '../i18n/translations';

interface NearbySatellitesProps {
  satellites: NearbySatelliteInfo[];
  language?: Language;
  onSelectSatellite?: (longitude: number) => void;
}

// Format longitude display (75W, 92.2E format)
const formatLongitude = (longitude: number): string => {
  if (longitude >= 0) {
    return `${longitude}E`;
  } else {
    return `${Math.abs(longitude)}W`;
  }
};

const NearbySatellites: React.FC<NearbySatellitesProps> = ({
  satellites,
  language = 'zh',
  onSelectSatellite
}) => {
  const t = getTranslation(language);

  if (satellites.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-700">{t.noNearbySatellites}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>{t.warning}</span>
        </p>
        <p className="text-xs text-yellow-700 mt-1">{t.nearbySatellitesDesc}</p>
      </div>

      <div className="space-y-2">
        {satellites.map((sat) => (
          <div
            key={sat.id}
            className={`bg-white border border-orange-200 rounded-lg p-3 ${
              onSelectSatellite ? 'cursor-pointer hover:bg-orange-50 transition-colors' : ''
            }`}
            onClick={() => onSelectSatellite?.(sat.longitude)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800">
                  {language === 'zh' ? sat.name : sat.name_en}
                </div>
                <div className="text-xs text-gray-500">
                  {formatLongitude(sat.longitude)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">
                  <span className="text-gray-500">{t.azimuth}: </span>
                  <span className="font-medium text-blue-600">{sat.azimuth.toFixed(2)}°</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">{t.elevation}: </span>
                  <span className="font-medium text-green-600">{sat.elevation.toFixed(2)}°</span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-orange-100 flex gap-4 text-xs">
              <span className="text-orange-600">
                {t.azimuthDiff}: {sat.azimuthDiff.toFixed(2)}°
              </span>
              <span className="text-orange-600">
                {t.elevationDiff}: {sat.elevationDiff.toFixed(2)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbySatellites;
