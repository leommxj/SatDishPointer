import React from 'react';
import { NearbySatelliteInfo } from '../utils/satelliteCalculator';
import { Language, getTranslation } from '../i18n/translations';

interface PointingSearchResultsProps {
  results: NearbySatelliteInfo[];
  language?: Language;
  onSelectSatellite?: (satellite: NearbySatelliteInfo) => void;
}

const formatLongitude = (longitude: number): string => {
  return longitude >= 0 ? `${longitude}E` : `${Math.abs(longitude)}W`;
};

const PointingSearchResults: React.FC<PointingSearchResultsProps> = ({
  results,
  language = 'zh',
  onSelectSatellite
}) => {
  const t = getTranslation(language);

  if (results.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">{t.pointingSearchNoMatches}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500">
        {t.pointingSearchResults} ({results.length})
      </div>
      {results.map((sat) => (
        <div
          key={sat.id}
          className={`bg-white border border-blue-200 rounded-lg p-3 ${
            onSelectSatellite ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''
          }`}
          onClick={() => onSelectSatellite?.(sat)}
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
          <div className="mt-2 pt-2 border-t border-blue-100 flex gap-4 text-xs">
            <span className="text-blue-700">
              {t.azimuthDiff}: {sat.azimuthDiff.toFixed(2)}°
            </span>
            <span className="text-blue-700">
              {t.elevationDiff}: {sat.elevationDiff.toFixed(2)}°
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointingSearchResults;
