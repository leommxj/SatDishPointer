import React, { useState, useEffect } from 'react';
import { satellites, Satellite } from './data/satellites';
import { antennas, Antenna } from './data/antennas';
import { locations, Location } from './data/locations';
import {
  calculateSatellitePointing,
  CalculationResult
} from './utils/satelliteCalculator';
import SatelliteDishVisualization from './components/SatelliteDishVisualization';
import CalculationResults from './components/CalculationResults';
import { Language, getTranslation } from './i18n/translations';

// 从URL获取语言参数
const getLanguageFromUrl = (): Language => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang === 'en' || lang === 'zh') {
    return lang;
  }
  // 检查浏览器语言
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

// 更新URL语言参数
const updateUrlLanguage = (lang: Language) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());
};

// 解析经度输入（支持 75W、92.2E、105.5 等格式）
const parseLongitudeInput = (input: string): number | null => {
  if (!input || input.trim() === '') return null;

  const trimmed = input.trim().toUpperCase();

  // 匹配格式：数字 + 可选的E/W
  const match = trimmed.match(/^(-?\d+\.?\d*)\s*([EW])?$/);
  if (!match) return null;

  let value = parseFloat(match[1]);
  if (isNaN(value)) return null;

  const direction = match[2];
  if (direction === 'W') {
    value = -Math.abs(value);
  } else if (direction === 'E') {
    value = Math.abs(value);
  }

  if (value < -180 || value > 180) return null;

  return value;
};

// 格式化经度显示（75W、92.2E 格式）
const formatLongitude = (longitude: number): string => {
  if (longitude >= 0) {
    return `${longitude}E`;
  } else {
    return `${Math.abs(longitude)}W`;
  }
};

// URL参数接口
interface UrlParams {
  lang?: Language;
  lat?: string;
  lon?: string;
  sat?: string;
  satLon?: string;
  antenna?: string;
  offset?: string;
  mode?: 'normal' | 'inverted';
}

// 从URL获取所有参数
const getParamsFromUrl = (): UrlParams => {
  const params = new URLSearchParams(window.location.search);
  return {
    lang: (params.get('lang') as Language) || undefined,
    lat: params.get('lat') || undefined,
    lon: params.get('lon') || undefined,
    sat: params.get('sat') || undefined,
    satLon: params.get('satLon') || undefined,
    antenna: params.get('antenna') || undefined,
    offset: params.get('offset') || undefined,
    mode: (params.get('mode') as 'normal' | 'inverted') || undefined,
  };
};

