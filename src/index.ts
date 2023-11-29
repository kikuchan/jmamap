const JMA_DATA_URL_BASE = 'https://www.jma.go.jp/bosai/{lv1}/data/{lv2}/';
const JMA_LAYER_URL_BASE = 'https://www.jma.go.jp/bosai/{lv1}/data/{lv2}/{basetime}/{member}/{validtime}/{lv3}/';

const defaultPathKeys = {
  lv1: 'jmatile',
  ext: 'png',
};

type LayerInfoTemplate = {
  type: 'vector' | 'tile' | 'vector-tile';
  layerUrl?: string;
  category: string;
  name: string;
  zoomLevelRange?: [number, number];
  zoomLevels?: number[];
  targetTimesFile?: false | string | string[];
  targetTimesElement?: string;
  basetimeDelay?: number;
  isCloud?: boolean;
  pathKeys?: {
    lv1?: string;
    lv2: string;
    lv3: string;
    member?: string;
    ext?: 'png' | 'jpg' | 'pbf';
  };
};

const LayerInfoDefs = {
  // 基本地図
  base: {
    type: 'tile',
    layerUrl: 'https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png',
    category: '基本地図',
    name: 'base',
    targetTimesFile: false,
    zoomLevelRange: [3, 11],
  },
  pale: {
    type: 'tile',
    layerUrl: 'https://www.jma.go.jp/tile/gsi/pale/{z}/{x}/{y}.png',
    category: '基本地図(地名あり)',
    name: 'pale',
    targetTimesFile: false,
    zoomLevelRange: [2, 14],
  },
  pale2: {
    type: 'tile',
    layerUrl: 'https://www.jma.go.jp/tile/gsi/pale2/{z}/{x}/{y}.png',
    category: '基本地図(地名なし)',
    name: 'pale2',
    targetTimesFile: false,
    zoomLevelRange: [2, 14],
  },
  green: {
    type: 'tile',
    layerUrl: 'https://www.jma.go.jp/tile/jma/green-cities/{z}/{x}/{y}.png',
    category: '基本地図',
    name: 'green',
    targetTimesFile: false,
    zoomLevelRange: [3, 10],
  },
  mask: {
    type: 'tile',
    pathKeys: { lv2: 'map', lv3: 'surf/mask' },
    category: '基本地図',
    name: 'mask',
    targetTimesFile: false,
    zoomLevelRange: [3, 14],
  },
  river: {
    type: 'tile',
    pathKeys: { lv2: 'map', lv3: 'surf/flood' },
    category: '基本地図',
    name: '河川',
    targetTimesFile: false,
    zoomLevelRange: [8, 14],
  },

  cities: {
    type: 'vector',
    pathKeys: { lv2: 'map', lv3: 'surf/municipality_name' },
    category: '基本地図',
    name: '自治体名',
    targetTimesFile: false,
  },

  // ひまわり
  'himawari/jp/visibleray': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B03/ALBD', ext: 'jpg' },
    category: 'ひまわり',
    name: '可視画像（日本域）',
    zoomLevelRange: [3, 6],
    targetTimesFile: 'targetTimes_jp.json',
    isCloud: true,
  },
  'himawari/jp/infrared': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B13/TBB', ext: 'jpg' },
    category: 'ひまわり',
    name: '赤外画像（日本域）',
    zoomLevelRange: [3, 6],
    targetTimesFile: 'targetTimes_jp.json',
    isCloud: true,
  },
  'himawari/jp/steam': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'B08/TBB', ext: 'jpg' },
    category: 'ひまわり',
    name: '水蒸気画像（日本域）',
    zoomLevelRange: [3, 6],
    targetTimesFile: 'targetTimes_jp.json',
    isCloud: true,
  },
  'himawari/jp/truecolor': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'REP/ETC', ext: 'jpg' },
    category: 'ひまわり',
    name: 'トゥルーカラー再現画像（日本域）',
    zoomLevelRange: [3, 6],
    targetTimesFile: 'targetTimes_jp.json',
  },
  'himawari/jp/cloudtop': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'jp', lv3: 'SND/ETC', ext: 'jpg' },
    category: 'ひまわり',
    name: '雲頂強調画像（日本域）',
    zoomLevelRange: [3, 6],
    targetTimesFile: 'targetTimes_jp.json',
  },
  'himawari/fd/visibleray': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B03/ALBD', ext: 'jpg' },
    category: 'ひまわり',
    name: '可視画像（全球）',
    zoomLevelRange: [3, 5],
    targetTimesFile: 'targetTimes_fd.json',
    isCloud: true,
  },
  'himawari/fd/infrared': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B13/TBB', ext: 'jpg' },
    category: 'ひまわり',
    name: '赤外画像（全球）',
    zoomLevelRange: [3, 5],
    targetTimesFile: 'targetTimes_fd.json',
    isCloud: true,
  },
  'himawari/fd/steam': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'B08/TBB', ext: 'jpg' },
    category: 'ひまわり',
    name: '水蒸気画像（全球）',
    zoomLevelRange: [3, 5],
    targetTimesFile: 'targetTimes_fd.json',
    isCloud: true,
  },
  'himawari/fd/truecolor': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'REP/ETC', ext: 'jpg' },
    category: 'ひまわり',
    name: 'トゥルーカラー再現画像（全球）',
    zoomLevelRange: [3, 5],
    targetTimesFile: 'targetTimes_fd.json',
  },
  'himawari/fd/cloudtop': {
    type: 'tile',
    pathKeys: { lv1: 'himawari', lv2: 'satimg', member: 'fd', lv3: 'SND/ETC', ext: 'jpg' },
    category: 'ひまわり',
    name: '雲頂強調画像（全球）',
    zoomLevelRange: [3, 5],
    targetTimesFile: 'targetTimes_fd.json',
  },

  // 雨雲の動き
  raincloud: {
    type: 'tile',
    pathKeys: { lv2: 'nowc', lv3: 'surf/hrpns' },
    category: '雨雲の動き',
    name: '雨雲の動き（高解像度降水ナウキャスト）',
    zoomLevelRange: [3, 10],
    targetTimesFile: ['targetTimes_N1.json', 'targetTimes_N2.json'],
    targetTimesElement: 'hrpns',
  },
  thunder: {
    type: 'tile',
    pathKeys: { lv2: 'nowc', lv3: 'surf/thns' },
    category: '雨雲の動き',
    name: '雷活動度（雷ナウキャスト）',
    zoomLevelRange: [3, 9],
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'thns',
  },
  tornado: {
    type: 'tile',
    pathKeys: { lv2: 'nowc', lv3: 'surf/trns' },
    category: '雨雲の動き',
    name: '竜巻発生確度（竜巻発生確度ナウキャスト）',
    zoomLevelRange: [3, 10],
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'trns',
  }, // XXX: zoomLevels 不明
  'amds-rain10m': {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/amds_rain10m' },
    category: '雨雲の動き',
    name: 'アメダス１０分間雨量',
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'amds_rain10m',
    basetimeDelay: 15 * 60 * 1000,
  }, // 15分、データが遅れる
  liden: {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/liden' },
    category: '雨雲の動き',
    name: '前５分間の雷の状況',
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'liden',
  },
  'raincloud-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/hrpns_nd' },
    category: '雨雲の動き',
    name: '観測範囲外領域 [雨雲の動き（高解像度降水ナウキャスト）]',
    targetTimesFile: ['targetTimes_N1.json', 'targetTimes_N2.json'],
    targetTimesElement: 'hrpns_nd',
  },
  'thunder-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/thns_nd' },
    category: '雨雲の動き',
    name: '観測範囲外領域 [雷活動度（雷ナウキャスト）]',
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'thns_nd',
  },
  'tornado-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/trns_nd' },
    category: '雨雲の動き',
    name: '観測範囲外領域 [竜巻発生確度（竜巻発生確度ナウキャスト）]',
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'trns_nd',
  },
  'linear-rainfall': {
    type: 'vector',
    pathKeys: { lv2: 'nowc', lv3: 'surf/slmcs' },
    category: '雨雲の動き',
    name: '線状降水帯',
    targetTimesFile: 'targetTimes_N3.json',
    targetTimesElement: 'slmcs',
    basetimeDelay: 15 * 60 * 1000,
  }, // 15分、データが遅れる

  // 今後の雨
  'rainfall-1h': {
    type: 'tile',
    pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf' },
    category: '今後の雨',
    name: '1時間降水量',
    zoomLevelRange: [3, 10],
    targetTimesElement: 'rasrf',
  },
  'rainfall-3h': {
    type: 'tile',
    pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf03h' },
    category: '今後の雨',
    name: '3時間降水量',
    zoomLevelRange: [3, 10],
    targetTimesElement: 'rasrf03h',
  },
  'rainfall-24h': {
    type: 'tile',
    pathKeys: { lv2: 'rasrf', lv3: 'surf/rasrf24h' },
    category: '今後の雨',
    name: '24時間降水量',
    zoomLevelRange: [3, 10],
    targetTimesElement: 'rasrf24h',
  },

  // 天気予報分布
  weather: {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/wm' },
    category: '天気予報分布',
    name: '天気',
    targetTimesElement: 'wm',
    zoomLevelRange: [3, 10],
  },
  temperature: {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/temp' },
    category: '天気予報分布',
    name: '気温',
    targetTimesElement: 'temp',
    zoomLevelRange: [3, 10],
  },
  r3: {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/r3' },
    category: '天気予報分布',
    name: '3時間降水量',
    targetTimesElement: 'r3',
    zoomLevelRange: [3, 10],
  }, // XXX: （basetime, validtime のペアを）同時刻にしても絵が 'rasrf' と合わない…
  s3: {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/s3' },
    category: '天気予報分布',
    name: '3時間降雪量',
    targetTimesElement: 's3',
    zoomLevelRange: [3, 10],
  }, // XXX:  'snowf03h' で↑と同様？ 未検証
  'max-temp': {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/max_temp' },
    category: '天気予報分布',
    name: '日中の最高気温',
    targetTimesElement: 'max_temp',
    zoomLevelRange: [3, 10],
  },
  'min-temp': {
    type: 'tile',
    pathKeys: { lv2: 'wdist', lv3: 'surf/min_temp' },
    category: '天気予報分布',
    name: '朝の最低気温',
    targetTimesElement: 'min_temp',
    zoomLevelRange: [3, 10],
  },

  'temp-point': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/temp_point' },
    category: '天気予報分布',
    name: '気温',
    targetTimesElement: 'temp_point',
  },
  'max-temp-point': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/min_temp_point' },
    category: '天気予報分布',
    name: '日中の最高気温',
    targetTimesElement: 'max_temp_point',
  },
  'min-temp-point': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/max_temp_point' },
    category: '天気予報分布',
    name: '朝の最低気温',
    targetTimesElement: 'min_temp_point',
  },

  'weather-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/wm_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [天気]',
    targetTimesElement: 'wm_nd',
  },
  'temperature-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/temp_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [気温]',
    targetTimesElement: 'temp_nd',
  },
  'r3-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/r3_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [3時間降水量]',
    targetTimesElement: 'r3_nd',
  },
  's3-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/s3_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [3時間降雪量]',
    targetTimesElement: 's3_nd',
  },
  'max-temp-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/max_temp_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [日中の最高気温]',
    targetTimesElement: 'max_temp_nd',
  },
  'min-temp-nodata': {
    type: 'vector',
    pathKeys: { lv2: 'wdist', lv3: 'surf/min_temp_nd' },
    category: '天気予報分布',
    name: '観測範囲外領域 [朝の最低気温]',
    targetTimesElement: 'min_temp_nd',
  },

  // 現在の雪
  snow: {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowd' },
    category: '現在の雪',
    name: '積雪の深さ',
    zoomLevelRange: [3, 11],
  },
  'snowfall-3h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf03h' },
    category: '現在の雪',
    name: '3時間降雪量',
    zoomLevelRange: [3, 11],
  },
  'snowfall-6h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf06h' },
    category: '現在の雪',
    name: '6時間降雪量',
    zoomLevelRange: [3, 11],
  },
  'snowfall-12h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf12h' },
    category: '現在の雪',
    name: '12時間降雪量',
    zoomLevelRange: [3, 11],
  },
  'snowfall-24h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf24h' },
    category: '現在の雪',
    name: '24時間降雪量',
    zoomLevelRange: [3, 11],
  },
  'snowfall-48h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf48h' },
    category: '現在の雪',
    name: '48時間降雪量',
    zoomLevelRange: [3, 11],
  },
  'snowfall-72h': {
    type: 'tile',
    pathKeys: { lv2: 'snow', lv3: 'surf/snowf72h' },
    category: '現在の雪',
    name: '72時間降雪量',
    zoomLevelRange: [3, 11],
  },

  // 海上分布予報
  ws: {
    type: 'tile',
    pathKeys: { lv2: 'umimesh', lv3: 'surf/ws' },
    category: '海上分布予報',
    name: '風速',
    zoomLevelRange: [3, 8],
  },
  wavh: {
    type: 'tile',
    pathKeys: { lv2: 'umimesh', lv3: 'surf/wavh' },
    category: '海上分布予報',
    name: '波の高さ',
    zoomLevelRange: [3, 8],
  },
  vis: {
    type: 'tile',
    pathKeys: { lv2: 'umimesh', lv3: 'surf/vis' },
    category: '海上分布予報',
    name: '視程',
    zoomLevelRange: [3, 8],
  },
  icing: {
    type: 'tile',
    pathKeys: { lv2: 'umimesh', lv3: 'surf/icing' },
    category: '海上分布予報',
    name: '着氷の程度',
    zoomLevelRange: [3, 8],
  },

  // 危険度分布
  shinsui1: {
    type: 'tile',
    layerUrl: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_oldlegend/{z}/{x}/{y}.png',
    category: '危険度分布',
    name: '洪水浸水想定区域（計画規模）',
    targetTimesFile: false,
    zoomLevelRange: [2, 16],
  },
  shinsui2: {
    type: 'tile',
    layerUrl: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/{z}/{x}/{y}.png',
    category: '危険度分布',
    name: '洪水浸水想定区域（想定最大規模）',
    targetTimesFile: false,
    zoomLevelRange: [2, 12],
  },

  landslide: { type: 'tile', pathKeys: { lv2: 'risk', lv3: 'surf/land' }, category: '危険度分布', name: '土砂災害' },
  inundation: { type: 'tile', pathKeys: { lv2: 'risk', lv3: 'surf/inund' }, category: '危険度分布', name: '浸水害' },
  flood: {
    type: 'vector-tile',
    pathKeys: { lv2: 'risk', lv3: 'surf/flood', ext: 'pbf' },
    category: '危険度分布',
    name: '洪水害',
  },
} satisfies Record<string, LayerInfoTemplate>;
const jmaLayerInfo: Record<string, LayerInfoTemplate> = LayerInfoDefs;
export type LayerName = keyof typeof LayerInfoDefs;
export type LayerType<T extends LayerName> = (typeof LayerInfoDefs)[T]['type'];

