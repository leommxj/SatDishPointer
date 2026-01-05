export interface Satellite {
  id: string;
  name: string;
  name_en: string;
  longitude: number; 
}

export const satellites: Satellite[] = [
  { id: 'zhongxing-6b', name: '中星6B', name_en: 'ChinaSat 6B', longitude: 115.5 },
  { id: 'zhongxing-6c', name: '中星6C', name_en: 'ChinaSat 6C', longitude: 130.0 },
  { id: 'zhongxing-6d', name: '中星6D', name_en: 'ChinaSat 6D', longitude: 125.0 },
  { id: 'zhongxing-6e', name: '中星6E', name_en: 'ChinaSat 6E', longitude: 115.5 },
  { id: 'zhongxing-9', name: '中星9号', name_en: 'ChinaSat 9', longitude: 92.2 },
  { id: 'zhongxing-9B', name: '中星9B', name_en: 'ChinaSat 9B', longitude: 101.4 },
  { id: 'zhongxing-10', name: '中星10号', name_en: 'ChinaSat 10', longitude: 110.5 },
  { id: 'zhongxing-10r', name: '中星10R', name_en: 'ChinaSat 10R', longitude: 110.5 },
  { id: 'zhongxing-11', name: '中星11号', name_en: 'ChinaSat 11', longitude: 98.0 },
  { id: 'zhongxing-12', name: '中星12号', name_en: 'ChinaSat 12', longitude: 87.5 },
  { id: 'zhongxing-15', name: '中星15号', name_en: 'ChinaSat 15', longitude: 51.5 },
  { id: 'zhongxing-16', name: '中星16号', name_en: 'ChinaSat 16', longitude: 110.5 },
  { id: 'zhongxing-19', name: '中星19号', name_en: 'ChinaSat 19', longitude: 163.0 },
  { id: 'zhongxing-26', name: '中星26号', name_en: 'ChinaSat 26', longitude: 125.0 },

  { id: 'apstar-5c', name: '亚太5C', name_en: 'APStar 5C', longitude: 138.0 },
  { id: 'apstar-6c', name: '亚太6C', name_en: 'APStar 6C', longitude: 134.0 },
  { id: 'apstar-6d', name: '亚太6D', name_en: 'APStar 6D', longitude: 134.0 },
  { id: 'apstar-7', name: '亚太7号', name_en: 'APStar 7', longitude: 76.5 },
  { id: 'apstar-9', name: '亚太9号', name_en: 'APStar 9', longitude: 142.0 },

  { id: 'asiasat-5', name: '亚洲5号', name_en: 'AsiaSat 5', longitude: 100.5 },
  { id: 'asiasat-6', name: '亚洲6号', name_en: 'AsiaSat 6', longitude: 120.0 },
  { id: 'asiasat-7', name: '亚洲7号', name_en: 'AsiaSat 7', longitude: 105.5 },
  { id: 'asiasat-8', name: '亚洲8号', name_en: 'AsiaSat 8', longitude: -4.0 },
  { id: 'asiasat-9', name: '亚洲9号', name_en: 'AsiaSat 9', longitude: 122.0 },

  // following data may be not accurate
  { id: 'jcsat-3a', name: 'JCSAT-3A', name_en: 'JCSAT-3A', longitude: 128.0 },
  { id: 'jcsat-4b', name: 'JCSAT-4B', name_en: 'JCSAT-4B', longitude: 124.0 },
  { id: 'jcsat-110r', name: 'JCSAT-110R', name_en: 'JCSAT-110R', longitude: 110.0 },

  { id: 'koreasat-5', name: '韩星5号', name_en: 'Koreasat 5', longitude: 113.0 },
  { id: 'koreasat-6', name: '韩星6号', name_en: 'Koreasat 6', longitude: 116.0 },
  { id: 'koreasat-7', name: '韩星7号', name_en: 'Koreasat 7', longitude: 116.0 },

  { id: 'intelsat-8', name: 'Intelsat 8', name_en: 'Intelsat 8', longitude: 166.0 },
  { id: 'intelsat-10', name: 'Intelsat 10', name_en: 'Intelsat 10', longitude: 68.5 },
  { id: 'intelsat-15', name: 'Intelsat 15', name_en: 'Intelsat 15', longitude: 85.2 },
  { id: 'intelsat-17', name: 'Intelsat 17', name_en: 'Intelsat 17', longitude: 66.0 },
  { id: 'intelsat-19', name: 'Intelsat 19', name_en: 'Intelsat 19', longitude: 166.0 },
  { id: 'intelsat-20', name: 'Intelsat 20', name_en: 'Intelsat 20', longitude: 68.5 },
  { id: 'intelsat-39', name: 'Intelsat 39', name_en: 'Intelsat 39', longitude: 62.0 },

  { id: 'express-am3', name: 'Express AM3', name_en: 'Express AM3', longitude: 103.0 },
  { id: 'express-am5', name: 'Express AM5', name_en: 'Express AM5', longitude: 140.0 },
  { id: 'express-am6', name: 'Express AM6', name_en: 'Express AM6', longitude: 53.0 },
  { id: 'express-am7', name: 'Express AM7', name_en: 'Express AM7', longitude: 40.0 },
  { id: 'yamal-402', name: 'Yamal 402', name_en: 'Yamal 402', longitude: 55.0 },

  { id: 'insat-4a', name: 'INSAT-4A', name_en: 'INSAT-4A', longitude: 83.0 },
  { id: 'gsat-10', name: 'GSAT-10', name_en: 'GSAT-10', longitude: 83.0 },
  { id: 'gsat-15', name: 'GSAT-15', name_en: 'GSAT-15', longitude: 93.5 },
  { id: 'gsat-17', name: 'GSAT-17', name_en: 'GSAT-17', longitude: 93.5 },

  { id: 'ses-7', name: 'SES-7', name_en: 'SES-7', longitude: 108.2 },
  { id: 'ses-8', name: 'SES-8', name_en: 'SES-8', longitude: 95.0 },
  { id: 'ses-9', name: 'SES-9', name_en: 'SES-9', longitude: 108.2 },
  { id: 'ses-12', name: 'SES-12', name_en: 'SES-12', longitude: 95.0 },

  { id: 'thaicom-4', name: 'Thaicom 4', name_en: 'Thaicom 4', longitude: 119.5 },
  { id: 'thaicom-6', name: 'Thaicom 6', name_en: 'Thaicom 6', longitude: 78.5 },
  { id: 'thaicom-8', name: 'Thaicom 8', name_en: 'Thaicom 8', longitude: 78.5 },

  { id: 'eutelsat-70b', name: 'Eutelsat 70B', name_en: 'Eutelsat 70B', longitude: 70.5 },
  { id: 'eutelsat-172b', name: 'Eutelsat 172B', name_en: 'Eutelsat 172B', longitude: 172.0 },

  { id: 'abs-2', name: 'ABS-2', name_en: 'ABS-2', longitude: 75.0 },
  { id: 'abs-6', name: 'ABS-6', name_en: 'ABS-6', longitude: 159.0 },

  { id: 'measat-3', name: 'Measat-3', name_en: 'Measat-3', longitude: 91.5 },
  { id: 'measat-3a', name: 'Measat-3a', name_en: 'Measat-3a', longitude: 91.5 },
  { id: 'measat-3b', name: 'Measat-3b', name_en: 'Measat-3b', longitude: 91.5 },

  { id: 'telstar-18v', name: 'Telstar 18V', name_en: 'Telstar 18V', longitude: 138.0 },

  { id: 'nss-6', name: 'NSS-6', name_en: 'NSS-6', longitude: 95.0 },

  { id: 'palapa-d', name: 'Palapa D', name_en: 'Palapa D', longitude: 113.0 },

  { id: 'vinasat-1', name: 'Vinasat-1', name_en: 'Vinasat-1', longitude: 132.0 },
  { id: 'vinasat-2', name: 'Vinasat-2', name_en: 'Vinasat-2', longitude: 131.8 },

  { id: 'optus-d1', name: 'Optus D1', name_en: 'Optus D1', longitude: 160.0 },
  { id: 'optus-d2', name: 'Optus D2', name_en: 'Optus D2', longitude: 152.0 },
  { id: 'optus-d3', name: 'Optus D3', name_en: 'Optus D3', longitude: 156.0 },

  { id: 'ses-1', name: 'SES-1', name_en: 'SES-1', longitude: -101.0 },
  { id: 'ses-2', name: 'SES-2', name_en: 'SES-2', longitude: -87.0 },
  { id: 'ses-3', name: 'SES-3', name_en: 'SES-3', longitude: -103.0 },
  { id: 'galaxy-19', name: 'Galaxy 19', name_en: 'Galaxy 19', longitude: -97.0 },
  { id: 'galaxy-16', name: 'Galaxy 16', name_en: 'Galaxy 16', longitude: -99.0 },
  { id: 'intelsat-21', name: 'Intelsat 21', name_en: 'Intelsat 21', longitude: -58.0 },
  { id: 'intelsat-34', name: 'Intelsat 34', name_en: 'Intelsat 34', longitude: -55.5 },
  { id: 'intelsat-14', name: 'Intelsat 14', name_en: 'Intelsat 14', longitude: -45.0 },
  { id: 'amazonas-2', name: 'Amazonas 2', name_en: 'Amazonas 2', longitude: -61.0 },
  { id: 'amazonas-3', name: 'Amazonas 3', name_en: 'Amazonas 3', longitude: -61.0 },
  { id: 'star-one-c2', name: 'Star One C2', name_en: 'Star One C2', longitude: -70.0 },
  { id: 'star-one-c4', name: 'Star One C4', name_en: 'Star One C4', longitude: -70.0 },
  { id: 'echostar-14', name: 'EchoStar 14', name_en: 'EchoStar 14', longitude: -119.0 },
  { id: 'echostar-10', name: 'EchoStar 10', name_en: 'EchoStar 10', longitude: -110.0 },
  { id: 'directv-12', name: 'DirecTV 12', name_en: 'DirecTV 12', longitude: -103.0 },
  { id: 'hispasat-30w-5', name: 'Hispasat 30W-5', name_en: 'Hispasat 30W-5', longitude: -30.0 },
  { id: 'nss-10', name: 'NSS-10', name_en: 'NSS-10', longitude: -37.5 },
  { id: 'telstar-12v', name: 'Telstar 12V', name_en: 'Telstar 12V', longitude: -15.0 }
];

export const getSatellitesSortedByLongitude = () => {
  return [...satellites].sort((a, b) => a.longitude - b.longitude);
};
