// 位置类型定义
export interface Location {
  id: string;
  name: string;
  name_en: string;
  latitude: number;
  longitude: number;
  province?: string;
  country: string;
}

// 常用地点数据
export const locations: Location[] = [
  // 直辖市
  {
    id: 'beijing',
    name: '北京',
    name_en: 'Beijing',
    latitude: 39.9042,
    longitude: 116.4074,
    province: '北京',
    country: '中国'
  },
  {
    id: 'shanghai',
    name: '上海',
    name_en: 'Shanghai',
    latitude: 31.2304,
    longitude: 121.4737,
    province: '上海',
    country: '中国'
  },
  {
    id: 'tianjin',
    name: '天津',
    name_en: 'Tianjin',
    latitude: 39.3434,
    longitude: 117.3616,
    province: '天津',
    country: '中国'
  },
  {
    id: 'chongqing',
    name: '重庆',
    name_en: 'Chongqing',
    latitude: 29.4316,
    longitude: 106.9123,
    province: '重庆',
    country: '中国'
  },
  // 省会城市
  {
    id: 'guangzhou',
    name: '广州',
    name_en: 'Guangzhou',
    latitude: 23.1291,
    longitude: 113.2644,
    province: '广东',
    country: '中国'
  },
  {
    id: 'shenzhen',
    name: '深圳',
    name_en: 'Shenzhen',
    latitude: 22.5431,
    longitude: 114.0579,
    province: '广东',
    country: '中国'
  },
  {
    id: 'chengdu',
    name: '成都',
    name_en: 'Chengdu',
    latitude: 30.5728,
    longitude: 104.0668,
    province: '四川',
    country: '中国'
  },
  {
    id: 'wuhan',
    name: '武汉',
    name_en: 'Wuhan',
    latitude: 30.5928,
    longitude: 114.3055,
    province: '湖北',
    country: '中国'
  },
  {
    id: 'xian',
    name: '西安',
    name_en: "Xi'an",
    latitude: 34.3416,
    longitude: 108.9398,
    province: '陕西',
    country: '中国'
  },
  {
    id: 'hangzhou',
    name: '杭州',
    name_en: 'Hangzhou',
    latitude: 30.2741,
    longitude: 120.1551,
    province: '浙江',
    country: '中国'
  },
  {
    id: 'nanjing',
    name: '南京',
    name_en: 'Nanjing',
    latitude: 32.0603,
    longitude: 118.7969,
    province: '江苏',
    country: '中国'
  },
  {
    id: 'shenyang',
    name: '沈阳',
    name_en: 'Shenyang',
    latitude: 41.8057,
    longitude: 123.4315,
    province: '辽宁',
    country: '中国'
  },
  {
    id: 'harbin',
    name: '哈尔滨',
    name_en: 'Harbin',
    latitude: 45.8038,
    longitude: 126.5340,
    province: '黑龙江',
    country: '中国'
  },
  {
    id: 'changsha',
    name: '长沙',
    name_en: 'Changsha',
    latitude: 28.1940,
    longitude: 112.9824,
    province: '湖南',
    country: '中国'
  },
  {
    id: 'zhengzhou',
    name: '郑州',
    name_en: 'Zhengzhou',
    latitude: 34.7466,
    longitude: 113.6253,
    province: '河南',
    country: '中国'
  },
  {
    id: 'jinan',
    name: '济南',
    name_en: 'Jinan',
    latitude: 36.6512,
    longitude: 117.1205,
    province: '山东',
    country: '中国'
  },
  {
    id: 'qingdao',
    name: '青岛',
    name_en: 'Qingdao',
    latitude: 36.0671,
    longitude: 120.3826,
    province: '山东',
    country: '中国'
  },
  {
    id: 'dalian',
    name: '大连',
    name_en: 'Dalian',
    latitude: 38.9140,
    longitude: 121.6147,
    province: '辽宁',
    country: '中国'
  },
  {
    id: 'kunming',
    name: '昆明',
    name_en: 'Kunming',
    latitude: 25.0420,
    longitude: 102.7183,
    province: '云南',
    country: '中国'
  },
  {
    id: 'fuzhou',
    name: '福州',
    name_en: 'Fuzhou',
    latitude: 26.0745,
    longitude: 119.2965,
    province: '福建',
    country: '中国'
  },
  {
    id: 'xiamen',
    name: '厦门',
    name_en: 'Xiamen',
    latitude: 24.4798,
    longitude: 118.0894,
    province: '福建',
    country: '中国'
  },
  {
    id: 'nanchang',
    name: '南昌',
    name_en: 'Nanchang',
    latitude: 28.6829,
    longitude: 115.8579,
    province: '江西',
    country: '中国'
  },
  {
    id: 'hefei',
    name: '合肥',
    name_en: 'Hefei',
    latitude: 31.8206,
    longitude: 117.2272,
    province: '安徽',
    country: '中国'
  },
  {
    id: 'taiyuan',
    name: '太原',
    name_en: 'Taiyuan',
    latitude: 37.8706,
    longitude: 112.5489,
    province: '山西',
    country: '中国'
  },
  {
    id: 'shijiazhuang',
    name: '石家庄',
    name_en: 'Shijiazhuang',
    latitude: 38.0428,
    longitude: 114.5149,
    province: '河北',
    country: '中国'
  },
  {
    id: 'changchun',
    name: '长春',
    name_en: 'Changchun',
    latitude: 43.8171,
    longitude: 125.3235,
    province: '吉林',
    country: '中国'
  },
  {
    id: 'guiyang',
    name: '贵阳',
    name_en: 'Guiyang',
    latitude: 26.6470,
    longitude: 106.6302,
    province: '贵州',
    country: '中国'
  },
  {
    id: 'nanning',
    name: '南宁',
    name_en: 'Nanning',
    latitude: 22.8170,
    longitude: 108.3665,
    province: '广西',
    country: '中国'
  },
  {
    id: 'haikou',
    name: '海口',
    name_en: 'Haikou',
    latitude: 20.0200,
    longitude: 110.3280,
    province: '海南',
    country: '中国'
  },
  {
    id: 'lanzhou',
    name: '兰州',
    name_en: 'Lanzhou',
    latitude: 36.0611,
    longitude: 103.8343,
    province: '甘肃',
    country: '中国'
  },
  {
    id: 'xining',
    name: '西宁',
    name_en: 'Xining',
    latitude: 36.6171,
    longitude: 101.7782,
    province: '青海',
    country: '中国'
  },
  {
    id: 'yinchuan',
    name: '银川',
    name_en: 'Yinchuan',
    latitude: 38.4870,
    longitude: 106.2309,
    province: '宁夏',
    country: '中国'
  },
  {
    id: 'urumqi',
    name: '乌鲁木齐',
    name_en: 'Urumqi',
    latitude: 43.8256,
    longitude: 87.6168,
    province: '新疆',
    country: '中国'
  },
  {
    id: 'lhasa',
    name: '拉萨',
    name_en: 'Lhasa',
    latitude: 29.6520,
    longitude: 91.1720,
    province: '西藏',
    country: '中国'
  },
  {
    id: 'hohhot',
    name: '呼和浩特',
    name_en: 'Hohhot',
    latitude: 40.8424,
    longitude: 111.7500,
    province: '内蒙古',
    country: '中国'
  },
  // 特别行政区
  {
    id: 'hongkong',
    name: '香港',
    name_en: 'Hong Kong',
    latitude: 22.3193,
    longitude: 114.1694,
    country: '中国'
  },
  {
    id: 'macau',
    name: '澳门',
    name_en: 'Macau',
    latitude: 22.1987,
    longitude: 113.5439,
    country: '中国'
  },
  // 台湾
  {
    id: 'taipei',
    name: '台北',
    name_en: 'Taipei',
    latitude: 25.0330,
    longitude: 121.5654,
    province: '台湾',
    country: '中国'
  }
];

// 按省份分组
export const getLocationsByProvince = () => {
  const grouped: { [key: string]: Location[] } = {};
  locations.forEach(loc => {
    const key = loc.province || '直辖市/特别行政区';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(loc);
  });
  return grouped;
};

// 按名称搜索
export const searchLocationByName = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return locations.filter(loc =>
    loc.name.includes(query) ||
    loc.name_en.toLowerCase().includes(lowerQuery) ||
    (loc.province && loc.province.includes(query))
  );
};