const _minZoomLevel = 1;
const _maxZoomLevel = 24;
let _lastTimeForCache: string | null = null;
let _targetTimeCache: Record<string, Promise<string>> = {};

function parseUtcYmdHM(utcYmdHM: string) {
  const Y = Number(utcYmdHM.substring(0, 4));
  const m = Number(utcYmdHM.substring(4, 6));
  const d = Number(utcYmdHM.substring(6, 8));
  const H = Number(utcYmdHM.substring(8, 10));
  const M = Number(utcYmdHM.substring(10, 12));

  return new Date(Date.UTC(Y, m - 1, d, H, M));
}

function toUtcYmdHM(t: Date) {
  return t
    .toJSON()
    .substring(0, 16)
    .replace(/[^0-9]/g, '');
}

function parseJSON(s: string) {
  try {
    return JSON.parse(s);
  } catch (e) {
    console.error(s);
    throw e;
  }
}

function isStaticLayer(layerId: LayerName) {
  const info = jmaLayerInfo[layerId];
  if (!info) return false;

  return info.targetTimesFile === false || info.targetTimesFile === undefined;
}

export type TargetTime = {
  tense: 'forecast' | 'past' | 'latest';
  layerInfo: ReturnType<typeof getLayerInfo>;

  basetime?: string;
  validtime?: string;

  elements?: string[];

  // extension
  basetimeInDate?: Date;
  validtimeInDate?: Date;
};

