import React, { useState, useEffect, useCallback } from 'react';
import { satellites, Satellite } from './data/satellites';
import { antennas, Antenna } from './data/antennas';
import { locations, Location } from './data/locations';
import {
  calculateSatellitePointing,
  CalculationResult,
  findNearbySatellites,
  NearbySatelliteInfo
} from './utils/satelliteCalculator';
import SatelliteDishVisualization from './components/SatelliteDishVisualization';
import CalculationResults from './components/CalculationResults';
import NearbySatellites from './components/NearbySatellites';
import { Language, getTranslation } from './i18n/translations';

const getLanguageFromUrl = (): Language => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang === 'en' || lang === 'zh') return lang;
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('zh') ? 'zh' : 'en';
};

const updateUrlLanguage = (lang: Language) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());
};

const parseLongitudeInput = (input: string): number | null => {
  if (!input || input.trim() === '') return null;
  const trimmed = input.trim().toUpperCase();
  const match = trimmed.match(/^(-?\d+\.?\d*)\s*([EW])?$/);
  if (!match) return null;

  let value = parseFloat(match[1]);
  if (isNaN(value)) return null;

  const direction = match[2];
  if (direction === 'W') value = -Math.abs(value);
  else if (direction === 'E') value = Math.abs(value);

  if (value < -180 || value > 180) return null;
  return value;
};

