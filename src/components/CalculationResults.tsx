import React from 'react';
import { CalculationResult, formatAngle, formatAzimuthDirection } from '../utils/satelliteCalculator';
import { Antenna } from '../data/antennas';
import { Language, getTranslation } from '../i18n/translations';

interface CalculationResultsProps {
  result: CalculationResult;
  showDetails: boolean;
  onToggleDetails: () => void;
  antenna?: Antenna | null;
  installationMode?: 'normal' | 'inverted';
  customOffsetAngle?: number | null;
  language?: Language;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({
  result,
  showDetails,
  onToggleDetails,
  antenna,
  installationMode = 'normal',
  customOffsetAngle,
  language = 'zh'
}) => {
  const t = getTranslation(language);

  // 获取实际使用的偏馈角
  const getOffsetAngle = (): number => {
    if (customOffsetAngle !== null && customOffsetAngle !== undefined) {
      return customOffsetAngle;
    }
    return antenna?.offsetAngle || 22.5;
  };

  // 计算偏馈天线的实际仰角
  const calculateActualElevation = (): number => {
    if (!antenna || antenna.type !== 'offset') {
      return result.elevation;
    }

    const offsetAngle = getOffsetAngle();
    // 正装：实际仰角 = 理论仰角 - 偏馈角
    // 倒装：实际仰角 = 理论仰角 + 偏馈角
    return installationMode === 'normal'
      ? result.elevation - offsetAngle
      : result.elevation + offsetAngle;
  };

  const actualElevation = calculateActualElevation();
  const offsetAngle = getOffsetAngle();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.calculationResults}</h3>

      {/* 主要结果 */}
      <div className="space-y-3">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t.azimuth}</span>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">
                {result.azimuth.toFixed(2)}°
              </div>
              <div className="text-sm text-gray-600">
                {formatAngle(result.azimuth)}
              </div>
              <div className="text-sm text-blue-500 font-medium mt-1">
                {formatAzimuthDirection(result.azimuth, language)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              {antenna?.type === 'offset' ? t.theoreticalElevation : t.elevation}
            </span>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">
                {result.elevation.toFixed(2)}°
              </div>
              <div className="text-sm text-gray-600">
                {formatAngle(result.elevation)}
              </div>
            </div>
          </div>
        </div>

        {/* 偏馈天线的实际仰角 */}
        {antenna?.type === 'offset' && (
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                {t.actualElevation}
                <span className="text-xs text-gray-500 ml-1">
                  ({installationMode === 'normal' ? t.normalInstall.split('（')[0] : t.invertedInstall.split('（')[0]})
                </span>
              </span>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-600">
                  {actualElevation.toFixed(2)}°
                </div>
                <div className="text-sm text-gray-600">
                  {formatAngle(actualElevation)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t.offsetAngle}: {offsetAngle}°
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t.polarization}</span>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">
                {result.polarization.toFixed(2)}°
              </div>
              <div className="text-sm text-gray-600">
                {formatAngle(result.polarization)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t.distance}</span>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-700">
                {result.distance.toFixed(0)} km
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 可见性状态 */}
      <div className={`rounded-lg p-3 ${result.valid ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className="flex items-center">
          <span className={`text-sm font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            {result.valid ? t.satelliteVisible : t.satelliteNotVisible}
          </span>
        </div>
      </div>

      {/* 详细计算过程按钮 */}
      <button
        onClick={onToggleDetails}
        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-sm font-medium"
      >
        {showDetails ? t.hideDetails : t.showDetails}
      </button>

      {/* 详细计算过程 */}
      {showDetails && result.details && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-gray-700">{t.calculationDetails}</h4>

          {/* 基本参数 */}
          <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
            <div className="font-medium mb-2">{t.basicParams}</div>
            <div>{t.earthRadius}: {result.details.earthRadiusKm} km</div>
            <div>{t.geoOrbitRadius}: {result.details.geosynchronousOrbitRadiusKm} km</div>
            <div>{t.longitudeDiff}: {result.details.deltaLongitude.toFixed(2)}°</div>
          </div>

          {/* 计算步骤 */}
          <div className="space-y-2">
            {result.details.steps.map((step, index) => (
              <div key={index} className="bg-white border rounded p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {index + 1}. {step.name}
                </div>
                <div className="text-xs text-gray-600 font-mono mb-1">
                  {step.formula}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  = {step.value} {step.unit}
                </div>
              </div>
            ))}
          </div>

          {/* 提示信息 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              <strong>{t.tipTitle}</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-2 space-y-1 list-disc list-inside">
              <li>{t.tipObstacles}</li>
              <li>{t.tipVertical}</li>
              <li>{t.tipMagnetic}</li>
              <li>{t.tipWeather}</li>
              <li>{t.tipLnbFreq}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResults;