export async function fetchTargetTimes(layerId: LayerName): Promise<TargetTime[]> {
  const info = jmaLayerInfo[layerId];
  if (!info) throw new Error('Unknown layer');

  if (isStaticLayer(layerId)) return [{ layerInfo: getLayerInfo(layerId), tense: 'latest' }];

  const timeForCache = toUtcYmdHM(new Date()); // 1分単位
  if (timeForCache !== _lastTimeForCache) {
    _targetTimeCache = {};
    _lastTimeForCache = timeForCache;
  }

  const files = Array.isArray(info.targetTimesFile)
    ? info.targetTimesFile
    : [info.targetTimesFile || 'targetTimes.json'];
  const targetTimes: TargetTime[] = await Promise.all(
    files.map(async (file) => {
      const url = rewriteURL(JMA_DATA_URL_BASE + file + '?_=' + timeForCache, { ...defaultPathKeys, ...info.pathKeys });

      if (_targetTimeCache[url] !== undefined) return _targetTimeCache[url].then((s) => parseJSON(s) as TargetTime[]);

      return (_targetTimeCache[url] = fetch(url).then((res) => res.text())).then((s) => parseJSON(s) as TargetTime[]);
    }),
  )
    .then((values) => Array.prototype.concat.apply([], values))
    .then((json: TargetTime[]) =>
      info.targetTimesElement
        ? json.filter(
            (e) =>
              e.elements &&
              e.elements.indexOf(info.targetTimesElement!) >= 0 &&
              parseUtcYmdHM(e.basetime!).getTime() + (info.basetimeDelay || 0) <= new Date().getTime(),
          )
        : json,
    );
  targetTimes.sort((l, r) =>
    (l.basetime === r.basetime ? l.validtime! < r.validtime! : l.basetime! < r.basetime!) ? -1 : 1,
  );

  let latestBaseTime: Date | undefined = undefined;
  targetTimes.forEach((json) => {
    if (json.basetime) json.basetimeInDate = parseUtcYmdHM(json.basetime);
    if (json.validtime) json.validtimeInDate = parseUtcYmdHM(json.validtime);

    json.tense = json.basetimeInDate! < json.validtimeInDate! ? 'forecast' : 'past';
    if (!latestBaseTime || latestBaseTime < json.basetimeInDate!) latestBaseTime = json.basetimeInDate;

    json.layerInfo = getLayerInfo(layerId, json);
  });

  // set latest
  const latest = targetTimes.find((json) => json.basetimeInDate === latestBaseTime && json.basetime === json.validtime);
  if (latest) latest.tense = 'latest';

  return targetTimes;
}

