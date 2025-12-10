export type Language = 'zh' | 'en';

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  poweredBy: string;

  // Location section
  stationLocation: string;
  manualInputCoords: string;
  getLocation: string;
  gettingLocation: string;
  latitude: string;
  longitude: string;
  latitudePlaceholder: string;
  longitudePlaceholder: string;
  searchSelectCity: string;
  searchCityPlaceholder: string;
  selectLocation: string;
  results: string;
  municipalities: string;
  provincialCapitals: string;

  // GPS errors
  gpsNotSupported: string;
  gpsPermissionDenied: string;
  gpsPositionUnavailable: string;
  gpsTimeout: string;
  gpsError: string;

  // Satellite section
  satelliteSelection: string;
  searchSatellitePlaceholder: string;
  selectSatellite: string;
  manualInputSatellite: string;
  satelliteLongitude: string;
  satelliteLongitudePlaceholder: string;
  customSatellite: string;
  eastLongitude: string;
  westLongitude: string;

  // Antenna section
  antennaParams: string;
  selectAntenna: string;
  offsetAntenna: string;
  primeFocusAntenna: string;
  offsetAngle: string;
  offsetAngleAdjustable: string;
  offsetAnglePlaceholder: string;
  defaultOffsetAngle: string;
  installationMode: string;
  normalInstall: string;
  invertedInstall: string;

  // Buttons
  calculate: string;
  clear: string;
  shareUrl: string;
  copyUrl: string;
  urlCopied: string;

  // Results
  calculationResults: string;
  azimuth: string;
  elevation: string;
  theoreticalElevation: string;
  actualElevation: string;
  polarization: string;
  distance: string;
  satelliteVisible: string;
  satelliteNotVisible: string;
  showDetails: string;
  hideDetails: string;

  // Details
  calculationDetails: string;
  basicParams: string;
  earthRadius: string;
  geoOrbitRadius: string;
  longitudeDiff: string;

  // Tips
  tipTitle: string;
  tipObstacles: string;
  tipVertical: string;
  tipMagnetic: string;
  tipWeather: string;
  tipLnbFreq: string;

  // Placeholder
  selectParamsHint: string;

  // Footer
  footerText: string;

  // Validation
  pleaseEnterValidCoords: string;
  pleaseSelectLocation: string;
  pleaseSelectSatellite: string;

  // Visualization
  visualization: string;
  sideViewElevation: string;
  topViewAzimuth: string;
  horizon: string;
  north: string;
  south: string;
  east: string;
  west: string;
  northeast: string;
  southeast: string;
  southwest: string;
  northwest: string;
  paramsSummary: string;
  waitingResult: string;

  // Calculation steps
  stepLatitudeConversion: string;
  stepLongitudeDiff: string;
  stepAzimuthCalc: string;
  stepCentralAngle: string;
  stepDistance: string;
  stepElevationCalc: string;
  stepPolarizationCalc: string;
  stepVisibilityCheck: string;
  visible: string;
  notVisible: string;

  // Azimuth direction descriptions
  dueNorth: string;
  dueSouth: string;
  dueEast: string;
  dueWest: string;
  northByEast: string;  // 北偏东
  northByWest: string;  // 北偏西
  southByEast: string;  // 南偏东
  southByWest: string;  // 南偏西
  eastByNorth: string;  // 东偏北
  eastBySouth: string;  // 东偏南
  westByNorth: string;  // 西偏北
  westBySouth: string;  // 西偏南
}