const formatLongitude = (longitude: number): string => {
  return longitude >= 0 ? `${longitude}E` : `${Math.abs(longitude)}W`;
};

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
  const [language, setLanguage] = useState<Language>(getLanguageFromUrl);
  const t = getTranslation(language);

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
  const [selectedAntenna, setSelectedAntenna] = useState<Antenna | null>(antennas.find(a => a.type === 'prime_focus') || null);
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
  const [showNearbySatellites, setShowNearbySatellites] = useState<boolean>(false);
  const [nearbySatellitesList, setNearbySatellitesList] = useState<NearbySatelliteInfo[]>([]);

  useEffect(() => {
    const urlParams = getParamsFromUrl();

    if (urlParams.lat && urlParams.lon) {
      setCustomLatitude(urlParams.lat);
      setCustomLongitude(urlParams.lon);
      setUseCustomLocation(true);
    }

    if (urlParams.satLon) {
      setCustomSatelliteLongitude(urlParams.satLon);
      setUseCustomSatellite(true);
    } else if (urlParams.sat) {
      const sat = satellites.find(s => s.id === urlParams.sat);
      if (sat) setSelectedSatellite(sat);
    }

    if (urlParams.antenna) {
      const ant = antennas.find(a => a.id === urlParams.antenna);
      if (ant) setSelectedAntenna(ant);
    }

    if (urlParams.offset) setCustomOffsetAngle(urlParams.offset);

    if (urlParams.mode === 'normal' || urlParams.mode === 'inverted') {
      setInstallationMode(urlParams.mode);
    }
  }, []);

  const generateShareUrl = (): string => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('lang', language);

    if (useCustomLocation && customLatitude && customLongitude) {
      url.searchParams.set('lat', customLatitude);
      url.searchParams.set('lon', customLongitude);
    } else if (selectedLocation) {
      url.searchParams.set('lat', selectedLocation.latitude.toString());
      url.searchParams.set('lon', selectedLocation.longitude.toString());
    }

    if (useCustomSatellite && customSatelliteLongitude) {
      url.searchParams.set('satLon', customSatelliteLongitude);
    } else if (selectedSatellite) {
      url.searchParams.set('sat', selectedSatellite.id);
    }

    if (selectedAntenna) {
      url.searchParams.set('antenna', selectedAntenna.id);
      if (selectedAntenna.type === 'offset' && customOffsetAngle) {
        url.searchParams.set('offset', customOffsetAngle);
      }
      if (selectedAntenna.type === 'offset') {
        url.searchParams.set('mode', installationMode);
      }
    }

    return url.toString();
  };

  const copyShareUrl = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
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

  const filteredLocations = locationSearch.trim()
    ? locations.filter(l =>
        l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
        l.name_en.toLowerCase().includes(locationSearch.toLowerCase()) ||
        (l.province && l.province.toLowerCase().includes(locationSearch.toLowerCase()))
      )
    : locations;

  const filteredSatellites = satelliteSearch.trim()
    ? satellites.filter(s =>
        s.name.toLowerCase().includes(satelliteSearch.toLowerCase()) ||
        s.name_en.toLowerCase().includes(satelliteSearch.toLowerCase()) ||
        s.longitude.toString().includes(satelliteSearch)
      )
    : satellites;

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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getLocationParams = useCallback((): { latitude: number; longitude: number } | null => {
    if (useCustomLocation) {
      const lat = parseFloat(customLatitude);
      const lon = parseFloat(customLongitude);
      if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
      return null;
    }
    if (selectedLocation) {
      return { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude };
    }
    return null;
  }, [useCustomLocation, customLatitude, customLongitude, selectedLocation]);

  const getSatelliteLongitude = useCallback((): number | null => {
    if (useCustomSatellite) return parseLongitudeInput(customSatelliteLongitude);
    return selectedSatellite?.longitude ?? null;
  }, [useCustomSatellite, customSatelliteLongitude, selectedSatellite]);

  const clearResults = () => {
    setCalculationResult(null);
    setShowDetails(false);
    setShowNearbySatellites(false);
    setNearbySatellitesList([]);
  };

  const clearAll = () => {
    setSelectedLocation(null);
    setCustomLatitude('');
    setCustomLongitude('');
    setUseCustomLocation(false);
    setSelectedSatellite(null);
    setCustomSatelliteLongitude('');
    setUseCustomSatellite(false);
    setSelectedAntenna(antennas.find(a => a.type === 'prime_focus') || null);
    setCustomOffsetAngle('');
    setInstallationMode('normal');
    setLocationSearch('');
    setSatelliteSearch('');
    setCalculationResult(null);
    setShowDetails(false);
    setShowNearbySatellites(false);
    setNearbySatellitesList([]);
  };

  useEffect(() => {
    const location = getLocationParams();
    const satLon = getSatelliteLongitude();

    if (location && satLon !== null) {
      const result = calculateSatellitePointing({
        stationLatitude: location.latitude,
        stationLongitude: location.longitude,
        satelliteLongitude: satLon,
        language: language
      });
      setCalculationResult(result);

      if (result.valid) {
        const nearby = findNearbySatellites(
          location.latitude,
          location.longitude,
          satLon,
          satellites
        );
        setNearbySatellitesList(nearby);
      } else {
        setNearbySatellitesList([]);
      }
    } else {
      clearResults();
    }
  }, [getLocationParams, getSatelliteLongitude, language]);

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
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
                {gpsError && <p className="text-xs text-red-500 mt-1">{gpsError}</p>}
              </div>

              {useCustomLocation ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.latitude}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.longitude}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.searchSelectCity}</label>
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
                      filteredLocations.map(location => (
                        <option key={location.id} value={location.id}>
                          {language === 'zh' ? location.name : location.name_en} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                        </option>
                      ))
                    ) : (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.satelliteLongitude}</label>
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
                      .sort((a, b) => b.longitude - a.longitude)
                      .map(satellite => (
                        <option key={satellite.id} value={satellite.id}>
                          {language === 'zh' ? satellite.name : satellite.name_en} ({formatLongitude(satellite.longitude)})
                        </option>
                      ))}
                  </select>
                </>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">{t.antennaParams}</h2>
              <select
                value={selectedAntenna?.id || ''}
                onChange={(e) => {
                  const antenna = antennas.find(a => a.id === e.target.value);
                  setSelectedAntenna(antenna || null);
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

              {selectedAntenna?.type === 'offset' && (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.offsetAngleAdjustable}</label>
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

                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.installationMode}</label>
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

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={clearAll}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  {t.clear}
                </button>
                <button
                  onClick={copyShareUrl}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    copySuccess ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {copySuccess ? t.urlCopied : t.copyUrl}
                </button>
              </div>
            </div>
          </div>

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

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4" style={{ minHeight: '400px', maxHeight: '85vh', overflowY: 'auto' }}>
              {calculationResult ? (
                <>
                  <CalculationResults
                    result={calculationResult}
                    showDetails={showDetails}
                    onToggleDetails={() => setShowDetails(!showDetails)}
                    antenna={selectedAntenna}
                    installationMode={installationMode}
                    customOffsetAngle={customOffsetAngle ? parseFloat(customOffsetAngle) : null}
                    language={language}
                  />

                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => setShowNearbySatellites(!showNearbySatellites)}
                      className="w-full py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span>⚠️</span>
                      <span>{showNearbySatellites ? t.hideNearbySatellites : t.showNearbySatellites}</span>
                      {nearbySatellitesList.length > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {nearbySatellitesList.length}
                        </span>
                      )}
                    </button>

                    {showNearbySatellites && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">{t.nearbySatellites}</h4>
                        <NearbySatellites satellites={nearbySatellitesList} language={language} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <p>{t.selectParamsHint}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-4 mt-8 border-t">
        <div className="text-center text-sm text-gray-600">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