type Format = 'geojson' | 'jpg' | 'png' | 'pbf';

type GetLayerInfoResult = {
  id: LayerName;
  name: string;
  category: string;

  requireTargetTimes: boolean;

  layerType: 'tile' | 'vector' | 'vector-tile';
  format: Format;
  isCloud?: boolean;

  attributions: string;

  basetimeDelay: number;

  url: string;

  zoomLevels?: number[];
  minZoom?: number;
  maxZoom?: number;
};
export function getLayerInfo(layerId: LayerName, template: Record<string, unknown> = {}): GetLayerInfoResult {
  const info = jmaLayerInfo[layerId];
  if (!info) throw new Error('Unknown layer');

  const isGeoJSON = info.type === 'vector';

  const result = {
    id: layerId,
    name: info.name || layerId,
    category: info.category || '',

    requireTargetTimes: !isStaticLayer(layerId),

    layerType: info.type || 'tile',
    format: isGeoJSON ? 'geojson' : (((info.pathKeys && info.pathKeys.ext) || defaultPathKeys.ext) as Format),
    isCloud: info.isCloud || false,

    attributions: '気象データ &copy; Japan Meteorological Agency',

    basetimeDelay: info.basetimeDelay || 0,

    url: getLayerURL(layerId, template),
  };

  if (!info.type || info.type === 'tile') {
    const minZoomLevel = (info.zoomLevelRange && info.zoomLevelRange[0]) || _minZoomLevel;
    const maxZoomLevel = (info.zoomLevelRange && info.zoomLevelRange[1]) || _maxZoomLevel;
    const zoomLevels =
      info.zoomLevels || new Array(maxZoomLevel - minZoomLevel + 1).fill(0).map((_, i) => i + minZoomLevel);

    return {
      ...result,

      zoomLevels,
      minZoom: Math.max(Math.min(...zoomLevels), _minZoomLevel),
      maxZoom: Math.min(Math.max(...zoomLevels), _maxZoomLevel),
    };
  }

  return result;
}