export const translations: Record<Language, Translations> = {
  zh: {
    // Header
    appTitle: '卫星天线指向计算器',
    appSubtitle: 'GEO Satellite Dish Pointer',
    poweredBy: 'Power by React v',

    // Location section
    stationLocation: '地面站位置',
    manualInputCoords: '手动输入经纬度',
    getLocation: '📍 获取当前位置',
    gettingLocation: '获取中...',
    latitude: '纬度 (°)',
    longitude: '经度 (°)',
    latitudePlaceholder: '如：39.9042',
    longitudePlaceholder: '如：116.4074',
    searchSelectCity: '搜索/选择城市',
    searchCityPlaceholder: '输入城市名称搜索...',
    selectLocation: '请选择地点',
    results: '个结果',
    municipalities: '直辖市',
    provincialCapitals: '省会城市',

    // GPS errors
    gpsNotSupported: '您的浏览器不支持地理位置功能',
    gpsPermissionDenied: '用户拒绝了位置请求',
    gpsPositionUnavailable: '位置信息不可用',
    gpsTimeout: '请求超时',
    gpsError: '获取位置失败',

    // Satellite section
    satelliteSelection: '卫星选择',
    searchSatellitePlaceholder: '搜索卫星名称或经度...',
    selectSatellite: '请选择卫星',
    manualInputSatellite: '手动输入卫星经度',
    satelliteLongitude: '卫星经度',
    satelliteLongitudePlaceholder: '如：105.5E 或 75W',
    customSatellite: '自定义卫星',
    eastLongitude: '°E',
    westLongitude: '°W',

    // Antenna section
    antennaParams: '天线参数',
    selectAntenna: '请选择天线',
    offsetAntenna: '偏馈天线',
    primeFocusAntenna: '正馈天线',
    offsetAngle: '偏置角',
    offsetAngleAdjustable: '偏置角（可调）',
    offsetAnglePlaceholder: '输入偏置角度',
    defaultOffsetAngle: '默认',
    installationMode: '安装方式',
    normalInstall: '正装（LNB在下方）',
    invertedInstall: '倒装（LNB在上方）',

    // Buttons
    calculate: '计算',
    clear: '清除',
    shareUrl: '分享链接',
    copyUrl: '复制链接',
    urlCopied: '已复制！',

    // Results
    calculationResults: '计算结果',
    azimuth: '方位角',
    elevation: '仰角',
    theoreticalElevation: '理论仰角',
    actualElevation: '实际仰角',
    polarization: '极化角/LNB Skew',
    distance: '站星距离',
    satelliteVisible: '✓ 卫星可见',
    satelliteNotVisible: '✗ 卫星不可见（仰角为负）',
    showDetails: '显示计算过程',
    hideDetails: '隐藏计算过程',

    // Details
    calculationDetails: '计算过程详情',
    basicParams: '基本参数：',
    earthRadius: '地球半径',
    geoOrbitRadius: '同步轨道半径',
    longitudeDiff: '经度差',

    // Tips
    tipTitle: '注意：',
    tipObstacles: '建筑物、树木等障碍物遮挡',
    tipVertical: '天线安装的垂直度和水平度',
    tipMagnetic: '磁偏角修正（使用指南针时）',
    tipWeather: '雨衰、雪衰等天气影响',
    tipLnbFreq: 'LNB本振频率设置',

    // Placeholder
    selectParamsHint: '请选择参数并点击"计算"',

    // Footer
    footerText: 'GEO卫星天线指向计算工具 - 仅供参考',

    // Validation
    pleaseEnterValidCoords: '请输入有效的经纬度值',
    pleaseSelectLocation: '请选择地点',
    pleaseSelectSatellite: '请选择卫星',

    // Visualization
    visualization: '天线指向可视化',
    sideViewElevation: '侧视图（仰角）',
    topViewAzimuth: '俯视图（方位角）',
    horizon: '地平线',
    north: '北',
    south: '南',
    east: '东',
    west: '西',
    northeast: '东北',
    southeast: '东南',
    southwest: '西南',
    northwest: '西北',
    paramsSummary: '参数汇总',
    waitingResult: '等待计算结果...',

    // Calculation steps
    stepLatitudeConversion: '纬度转换',
    stepLongitudeDiff: '经度差',
    stepAzimuthCalc: '方位角计算',
    stepCentralAngle: '地心角',
    stepDistance: '站星距离',
    stepElevationCalc: '仰角计算',
    stepPolarizationCalc: '极化角计算',
    stepVisibilityCheck: '可见性判断',
    visible: '可见',
    notVisible: '不可见',

    // Azimuth direction descriptions
    dueNorth: '正北',
    dueSouth: '正南',
    dueEast: '正东',
    dueWest: '正西',
    northByEast: '北偏东',
    northByWest: '北偏西',
    southByEast: '南偏东',
    southByWest: '南偏西',
    eastByNorth: '东偏北',
    eastBySouth: '东偏南',
    westByNorth: '西偏北',
    westBySouth: '西偏南',
  },
  en: {
    // Header
    appTitle: 'Satellite Dish Pointer',
    appSubtitle: 'GEO Satellite Dish Pointer',
    poweredBy: 'Powered by React v',

    // Location section
    stationLocation: 'Ground Station Location',
    manualInputCoords: 'Manual input coordinates',
    getLocation: '📍 Get Current Location',
    gettingLocation: 'Getting...',
    latitude: 'Latitude (°)',
    longitude: 'Longitude (°)',
    latitudePlaceholder: 'e.g.: 39.9042',
    longitudePlaceholder: 'e.g.: 116.4074',
    searchSelectCity: 'Search/Select City',
    searchCityPlaceholder: 'Search city name...',
    selectLocation: 'Select location',
    results: ' results',
    municipalities: 'Municipalities',
    provincialCapitals: 'Provincial Capitals',

    // GPS errors
    gpsNotSupported: 'Geolocation is not supported by your browser',
    gpsPermissionDenied: 'Location permission denied',
    gpsPositionUnavailable: 'Position unavailable',
    gpsTimeout: 'Request timeout',
    gpsError: 'Failed to get location',

    // Satellite section
    satelliteSelection: 'Satellite Selection',
    searchSatellitePlaceholder: 'Search satellite name or longitude...',
    selectSatellite: 'Select satellite',
    manualInputSatellite: 'Manual input satellite longitude',
    satelliteLongitude: 'Satellite Longitude',
    satelliteLongitudePlaceholder: 'e.g.: 105.5E or 75W',
    customSatellite: 'Custom Satellite',
    eastLongitude: '°E',
    westLongitude: '°W',

    // Antenna section
    antennaParams: 'Antenna Parameters',
    selectAntenna: 'Select antenna',
    offsetAntenna: 'Offset Antenna',
    primeFocusAntenna: 'Prime Focus Antenna',
    offsetAngle: 'Offset Angle',
    offsetAngleAdjustable: 'Offset Angle (adjustable)',
    offsetAnglePlaceholder: 'Enter offset angle',
    defaultOffsetAngle: 'Default',
    installationMode: 'Installation Mode',
    normalInstall: 'Normal (LNB below)',
    invertedInstall: 'Inverted (LNB above)',

    // Buttons
    calculate: 'Calculate',
    clear: 'Clear',
    shareUrl: 'Share URL',
    copyUrl: 'Copy URL',
    urlCopied: 'Copied!',

    // Results
    calculationResults: 'Results',
    azimuth: 'Azimuth',
    elevation: 'Elevation',
    theoreticalElevation: 'Theoretical Elevation',
    actualElevation: 'Actual Elevation',
    polarization: 'Polarization/LNB Skew',
    distance: 'Distance',
    satelliteVisible: '✓ Satellite visible',
    satelliteNotVisible: '✗ Satellite not visible (negative elevation)',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',

    // Details
    calculationDetails: 'Calculation Details',
    basicParams: 'Basic Parameters:',
    earthRadius: 'Earth Radius',
    geoOrbitRadius: 'GEO Orbit Radius',
    longitudeDiff: 'Longitude Difference',

    // Tips
    tipTitle: 'Note:',
    tipObstacles: 'Obstacles like buildings and trees',
    tipVertical: 'Antenna vertical and horizontal alignment',
    tipMagnetic: 'Magnetic declination correction (when using compass)',
    tipWeather: 'Rain fade, snow fade and other weather effects',
    tipLnbFreq: 'LNB local oscillator frequency setting',

    // Placeholder
    selectParamsHint: 'Select parameters and click "Calculate"',

    // Footer
    footerText: 'GEO Satellite Dish Pointer - For Reference Only',

    // Validation
    pleaseEnterValidCoords: 'Please enter valid coordinates',
    pleaseSelectLocation: 'Please select a location',
    pleaseSelectSatellite: 'Please select a satellite',

    // Visualization
    visualization: 'Antenna Pointing Visualization',
    sideViewElevation: 'Side View (Elevation)',
    topViewAzimuth: 'Top View (Azimuth)',
    horizon: 'Horizon',
    north: 'N',
    south: 'S',
    east: 'E',
    west: 'W',
    northeast: 'NE',
    southeast: 'SE',
    southwest: 'SW',
    northwest: 'NW',
    paramsSummary: 'Summary',
    waitingResult: 'Waiting for calculation...',

    // Calculation steps
    stepLatitudeConversion: 'Latitude Conversion',
    stepLongitudeDiff: 'Longitude Difference',
    stepAzimuthCalc: 'Azimuth Calculation',
    stepCentralAngle: 'Central Angle',
    stepDistance: 'Station-Satellite Distance',
    stepElevationCalc: 'Elevation Calculation',
    stepPolarizationCalc: 'Polarization Calculation',
    stepVisibilityCheck: 'Visibility Check',
    visible: 'Visible',
    notVisible: 'Not Visible',

    // Azimuth direction descriptions
    dueNorth: 'Due North',
    dueSouth: 'Due South',
    dueEast: 'Due East',
    dueWest: 'Due West',
    northByEast: 'N by E',
    northByWest: 'N by W',
    southByEast: 'S by E',
    southByWest: 'S by W',
    eastByNorth: 'E by N',
    eastBySouth: 'E by S',
    westByNorth: 'W by N',
    westBySouth: 'W by S',
  }
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
