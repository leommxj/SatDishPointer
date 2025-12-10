// 天线类型定义
export interface Antenna {
  id: string;
  name: string;
  name_en: string;
  type: 'offset' | 'prime_focus';
  offsetAngle?: number; // 偏馈角度（度），仅偏馈天线有此参数
}

// 天线数据 - 只保留两种基本类型
export const antennas: Antenna[] = [
  // 偏馈天线 - 默认偏馈角度22.5度
  {
    id: 'offset',
    name: '偏馈天线',
    name_en: 'Offset Antenna',
    type: 'offset',
    offsetAngle: 22.5
  },
  // 正馈天线
  {
    id: 'prime-focus',
    name: '正馈天线',
    name_en: 'Prime Focus Antenna',
    type: 'prime_focus'
  }
];
