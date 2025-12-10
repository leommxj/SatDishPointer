// 卫星数据类型定义
export interface Satellite {
  id: string;
  name: string;
  name_en: string;
  longitude: number; // 卫星轨道位置（经度）
  status: 'active' | 'inactive' | 'testing';
  band: string[]; // 支持的频段 如 ['C', 'Ku']
}

// 卫星数据
export const satellites: Satellite[] = [
  // 中国卫星
  {
    id: 'zhongxing-6a',
    name: '中星6A',
    name_en: 'ChinaSat 6A',
    longitude: 125.0,
    status: 'active',
    band: ['C']
  },
  {
    id: 'zhongxing-6b',
    name: '中星6B',
    name_en: 'ChinaSat 6B',
    longitude: 115.5,
    status: 'active',
    band: ['C']
  },
  {
    id: 'zhongxing-6c',
    name: '中星6C',
    name_en: 'ChinaSat 6C',
    longitude: 113.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'zhongxing-9',
    name: '中星9号',
    name_en: 'ChinaSat 9',
    longitude: 92.2,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'zhongxing-9a',
    name: '中星9A',
    name_en: 'ChinaSat 9A',
    longitude: 101.4,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'zhongxing-10',
    name: '中星10号',
    name_en: 'ChinaSat 10',
    longitude: 110.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'zhongxing-11',
    name: '中星11号',
    name_en: 'ChinaSat 11',
    longitude: 98.2,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'zhongxing-12',
    name: '中星12号',
    name_en: 'ChinaSat 12',
    longitude: 87.5,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'zhongxing-16',
    name: '中星16号',
    name_en: 'ChinaSat 16',
    longitude: 110.5,
    status: 'active',
    band: ['Ka']
  },
  // 亚洲卫星
  {
    id: 'asiasat-5',
    name: '亚洲5号',
    name_en: 'AsiaSat 5',
    longitude: 100.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'asiasat-7',
    name: '亚洲7号',
    name_en: 'AsiaSat 7',
    longitude: 105.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'asiasat-9',
    name: '亚洲9号',
    name_en: 'AsiaSat 9',
    longitude: 122.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // 亚太卫星
  {
    id: 'apstar-5c',
    name: '亚太5C',
    name_en: 'APStar 5C',
    longitude: 138.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'apstar-6c',
    name: '亚太6C',
    name_en: 'APStar 6C',
    longitude: 134.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'apstar-6d',
    name: '亚太6D',
    name_en: 'APStar 6D',
    longitude: 134.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  {
    id: 'apstar-7',
    name: '亚太7号',
    name_en: 'APStar 7',
    longitude: 76.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'apstar-9',
    name: '亚太9号',
    name_en: 'APStar 9',
    longitude: 142.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // 日本卫星
  {
    id: 'jcsat-3a',
    name: 'JCSAT-3A',
    name_en: 'JCSAT-3A',
    longitude: 128.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'jcsat-4b',
    name: 'JCSAT-4B',
    name_en: 'JCSAT-4B',
    longitude: 124.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'jcsat-110r',
    name: 'JCSAT-110R',
    name_en: 'JCSAT-110R',
    longitude: 110.0,
    status: 'active',
    band: ['Ku']
  },
  // 韩国卫星
  {
    id: 'koreasat-5',
    name: '韩星5号',
    name_en: 'Koreasat 5',
    longitude: 113.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'koreasat-6',
    name: '韩星6号',
    name_en: 'Koreasat 6',
    longitude: 116.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'koreasat-7',
    name: '韩星7号',
    name_en: 'Koreasat 7',
    longitude: 116.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  // 国际卫星 Intelsat
  {
    id: 'intelsat-8',
    name: 'Intelsat 8',
    name_en: 'Intelsat 8',
    longitude: 166.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-10',
    name: 'Intelsat 10',
    name_en: 'Intelsat 10',
    longitude: 68.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-15',
    name: 'Intelsat 15',
    name_en: 'Intelsat 15',
    longitude: 85.2,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'intelsat-17',
    name: 'Intelsat 17',
    name_en: 'Intelsat 17',
    longitude: 66.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-19',
    name: 'Intelsat 19',
    name_en: 'Intelsat 19',
    longitude: 166.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-20',
    name: 'Intelsat 20',
    name_en: 'Intelsat 20',
    longitude: 68.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-39',
    name: 'Intelsat 39',
    name_en: 'Intelsat 39',
    longitude: 62.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // 俄罗斯卫星
  {
    id: 'express-am3',
    name: 'Express AM3',
    name_en: 'Express AM3',
    longitude: 103.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'express-am5',
    name: 'Express AM5',
    name_en: 'Express AM5',
    longitude: 140.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'express-am6',
    name: 'Express AM6',
    name_en: 'Express AM6',
    longitude: 53.0,
    status: 'active',
    band: ['C', 'Ku', 'Ka']
  },
  {
    id: 'express-am7',
    name: 'Express AM7',
    name_en: 'Express AM7',
    longitude: 40.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'yamal-402',
    name: 'Yamal 402',
    name_en: 'Yamal 402',
    longitude: 55.0,
    status: 'active',
    band: ['Ku']
  },
  // 印度卫星
  {
    id: 'insat-4a',
    name: 'INSAT-4A',
    name_en: 'INSAT-4A',
    longitude: 83.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'gsat-10',
    name: 'GSAT-10',
    name_en: 'GSAT-10',
    longitude: 83.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'gsat-15',
    name: 'GSAT-15',
    name_en: 'GSAT-15',
    longitude: 93.5,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'gsat-17',
    name: 'GSAT-17',
    name_en: 'GSAT-17',
    longitude: 93.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  // SES卫星
  {
    id: 'ses-7',
    name: 'SES-7',
    name_en: 'SES-7',
    longitude: 108.2,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'ses-8',
    name: 'SES-8',
    name_en: 'SES-8',
    longitude: 95.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'ses-9',
    name: 'SES-9',
    name_en: 'SES-9',
    longitude: 108.2,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'ses-12',
    name: 'SES-12',
    name_en: 'SES-12',
    longitude: 95.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  // Thaicom 泰国卫星
  {
    id: 'thaicom-4',
    name: 'Thaicom 4',
    name_en: 'Thaicom 4',
    longitude: 119.5,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  {
    id: 'thaicom-6',
    name: 'Thaicom 6',
    name_en: 'Thaicom 6',
    longitude: 78.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'thaicom-8',
    name: 'Thaicom 8',
    name_en: 'Thaicom 8',
    longitude: 78.5,
    status: 'active',
    band: ['Ku']
  },
  // Eutelsat 欧洲卫星
  {
    id: 'eutelsat-70b',
    name: 'Eutelsat 70B',
    name_en: 'Eutelsat 70B',
    longitude: 70.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'eutelsat-172b',
    name: 'Eutelsat 172B',
    name_en: 'Eutelsat 172B',
    longitude: 172.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // ABS 卫星
  {
    id: 'abs-2',
    name: 'ABS-2',
    name_en: 'ABS-2',
    longitude: 75.0,
    status: 'active',
    band: ['C', 'Ku', 'Ka']
  },
  {
    id: 'abs-6',
    name: 'ABS-6',
    name_en: 'ABS-6',
    longitude: 159.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // Measat 马来西亚卫星
  {
    id: 'measat-3',
    name: 'Measat-3',
    name_en: 'Measat-3',
    longitude: 91.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'measat-3a',
    name: 'Measat-3a',
    name_en: 'Measat-3a',
    longitude: 91.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'measat-3b',
    name: 'Measat-3b',
    name_en: 'Measat-3b',
    longitude: 91.5,
    status: 'active',
    band: ['Ku']
  },
  // Telstar
  {
    id: 'telstar-18v',
    name: 'Telstar 18V',
    name_en: 'Telstar 18V',
    longitude: 138.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // NSS
  {
    id: 'nss-6',
    name: 'NSS-6',
    name_en: 'NSS-6',
    longitude: 95.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // Palapa 印尼卫星
  {
    id: 'palapa-d',
    name: 'Palapa D',
    name_en: 'Palapa D',
    longitude: 113.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  // Vinasat 越南卫星
  {
    id: 'vinasat-1',
    name: 'Vinasat-1',
    name_en: 'Vinasat-1',
    longitude: 132.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'vinasat-2',
    name: 'Vinasat-2',
    name_en: 'Vinasat-2',
    longitude: 131.8,
    status: 'active',
    band: ['Ku']
  },
  // Optus 澳大利亚卫星
  {
    id: 'optus-d1',
    name: 'Optus D1',
    name_en: 'Optus D1',
    longitude: 160.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'optus-d2',
    name: 'Optus D2',
    name_en: 'Optus D2',
    longitude: 152.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'optus-d3',
    name: 'Optus D3',
    name_en: 'Optus D3',
    longitude: 156.0,
    status: 'active',
    band: ['Ku']
  },
  // 西经卫星（美洲地区）
  {
    id: 'ses-1',
    name: 'SES-1',
    name_en: 'SES-1',
    longitude: -101.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'ses-2',
    name: 'SES-2',
    name_en: 'SES-2',
    longitude: -87.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'ses-3',
    name: 'SES-3',
    name_en: 'SES-3',
    longitude: -103.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'galaxy-19',
    name: 'Galaxy 19',
    name_en: 'Galaxy 19',
    longitude: -97.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'galaxy-16',
    name: 'Galaxy 16',
    name_en: 'Galaxy 16',
    longitude: -99.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-21',
    name: 'Intelsat 21',
    name_en: 'Intelsat 21',
    longitude: -58.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-34',
    name: 'Intelsat 34',
    name_en: 'Intelsat 34',
    longitude: -55.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'intelsat-14',
    name: 'Intelsat 14',
    name_en: 'Intelsat 14',
    longitude: -45.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'amazonas-2',
    name: 'Amazonas 2',
    name_en: 'Amazonas 2',
    longitude: -61.0,
    status: 'active',
    band: ['C', 'Ku', 'Ka']
  },
  {
    id: 'amazonas-3',
    name: 'Amazonas 3',
    name_en: 'Amazonas 3',
    longitude: -61.0,
    status: 'active',
    band: ['C', 'Ku', 'Ka']
  },
  {
    id: 'star-one-c2',
    name: 'Star One C2',
    name_en: 'Star One C2',
    longitude: -70.0,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'star-one-c4',
    name: 'Star One C4',
    name_en: 'Star One C4',
    longitude: -70.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  {
    id: 'echostar-14',
    name: 'EchoStar 14',
    name_en: 'EchoStar 14',
    longitude: -119.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'echostar-10',
    name: 'EchoStar 10',
    name_en: 'EchoStar 10',
    longitude: -110.0,
    status: 'active',
    band: ['Ku']
  },
  {
    id: 'directv-12',
    name: 'DirecTV 12',
    name_en: 'DirecTV 12',
    longitude: -103.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  {
    id: 'hispasat-30w-5',
    name: 'Hispasat 30W-5',
    name_en: 'Hispasat 30W-5',
    longitude: -30.0,
    status: 'active',
    band: ['Ku', 'Ka']
  },
  {
    id: 'nss-10',
    name: 'NSS-10',
    name_en: 'NSS-10',
    longitude: -37.5,
    status: 'active',
    band: ['C', 'Ku']
  },
  {
    id: 'telstar-12v',
    name: 'Telstar 12V',
    name_en: 'Telstar 12V',
    longitude: -15.0,
    status: 'active',
    band: ['Ku']
  }
];

// 按经度排序的辅助函数
export const getSatellitesSortedByLongitude = () => {
  return [...satellites].sort((a, b) => a.longitude - b.longitude);
};