function App() {
  // 状态管理
  const [language, setLanguage] = useState<Language>(getLanguageFromUrl);
  const t = getTranslation(language);

  // 语言切换时更新URL
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    updateUrlLanguage(lang);
  };

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [customLatitude, setCustomLatitude] = useState<string>('');
  const [customLongitude, setCustomLongitude] = useState<string>('');
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [customSatelliteLongitude, setCustomSatelliteLongitude] = useState<string>('');
  const [useCustomSatellite, setUseCustomSatellite] = useState<boolean>(false);
  const [selectedAntenna, setSelectedAntenna] = useState<Antenna | null>(null);
  const [customOffsetAngle, setCustomOffsetAngle] = useState<string>('');
  const [installationMode, setInstallationMode] = useState<'normal' | 'inverted'>('normal');
  const [useCustomLocation, setUseCustomLocation] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [satelliteSearch, setSatelliteSearch] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // 初始化时从URL加载参数
  useEffect(() => {
    const urlParams = getParamsFromUrl();

    // 加载位置参数
    if (urlParams.lat && urlParams.lon) {
      setCustomLatitude(urlParams.lat);
      setCustomLongitude(urlParams.lon);
      setUseCustomLocation(true);
    }

    // 加载卫星参数
    if (urlParams.satLon) {
      setCustomSatelliteLongitude(urlParams.satLon);
      setUseCustomSatellite(true);
    } else if (urlParams.sat) {
      const sat = satellites.find(s => s.id === urlParams.sat);
      if (sat) {
        setSelectedSatellite(sat);
      }
    }

    // 加载天线参数
    if (urlParams.antenna) {
      const ant = antennas.find(a => a.id === urlParams.antenna);
      if (ant) {
        setSelectedAntenna(ant);
      }
    }

    // 加载偏置角
    if (urlParams.offset) {
      setCustomOffsetAngle(urlParams.offset);
    }

    // 加载安装模式
    if (urlParams.mode === 'normal' || urlParams.mode === 'inverted') {
      setInstallationMode(urlParams.mode);
    }
  }, []);

  // 生成分享URL
  const generateShareUrl = (): string => {
    const url = new URL(window.location.origin + window.location.pathname);

    // 语言
    url.searchParams.set('lang', language);

    // 位置参数
    if (useCustomLocation && customLatitude && customLongitude) {
      url.searchParams.set('lat', customLatitude);
      url.searchParams.set('lon', customLongitude);
    } else if (selectedLocation) {
      url.searchParams.set('lat', selectedLocation.latitude.toString());
      url.searchParams.set('lon', selectedLocation.longitude.toString());
    }

    // 卫星参数
    if (useCustomSatellite && customSatelliteLongitude) {
      url.searchParams.set('satLon', customSatelliteLongitude);
    } else if (selectedSatellite) {
      url.searchParams.set('sat', selectedSatellite.id);
    }

    // 天线参数
    if (selectedAntenna) {
      url.searchParams.set('antenna', selectedAntenna.id);

      // 偏置角（仅偏馈天线）
      if (selectedAntenna.type === 'offset' && customOffsetAngle) {
        url.searchParams.set('offset', customOffsetAngle);
      }

      // 安装模式
      if (selectedAntenna.type === 'offset') {
        url.searchParams.set('mode', installationMode);
      }
    }

    return url.toString();
  };

  // 复制URL到剪贴板
  const copyShareUrl = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // 降级方案：创建临时输入框
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // 过滤位置列表
  const filteredLocations = locationSearch.trim()
    ? locations.filter(l =>
        l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
        l.name_en.toLowerCase().includes(locationSearch.toLowerCase()) ||
        (l.province && l.province.toLowerCase().includes(locationSearch.toLowerCase()))
      )
    : locations;

  // 过滤卫星列表
  const filteredSatellites = satelliteSearch.trim()
    ? satellites.filter(s =>
        s.name.toLowerCase().includes(satelliteSearch.toLowerCase()) ||
        s.name_en.toLowerCase().includes(satelliteSearch.toLowerCase()) ||
        s.longitude.toString().includes(satelliteSearch)
      )
    : satellites;

  // 获取GPS位置
  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(t.gpsNotSupported);
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomLatitude(position.coords.latitude.toFixed(4));
        setCustomLongitude(position.coords.longitude.toFixed(4));
        setUseCustomLocation(true);
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError(t.gpsPermissionDenied);
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError(t.gpsPositionUnavailable);
            break;
          case error.TIMEOUT:
            setGpsError(t.gpsTimeout);
            break;
          default:
            setGpsError(t.gpsError);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 执行计算
  const performCalculation = () => {
    let latitude: number;
    let longitude: number;

    if (useCustomLocation) {
      latitude = parseFloat(customLatitude);
      longitude = parseFloat(customLongitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        alert(t.pleaseEnterValidCoords);
        return;
      }
    } else {
      if (!selectedLocation) {
        alert(t.pleaseSelectLocation);
        return;
      }
      latitude = selectedLocation.latitude;
      longitude = selectedLocation.longitude;
    }

    if (!selectedSatellite && !useCustomSatellite) {
      alert(t.pleaseSelectSatellite);
      return;
    }

    let satelliteLongitude: number;
    if (useCustomSatellite) {
      const parsed = parseLongitudeInput(customSatelliteLongitude);
      if (parsed === null) {
        alert(t.pleaseSelectSatellite);
        return;
      }
      satelliteLongitude = parsed;
    } else {
      satelliteLongitude = selectedSatellite!.longitude;
    }

    const result = calculateSatellitePointing({
      stationLatitude: latitude,
      stationLongitude: longitude,
      satelliteLongitude: satelliteLongitude,
      language: language
    });

    setCalculationResult(result);
  };

  // 清除结果
  const clearResults = () => {
    setCalculationResult(null);
    setShowDetails(false);
  };

  // 当输入参数改变时清除结果
  useEffect(() => {
    clearResults();
  }, [selectedLocation, customLatitude, customLongitude, selectedSatellite, customSatelliteLongitude, useCustomSatellite, useCustomLocation, language]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t.appTitle}</h1>
              <p className="text-sm text-gray-600 mt-1">{t.appSubtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <button
                  onClick={() => handleLanguageChange('zh')}
                  className={`px-2 py-1 text-sm rounded ${language === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  中文
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧输入面板 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 位置设置 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">{t.stationLocation}</h2>

              <div className="mb-3">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={useCustomLocation}
                    onChange={(e) => setUseCustomLocation(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{t.manualInputCoords}</span>
                </label>
                <button
                  onClick={getGPSLocation}
                  disabled={gpsLoading}
                  className="w-full bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400"
                >
                  {gpsLoading ? t.gettingLocation : t.getLocation}
                </button>
                {gpsError && (
                  <p className="text-xs text-red-500 mt-1">{gpsError}</p>
                )}
              </div>

              {useCustomLocation ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.latitude}
                    </label>
                    <input
                      type="number"
                      value={customLatitude}
                      onChange={(e) => setCustomLatitude(e.target.value)}
                      placeholder={t.latitudePlaceholder}
                      step="0.0001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.longitude}
                    </label>
                    <input
                      type="number"
                      value={customLongitude}
                      onChange={(e) => setCustomLongitude(e.target.value)}
                      placeholder={t.longitudePlaceholder}
                      step="0.0001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.searchSelectCity}
                  </label>
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder={t.searchCityPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <select
                    value={selectedLocation?.id || ''}
                    onChange={(e) => {
                      const location = locations.find(l => l.id === e.target.value);
                      setSelectedLocation(location || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t.selectLocation} ({filteredLocations.length}{t.results})</option>
                    {locationSearch.trim() ? (
                      // 搜索模式：直接显示过滤结果
                      filteredLocations.map(location => (
                        <option key={location.id} value={location.id}>
                          {language === 'zh' ? location.name : location.name_en} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                        </option>
                      ))
                    ) : (
                      // 非搜索模式：分组显示
                      <>
                        <optgroup label={t.municipalities}>
                          {filteredLocations.filter(l => ['北京', '上海', '天津', '重庆'].includes(l.province || '')).map(location => (
                            <option key={location.id} value={location.id}>
                              {language === 'zh' ? location.name : location.name_en} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label={t.provincialCapitals}>
                          {filteredLocations.filter(l => l.province && !['北京', '上海', '天津', '重庆'].includes(l.province)).map(location => (
                            <option key={location.id} value={location.id}>
                              {language === 'zh' ? location.name : location.name_en} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* 卫星选择 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">{t.satelliteSelection}</h2>

              <div className="mb-3">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={useCustomSatellite}
                    onChange={(e) => setUseCustomSatellite(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{t.manualInputSatellite}</span>
                </label>
              </div>

              {useCustomSatellite ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.satelliteLongitude}
                  </label>
                  <input
                    type="text"
                    value={customSatelliteLongitude}
                    onChange={(e) => setCustomSatelliteLongitude(e.target.value)}
                    placeholder={t.satelliteLongitudePlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t.customSatellite}: {(() => {
                      const parsed = parseLongitudeInput(customSatelliteLongitude);
                      return parsed !== null ? formatLongitude(parsed) : '-';
                    })()}
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={satelliteSearch}
                    onChange={(e) => setSatelliteSearch(e.target.value)}
                    placeholder={t.searchSatellitePlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <select
                    value={selectedSatellite?.id || ''}
                    onChange={(e) => {
                      const satellite = satellites.find(s => s.id === e.target.value);
                      setSelectedSatellite(satellite || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t.selectSatellite} ({filteredSatellites.length}{t.results})</option>
                    {filteredSatellites
                      .sort((a, b) => a.longitude - b.longitude)
                      .map(satellite => (
                        <option key={satellite.id} value={satellite.id}>
                          {language === 'zh' ? satellite.name : satellite.name_en} ({formatLongitude(satellite.longitude)})
                        </option>
                      ))}
                  </select>
                </>
              )}
            </div>

            {/* 天线选择 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">{t.antennaParams}</h2>
              <select
                value={selectedAntenna?.id || ''}
                onChange={(e) => {
                  const antenna = antennas.find(a => a.id === e.target.value);
                  setSelectedAntenna(antenna || null);
                  // 重置自定义偏馈角
                  setCustomOffsetAngle('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.selectAntenna}</option>
                {antennas.map(antenna => (
                  <option key={antenna.id} value={antenna.id}>
                    {language === 'zh' ? antenna.name : antenna.name_en}
                  </option>
                ))}
              </select>

              {/* 偏馈天线参数设置 */}
              {selectedAntenna?.type === 'offset' && (
                <div className="mt-4">
                  {/* 偏馈角设置 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.offsetAngleAdjustable}
                    </label>
                    <input
                      type="number"
                      value={customOffsetAngle}
                      onChange={(e) => setCustomOffsetAngle(e.target.value)}
                      placeholder={`${t.defaultOffsetAngle}: ${selectedAntenna.offsetAngle}°`}
                      step="0.1"
                      min="15"
                      max="35"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t.offsetAngle}: {customOffsetAngle ? `${customOffsetAngle}°` : `${selectedAntenna.offsetAngle}° (${t.defaultOffsetAngle})`}
                    </p>
                  </div>

                  {/* 安装方式选择 */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.installationMode}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="installationMode"
                        value="normal"
                        checked={installationMode === 'normal'}
                        onChange={() => setInstallationMode('normal')}
                        className="mr-2"
                      />
                      <span className="text-sm">{t.normalInstall}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="installationMode"
                        value="inverted"
                        checked={installationMode === 'inverted'}
                        onChange={() => setInstallationMode('inverted')}
                        className="mr-2"
                      />
                      <span className="text-sm">{t.invertedInstall}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={performCalculation}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t.calculate}
                </button>
                <button
                  onClick={clearResults}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {t.clear}
                </button>
              </div>
              <button
                onClick={copyShareUrl}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  copySuccess
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copySuccess ? t.urlCopied : t.copyUrl}
              </button>
            </div>
          </div>

          {/* 中间可视化区域 */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow p-4 h-[400px] lg:h-[600px]">
              <SatelliteDishVisualization
                azimuth={calculationResult?.azimuth}
                elevation={
                  calculationResult && selectedAntenna?.type === 'offset'
                    ? (() => {
                        const offsetAngle = customOffsetAngle ? parseFloat(customOffsetAngle) : (selectedAntenna.offsetAngle || 22.5);
                        return installationMode === 'normal'
                          ? calculationResult.elevation - offsetAngle
                          : calculationResult.elevation + offsetAngle;
                      })()
                    : calculationResult?.elevation
                }
                polarization={calculationResult?.polarization}
                isActualElevation={selectedAntenna?.type === 'offset'}
                antennaType={selectedAntenna?.type}
                language={language}
              />
            </div>
          </div>

          {/* 右侧结果区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4" style={{ minHeight: '400px', maxHeight: '85vh', overflowY: 'auto' }}>
              {calculationResult ? (
                <CalculationResults
                  result={calculationResult}
                  showDetails={showDetails}
                  onToggleDetails={() => setShowDetails(!showDetails)}
                  antenna={selectedAntenna}
                  installationMode={installationMode}
                  customOffsetAngle={customOffsetAngle ? parseFloat(customOffsetAngle) : null}
                  language={language}
                />
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <p>{t.selectParamsHint}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="container mx-auto px-4 py-4 mt-8 border-t">
        <div className="text-center text-sm text-gray-600">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;