function rewriteURL(url: string, template: Record<string, string | number>): string {
  if (!template) return url;
  return template
    ? url.replace(/{([a-zA-Z0-9]+)}/g, (_, p1) =>
        typeof template[p1] === 'string' || typeof template[p1] === 'number' ? String(template[p1]) : `{${p1}}`,
      )
    : url;
}

export function getLayerURL(layerId: LayerName, targetTime: Record<string, unknown>, template: Record<string, unknown> = {}) {
  const info = jmaLayerInfo[layerId];
  if (!info) throw new Error('Unknown layer');

  const appendPath = !info.type || info.type === 'tile' ? '{z}/{x}/{y}.{ext}' : 'data.geojson';

  const layerUrl = info.layerUrl || JMA_LAYER_URL_BASE + appendPath;

  return rewriteURL(layerUrl, {
    ...(isStaticLayer(layerId) || targetTime ? { basetime: 'none', member: 'none', validtime: 'none' } : {}), // replace only if there are no targetTimes files
    ...defaultPathKeys,
    ...(targetTime || {}),
    ...(info.pathKeys || {}),
    ...(template || {}),
  });
}

export function getLayerIds() {
  return Object.keys(jmaLayerInfo);
}

export default {
  fetchTargetTimes,
  getLayerInfo,
  getLayerURL,
  getLayerIds,
};
